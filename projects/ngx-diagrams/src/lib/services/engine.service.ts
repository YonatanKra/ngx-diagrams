import { Injectable, ComponentFactoryResolver, ViewContainerRef, ComponentRef, Renderer2, RendererFactory2 } from '@angular/core';
import { AbstractNodeFactory } from '../factories/node.factory';
import { DiagramModel } from '../models/diagram.model';
import { DefaultNodeFactory } from '../defaults/factories/default-node.factory';
import { NodeModel } from '../models/node.model';
import { AbstractLinkFactory } from '../factories/link.factory';
import { AbstractPortFactory } from '../factories/port.factory';
import { DefaultPortFactory } from '../defaults/factories/default-port.factory';
import { LinkModel } from '../models/link.model';
import { PortModel } from '../models/port.model';
import { BehaviorSubject } from 'rxjs';
import { take, delay, filter } from 'rxjs/operators';
import { DefaultLinkFactory } from '../defaults/factories/default-link.factory';
import { BaseEntity } from '../base.entity';
import { NgxDiagramsModule } from '../ngx-diagrams.module';
import { AbstractLabelFactory } from '../factories/label.factory';
import { LabelModel } from '../models/label.model';
import { DefaultLabelFactory } from '../defaults/factories/default-label.factory';
import { flatMap, concat, minBy, maxBy, cloneDeep, range } from 'lodash';
import { ROUTING_SCALING_FACTOR, PathFinding } from '../utils';

@Injectable({ providedIn: NgxDiagramsModule })
export class DiagramEngine {
	private _renderer: Renderer2;
	private nodeFactories: { [s: string]: AbstractNodeFactory };
	private labelFactories: { [s: string]: AbstractLabelFactory };
	private linkFactories: { [s: string]: AbstractLinkFactory };
	private portFactories: { [s: string]: AbstractPortFactory };
	private canvas$: BehaviorSubject<Element>;

	smartRouting: boolean;
	pathfinding: PathFinding;

	// calculated only when smart routing is active
	canvasMatrix: number[][] = [];
	routingMatrix: number[][] = [];
	// used when at least one element has negative coordinates
	hAdjustmentFactor = 0;
	vAdjustmentFactor = 0;

	diagramModel: DiagramModel;

	constructor(private resolver: ComponentFactoryResolver, private rendererFactory: RendererFactory2) {
		this._renderer = this.rendererFactory.createRenderer(null, null);
		this.nodeFactories = {};
		this.linkFactories = {};
		this.portFactories = {};
		this.labelFactories = {};
		this.canvas$ = new BehaviorSubject<Element>(null);
	}

	createDiagram() {
		this.diagramModel = new DiagramModel(this);
		return this.diagramModel;
	}

	registerDefaultFactories() {
		this.registerNodeFactory(new DefaultNodeFactory(this.resolver, this._renderer));
		this.registerPortFactory(new DefaultPortFactory(this.resolver, this._renderer));
		this.registerLinkFactory(new DefaultLinkFactory(this.resolver, this._renderer));
		this.registerLabelFactory(new DefaultLabelFactory(this.resolver, this._renderer));
	}

	//#region Factories
	// LABELS
	registerLabelFactory(labelFactory: AbstractLabelFactory) {
		this.labelFactories[labelFactory.type] = labelFactory;
	}

	getLabelFactories(): { [s: string]: AbstractLabelFactory } {
		return this.labelFactories;
	}

	getLabelFactory(type: string): AbstractLabelFactory {
		if (this.labelFactories[type]) {
			return this.labelFactories[type];
		}
		throw new Error(`cannot find factory for node of type: [${type}]`);
	}

	getFactoryForLabel(label: LabelModel): AbstractLabelFactory | null {
		return this.getLabelFactory(label.getType());
	}

	generateWidgetForLabel(label: LabelModel, labelHost: ViewContainerRef): ComponentRef<LabelModel> | null {
		const labelFactory = this.getFactoryForLabel(label);
		if (!labelFactory) {
			throw new Error(`Cannot find widget factory for node: ${label.getType()}`);
		}
		return labelFactory.generateWidget(label, labelHost);
	}

	// NODES
	registerNodeFactory(nodeFactory: AbstractNodeFactory) {
		this.nodeFactories[nodeFactory.type] = nodeFactory;
	}

	getNodeFactories(): { [s: string]: AbstractNodeFactory } {
		return this.nodeFactories;
	}

	getNodeFactory(type: string): AbstractNodeFactory {
		if (this.nodeFactories[type]) {
			return this.nodeFactories[type];
		}
		throw new Error(`cannot find factory for node of type: [${type}]`);
	}

	getFactoryForNode(node: NodeModel): AbstractNodeFactory | null {
		return this.getNodeFactory(node.getType());
	}

	generateWidgetForNode(node: NodeModel, nodesHost: ViewContainerRef): ComponentRef<NodeModel> | null {
		const nodeFactory = this.getFactoryForNode(node);
		if (!nodeFactory) {
			throw new Error(`Cannot find widget factory for node: ${node.getType()}`);
		}
		return nodeFactory.generateWidget(this, node, nodesHost);
	}

	// PORTS
	registerPortFactory(factory: AbstractPortFactory) {
		this.portFactories[factory.type] = factory;
	}

	getPortFactories() {
		return this.portFactories;
	}

	getPortFactory(type: string): AbstractPortFactory {
		if (this.portFactories[type]) {
			return this.portFactories[type];
		}
		throw new Error(`cannot find factory for port of type: [${type}]`);
	}

	getFactoryForPort(port: PortModel): AbstractPortFactory | null {
		return this.getPortFactory(port.getType());
	}

	generateWidgetForPort(port: PortModel, portsHost: ViewContainerRef): ComponentRef<PortModel> | null {
		const portFactory = this.getFactoryForPort(port);
		if (!portFactory) {
			throw new Error(`Cannot find widget factory for port: ${port.getType()}`);
		}
		return portFactory.generateWidget(port, portsHost);
	}

	// LINKS
	getLinkFactories(): { [s: string]: AbstractLinkFactory } {
		return this.linkFactories;
	}

	registerLinkFactory(factory: AbstractLinkFactory) {
		this.linkFactories[factory.type] = factory;
	}

	getLinkFactory(type: string): AbstractLinkFactory {
		if (this.linkFactories[type]) {
			return this.linkFactories[type];
		}
		throw new Error(`cannot find factory for link of type: [${type}]`);
	}

	getFactoryForLink(link: LinkModel): AbstractLinkFactory | null {
		return this.getLinkFactory(link.getType());
	}

	generateWidgetForLink(link: LinkModel, linksHost: ViewContainerRef): ComponentRef<LinkModel> | null {
		const linkFactory = this.getFactoryForLink(link);
		if (!linkFactory) {
			throw new Error(`Cannot find link factory for link: ${link.getType()}`);
		}
		return linkFactory.generateWidget(this, link, linksHost);
	}
	//#endregion

	getNodeElement(node: NodeModel): HTMLElement {
		const selector = this.canvas$.getValue().querySelector(`[data-nodeid="${node.id}"]`);
		if (selector === null) {
			throw new Error('Cannot find Node element with node id: [' + node.id + ']');
		}
		return selector as HTMLElement;
	}

	getNodePortElement(port: PortModel): HTMLElement {
		const selector = this.canvas$.getValue().querySelector(`[data-nodeid="${port.getParent().id}"] [data-portid="${port.id}"]`);
		if (selector === null) {
			throw new Error('Cannot find Node Port element with node id: [' + port.getParent().id + '] and port id: [' + port.id + ']');
		}
		return selector as HTMLElement;
	}

	getPortCenter(port: PortModel) {
		const sourceElement = this.getNodePortElement(port);
		const sourceRect = sourceElement.getBoundingClientRect();
		const rel = this.getRelativePoint(sourceRect.left, sourceRect.top);

		return {
			x: sourceElement.offsetWidth / 2 + (rel.x - this.diagramModel.getOffsetX()) / (this.diagramModel.getZoomLevel() / 100.0),
			y: sourceElement.offsetHeight / 2 + (rel.y - this.diagramModel.getOffsetY()) / (this.diagramModel.getZoomLevel() / 100.0)
		};
	}

	/**
	 * Calculate rectangular coordinates of the port passed in.
	 */
	getPortCoords(
		port: PortModel
	): {
		x: number;
		y: number;
		width: number;
		height: number;
	} {
		const sourceElement = this.getNodePortElement(port);
		const sourceRect = sourceElement.getBoundingClientRect() as DOMRect;
		const canvasRect = this.canvas$.getValue().getBoundingClientRect() as ClientRect;

		return {
			x: (sourceRect.x - this.diagramModel.getOffsetX()) / (this.diagramModel.getZoomLevel() / 100.0) - canvasRect.left,
			y: (sourceRect.y - this.diagramModel.getOffsetY()) / (this.diagramModel.getZoomLevel() / 100.0) - canvasRect.top,
			width: sourceRect.width,
			height: sourceRect.height
		};
	}

	/**
	 * Determine the width and height of the node passed in.
	 * It currently assumes nodes have a rectangular shape, can be overriden for customised shapes.
	 */
	getNodeDimensions(node: NodeModel): { width: number; height: number } {
		if (!this.canvas$.getValue()) {
			return {
				width: 0,
				height: 0
			};
		}

		const nodeElement = this.getNodeElement(node);
		const nodeRect = nodeElement.getBoundingClientRect();

		return {
			width: nodeRect.width,
			height: nodeRect.height
		};
	}

	setCanvas(canvas: Element) {
		this.canvas$.next(canvas);
	}

	getRelativeMousePoint(event: MouseEvent): { x: number; y: number } {
		const point = this.getRelativePoint(event.clientX, event.clientY);
		return {
			x: (point.x - this.diagramModel.getOffsetX()) / (this.diagramModel.getZoomLevel() / 100.0),
			y: (point.y - this.diagramModel.getOffsetY()) / (this.diagramModel.getZoomLevel() / 100.0)
		};
	}

	getRelativePoint(x: number, y: number) {
		const canvasRect = this.canvas$.getValue().getBoundingClientRect();
		return { x: x - canvasRect.left, y: y - canvasRect.top };
	}

	getDiagramModel() {
		return this.diagramModel;
	}

	isModelLocked(model: BaseEntity) {
		if (this.diagramModel.getLocked()) {
			return true;
		}

		return model.getLocked();
	}

	isSmartRoutingEnabled() {
		return !!this.smartRouting;
	}

	setSmartRoutingStatus(status: boolean) {
		if (status) {
			this.pathfinding = new PathFinding(this);
		} else {
			this.pathfinding = null;
		}

		this.smartRouting = status;
	}

	getPathfinding() {
		return this.pathfinding;
	}

	/**
	 * A representation of the canvas in the following format:
	 *
	 * +-----------------+
	 * | 0 0 0 0 0 0 0 0 |
	 * | 0 0 0 0 0 0 0 0 |
	 * | 0 0 0 0 0 0 0 0 |
	 * | 0 0 0 0 0 0 0 0 |
	 * | 0 0 0 0 0 0 0 0 |
	 * +-----------------+
	 *
	 * In which all walkable points are marked by zeros.
	 * It uses @link{#ROUTING_SCALING_FACTOR} to reduce the matrix dimensions and improve performance.
	 */
	getCanvasMatrix(): number[][] {
		if (this.canvasMatrix.length === 0) {
			this.calculateCanvasMatrix();
		}

		return this.canvasMatrix;
	}

	calculateCanvasMatrix() {
		const { width: canvasWidth, hAdjustmentFactor, height: canvasHeight, vAdjustmentFactor } = this.calculateMatrixDimensions();

		this.hAdjustmentFactor = hAdjustmentFactor;
		this.vAdjustmentFactor = vAdjustmentFactor;

		const matrixWidth = Math.ceil(canvasWidth / ROUTING_SCALING_FACTOR);
		const matrixHeight = Math.ceil(canvasHeight / ROUTING_SCALING_FACTOR);

		this.canvasMatrix = range(0, matrixHeight).map(() => {
			return new Array(matrixWidth).fill(0);
		});
	}

	/**
	 * A representation of the canvas in the following format:
	 *
	 * +-----------------+
	 * | 0 0 1 1 0 0 0 0 |
	 * | 0 0 1 1 0 0 1 1 |
	 * | 0 0 0 0 0 0 1 1 |
	 * | 1 1 0 0 0 0 0 0 |
	 * | 1 1 0 0 0 0 0 0 |
	 * +-----------------+
	 *
	 * In which all points blocked by a node (and its ports) are
	 * marked as 1; points were there is nothing (ie, free) receive 0.
	 */
	getRoutingMatrix(): number[][] {
		if (this.routingMatrix.length === 0) {
			this.calculateRoutingMatrix();
		}

		return this.routingMatrix;
	}

	calculateRoutingMatrix(): void {
		const matrix = cloneDeep(this.getCanvasMatrix());

		// nodes need to be marked as blocked points
		this.markNodes(matrix);

		// same thing for ports
		this.markPorts(matrix);

		this.routingMatrix = matrix;
	}

	/**
	 * The routing matrix does not have negative indexes, but elements could be negatively positioned.
	 * We use the functions below to translate back and forth between these coordinates, relying on the
	 * calculated values of hAdjustmentFactor and vAdjustmentFactor.
	 */
	translateRoutingX(x: number, reverse: boolean = false) {
		return x + this.hAdjustmentFactor * (reverse ? -1 : 1);
	}
	translateRoutingY(y: number, reverse: boolean = false) {
		return y + this.vAdjustmentFactor * (reverse ? -1 : 1);
	}

	/**
	 * Despite being a long method, we simply iterate over all three collections (nodes, ports and points)
	 * to find the highest X and Y dimensions, so we can build the matrix large enough to contain all elements.
	 */
	calculateMatrixDimensions = (): {
		width: number;
		hAdjustmentFactor: number;
		height: number;
		vAdjustmentFactor: number;
	} => {
		const allNodesCoords = Object.values(this.diagramModel.getNodes()).map(item => ({
			x: item.getCoords().x,
			width: item.getWidth(),
			y: item.getCoords().y,
			height: item.getHeight()
		}));

		const allLinks = Object.values(this.diagramModel.getLinks());
		const allPortsCoords = flatMap(allLinks.map(link => [link.getSourcePort(), link.getTargetPort()]))
			.filter(port => port !== null)
			.map(item => ({
				x: item.getX(),
				width: item.getWidth(),
				y: item.getY(),
				height: item.getHeight()
			}));
		const allPointsCoords = flatMap(allLinks.map(link => link.getPoints())).map(item => ({
			// points don't have width/height, so let's just use 0
			x: item.getCoords().x,
			width: 0,
			y: item.getCoords().y,
			height: 0
		}));

		const canvas = this.canvas$.getValue() as HTMLDivElement;
		const minX =
			Math.floor(Math.min(minBy(concat(allNodesCoords, allPortsCoords, allPointsCoords), item => item.x).x, 0) / ROUTING_SCALING_FACTOR) *
			ROUTING_SCALING_FACTOR;
		const maxXElement = maxBy(concat(allNodesCoords, allPortsCoords, allPointsCoords), item => item.x + item.width);
		const maxX = Math.max(maxXElement.x + maxXElement.width, canvas.offsetWidth);

		const minY =
			Math.floor(Math.min(minBy(concat(allNodesCoords, allPortsCoords, allPointsCoords), item => item.y).y, 0) / ROUTING_SCALING_FACTOR) *
			ROUTING_SCALING_FACTOR;
		const maxYElement = maxBy(concat(allNodesCoords, allPortsCoords, allPointsCoords), item => item.y + item.height);
		const maxY = Math.max(maxYElement.y + maxYElement.height, canvas.offsetHeight);

		return {
			width: Math.ceil(Math.abs(minX) + maxX),
			hAdjustmentFactor: Math.abs(minX) / ROUTING_SCALING_FACTOR + 1,
			height: Math.ceil(Math.abs(minY) + maxY),
			vAdjustmentFactor: Math.abs(minY) / ROUTING_SCALING_FACTOR + 1
		};
	};

	/**
	 * Updates (by reference) where nodes will be drawn on the matrix passed in.
	 */
	markNodes = (matrix: number[][]): void => {
		Object.values(this.diagramModel.getNodes()).forEach(node => {
			const startX = Math.floor(node.getCoords().x / ROUTING_SCALING_FACTOR);
			const endX = Math.ceil((node.getCoords().x + node.getWidth()) / ROUTING_SCALING_FACTOR);
			const startY = Math.floor(node.getCoords().y / ROUTING_SCALING_FACTOR);
			const endY = Math.ceil((node.getCoords().y + node.getHeight()) / ROUTING_SCALING_FACTOR);

			for (let x = startX - 1; x <= endX + 1; x++) {
				for (let y = startY - 1; y < endY + 1; y++) {
					this.markMatrixPoint(matrix, this.translateRoutingX(x), this.translateRoutingY(y));
				}
			}
		});
	};

	/**
	 * Updates (by reference) where ports will be drawn on the matrix passed in.
	 */
	markPorts = (matrix: number[][]): void => {
		const allElements = flatMap(
			Object.values(this.diagramModel.getLinks()).map(link => [].concat(link.getSourcePort(), link.getTargetPort()))
		);
		allElements
			.filter(port => port !== null)
			.forEach(port => {
				const startX = Math.floor(port.x / ROUTING_SCALING_FACTOR);
				const endX = Math.ceil((port.x + port.width) / ROUTING_SCALING_FACTOR);
				const startY = Math.floor(port.y / ROUTING_SCALING_FACTOR);
				const endY = Math.ceil((port.y + port.height) / ROUTING_SCALING_FACTOR);

				for (let x = startX - 1; x <= endX + 1; x++) {
					for (let y = startY - 1; y < endY + 1; y++) {
						this.markMatrixPoint(matrix, this.translateRoutingX(x), this.translateRoutingY(y));
					}
				}
			});
	};

	markMatrixPoint = (matrix: number[][], x: number, y: number) => {
		if (matrix[y] !== undefined && matrix[y][x] !== undefined) {
			matrix[y][x] = 1;
		}
	};

	/**
	 * auto arrange the graph
	 */
	// autoArrange() {}

	/**
	 * fit the canvas zoom levels to the elements contained.
	 * @param additionalZoomFactor allow for further zooming out to make sure edges doesn't cut
	 */
	zoomToFit(additionalZoomFactor: number = 0.005) {
		this.canvas$.pipe(filter(Boolean), take(1), delay(0)).subscribe((canvas: HTMLElement) => {
			const xFactor = canvas.clientWidth / canvas.scrollWidth;
			const yFactor = canvas.clientHeight / canvas.scrollHeight;
			const zoomFactor = xFactor < yFactor ? xFactor : yFactor;

			this.diagramModel.setZoomLevel(this.diagramModel.getZoomLevel() * (zoomFactor - additionalZoomFactor));
			this.diagramModel.setOffset(0, 0);
		});
	}
}
