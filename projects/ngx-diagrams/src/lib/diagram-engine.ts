import { Point, Rectangle } from '@projectstorm/geometry';
import { MouseEvent } from 'react';
import { AbstractModelFactory, AbstractReactFactory, BaseModel, CanvasEngine, FactoryBank, Toolkit } from '@projectstorm/react-canvas-core';
import { CanvasEngineListener, CanvasEngineOptions } from '@projectstorm/react-canvas-core';
import { AbstractAngularFactory } from './core/abstract-angular-factory';
import { DiagramModel, NodeModel, LinkModel, PortModel, LabelModel } from '@projectstorm/react-diagrams-core';

/**
 * Passed as a parameter to the DiagramWidget
 */
export class DiagramEngine extends CanvasEngine<CanvasEngineListener, DiagramModel> {
	protected nodeFactories: FactoryBank<AbstractAngularFactory<NodeModel, DiagramEngine>>;
	protected linkFactories: FactoryBank<AbstractAngularFactory<LinkModel, DiagramEngine>>;
	protected portFactories: FactoryBank<AbstractModelFactory<PortModel, DiagramEngine>>;
	protected labelFactories: FactoryBank<AbstractAngularFactory<LabelModel, DiagramEngine>>;

	maxNumberPointsPerLink: number;

	constructor(options: CanvasEngineOptions = {}) {
		super(options);
		this.maxNumberPointsPerLink = 1000;

		// create banks for the different factory types
		this.nodeFactories = new FactoryBank();
		this.linkFactories = new FactoryBank();
		this.portFactories = new FactoryBank();
		this.labelFactories = new FactoryBank();

		const setup = (factory: FactoryBank) => {
			factory.registerListener({
				factoryAdded: event => {
					event.factory.setDiagramEngine(this);
				},
				factoryRemoved: event => {
					event.factory.setDiagramEngine(null);
				}
			});
		};

		setup(this.nodeFactories);
		setup(this.linkFactories);
		setup(this.portFactories);
		setup(this.labelFactories);
	}

	/**
	 * Gets a model and element under the mouse cursor
	 */
	getMouseElement(event: MouseEvent): BaseModel {
		const target = event.target as Element;
		const diagramModel = this.model;

		// is it a port
		let element = Toolkit.closest(target, '.port[data-name]');
		if (element) {
			const nodeElement = Toolkit.closest(target, '.node[data-nodeid]') as HTMLElement;
			return diagramModel.getNode(nodeElement.getAttribute('data-nodeid')).getPort(element.getAttribute('data-name'));
		}

		// look for a point
		element = Toolkit.closest(target, '.point[data-id]');
		if (element) {
			return diagramModel.getLink(element.getAttribute('data-linkid')).getPointModel(element.getAttribute('data-id'));
		}

		// look for a link
		element = Toolkit.closest(target, '[data-linkid]');
		if (element) {
			return diagramModel.getLink(element.getAttribute('data-linkid'));
		}

		// look for a node
		element = Toolkit.closest(target, '.node[data-nodeid]');
		if (element) {
			return diagramModel.getNode(element.getAttribute('data-nodeid'));
		}

		return null;
	}

	// !-------------- FACTORIES ------------

	getNodeFactories() {
		return this.nodeFactories;
	}

	getLinkFactories() {
		return this.linkFactories;
	}

	getLabelFactories() {
		return this.labelFactories;
	}

	getPortFactories() {
		return this.portFactories;
	}

	getFactoryForNode<F extends AbstractReactFactory<NodeModel, DiagramEngine>>(node: NodeModel | string) {
		if (typeof node === 'string') {
			return this.nodeFactories.getFactory(node);
		}
		return this.nodeFactories.getFactory(node.getType());
	}

	getFactoryForLink<F extends AbstractReactFactory<LinkModel, DiagramEngine>>(link: LinkModel | string) {
		if (typeof link === 'string') {
			return this.linkFactories.getFactory(link);
		}
		return this.linkFactories.getFactory(link.getType());
	}

	getFactoryForLabel<F extends AbstractReactFactory<LabelModel, DiagramEngine>>(label: LabelModel) {
		if (typeof label === 'string') {
			return this.labelFactories.getFactory(label);
		}
		return this.labelFactories.getFactory(label.getType());
	}

	getFactoryForPort<F extends AbstractModelFactory<PortModel, DiagramEngine>>(port: PortModel) {
		if (typeof port === 'string') {
			return this.portFactories.getFactory<F>(port);
		}
		return this.portFactories.getFactory<F>(port.getType());
	}

	generateWidgetForLink(link: LinkModel): JSX.Element {
		return this.getFactoryForLink(link).generateAngularComponent({ model: link });
	}

	generateWidgetForNode(node: NodeModel): JSX.Element {
		return this.getFactoryForNode(node).generateAngularComponent({ model: node });
	}

	getNodeElement(node: NodeModel): Element {
		const selector = this.canvas.querySelector(`.node[data-nodeid="${node.getID()}"]`);
		if (selector === null) {
			throw new Error('Cannot find Node element with nodeID: [' + node.getID() + ']');
		}
		return selector;
	}

	getNodePortElement(port: PortModel): any {
		const selector = this.canvas.querySelector(`.port[data-name="${port.getName()}"][data-nodeid="${port.getParent().getID()}"]`);
		if (selector === null) {
			throw new Error('Cannot find Node Port element with nodeID: [' + port.getParent().getID() + '] and name: [' + port.getName() + ']');
		}
		return selector;
	}

	getPortCenter(port: PortModel): Point {
		return this.getPortCoords(port).getOrigin();
	}

	/**
	 * Calculate rectangular coordinates of the port passed in.
	 */
	getPortCoords(port: PortModel, element?: HTMLDivElement): Rectangle {
		if (!this.canvas) {
			throw new Error('Canvas needs to be set first');
		}
		if (!element) {
			element = this.getNodePortElement(port);
		}
		const sourceRect = element.getBoundingClientRect();
		const point = this.getRelativeMousePoint({
			clientX: sourceRect.left,
			clientY: sourceRect.top
		});
		const zoom = this.model.getZoomLevel() / 100.0;
		return new Rectangle(point.x, point.y, sourceRect.width / zoom, sourceRect.height / zoom);
	}

	/**
	 * Determine the width and height of the node passed in.
	 * It currently assumes nodes have a rectangular shape, can be overriden for customised shapes.
	 */
	getNodeDimensions(node: NodeModel): { width: number; height: number } {
		if (!this.canvas) {
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

	getMaxNumberPointsPerLink(): number {
		return this.maxNumberPointsPerLink;
	}

	setMaxNumberPointsPerLink(max: number) {
		this.maxNumberPointsPerLink = max;
	}
}
