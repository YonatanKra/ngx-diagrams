import { BehaviorSubject, Observable } from 'rxjs';
import { PortModel } from './port.model';
import { BaseModel } from './base.model';
import { DiagramModel } from './diagram.model';
import { Coords } from '../interfaces/coords.interface';
import { DiagramEngine } from '../services/engine.service';
import { distinctUntilChanged, map, takeUntil } from 'rxjs/operators';
import { Dimensions } from '../interfaces/dimensions.interface';
import { ID, mapToArray } from '../utils/tool-kit.util';

export class NodeModel<P extends PortModel = PortModel> extends BaseModel<DiagramModel> {
	id: ID;

	// TODO: figure out why is this here? :/
	diagramEngine: DiagramEngine;

	private readonly _extras: BehaviorSubject<{ [s: string]: any }>;
	private readonly _ports: BehaviorSubject<{ [s: string]: P }>;
	private readonly _coords: BehaviorSubject<Coords>;
	private readonly _dimensions: BehaviorSubject<Dimensions>;
	private readonly extras$: Observable<{ [s: string]: any }>;
	private readonly ports$: Observable<{ [s: string]: P }>;
	private readonly coords$: Observable<Coords>;
	private readonly dimensions$: Observable<Dimensions>;

	constructor(
		nodeType: string = 'default',
		id?: string,
		extras: { [s: string]: any } = {},
		x: number = 0,
		y: number = 0,
		width: number = 0,
		height: number = 0,
		logPrefix = '[Node]'
	) {
		super(nodeType, id, logPrefix);
		this._extras = new BehaviorSubject(extras);
		this._ports = new BehaviorSubject({});
		this._dimensions = new BehaviorSubject<Dimensions>({ width, height });
		this._coords = new BehaviorSubject<Coords>({ x, y });
		this.extras$ = this._extras.asObservable();
		this.ports$ = this._ports.asObservable();
		this.coords$ = this._coords.asObservable();
		this.dimensions$ = this._dimensions.asObservable();
	}

	getCoords(): Coords {
		return this._coords.getValue();
	}

	setCoords({ x, y }: Coords) {
		const { x: oldX, y: oldY } = this.getCoords();

		Object.values(this._ports.getValue()).forEach(port => {
			Object.values(port.getLinks()).forEach(link => {
				const point = link.getPointForPort(port);
				const { x: pointX, y: pointY } = point.getCoords();
				point.setCoords({ x: pointX + x - oldX, y: pointY + y - oldY });
			});
		});

		this._coords.next({ x, y });
	}

	// TODO: implement better transition on auto arrange!
	transitionToCoords({ x, y }: Coords) {
		// const transitionCompleted = new ReplaySubject(1);
		// let { x: oldX, y: oldY } = this.getCoords();
		// console.log(x, y, oldX, oldY);
		// interval(0)
		// 	.pipe(takeUntil(transitionCompleted))
		// 	.subscribe(
		// 		() => {
		// 			if (oldX < x) {
		// 				oldX++;
		// 			} else if (oldX > x) {
		// 				oldX--;
		// 			}
		// 			if (y > oldY) {
		// 				oldY++;
		// 			} else if (y < oldY) {
		// 				oldY--;
		// 			}
		// 			Object.values(this._ports.getValue()).forEach(port => {
		// 				Object.values(port.getLinks()).forEach(link => {
		// 					const point = link.getPointForPort(port);
		// 					const { x: pointX, y: pointY } = point.getCoords();
		// 					point.setCoords({ x: pointX + x - oldX, y: pointY + y - oldY });
		// 				});
		// 			});
		// 			this._coords.next({ x: oldX, y: oldY });
		// 			if (x === oldX && y === oldY) {
		// 				transitionCompleted.next(true);
		// 				transitionCompleted.complete();
		// 			}
		// 		},
		// 		err => {
		// 			console.error(err);
		// 		},
		// 		() => {
		// 			console.log('finished transition');
		// 		}
		// 	);
	}

	// TODO: override selectionChanges and replace this with it (convert to rx)
	getSelectedEntities() {
		let entities = super.getSelectedEntities();

		// add the points of each link that are selected here
		if (this.getSelected()) {
			Object.values(this._ports.getValue()).forEach(port => {
				const links = Object.values(port.getLinks());
				entities = entities.concat(
					links.map(link => {
						return link.getPointForPort(port);
					})
				);
			});
		}

		this.log('selectedEntities', entities);
		return entities;
	}

	// TODO: map to BaseEvent
	coordsChanges(): Observable<Coords> {
		return this.coords$.pipe(takeUntil(this.onEntityDestroy()));
	}

	selectCoords(): Observable<Coords> {
		return this.coords$.pipe(takeUntil(this.onEntityDestroy()), distinctUntilChanged());
	}

	selectX(): Observable<number> {
		return this.selectCoords().pipe(
			map(c => c.x),
			this.withLog('selectX'),
			distinctUntilChanged()
		);
	}

	selectY(): Observable<number> {
		return this.selectCoords().pipe(
			map(c => c.y),
			this.withLog('selectY'),
			distinctUntilChanged()
		);
	}

	/**
	 * Assign a port to the node and set the node as its getParent
	 * @returns the inserted port
	 */
	addPort(port: P): P {
		port.setParent(this);
		this._ports.next({ ...this._ports.getValue(), [port.id]: port });
		return port;
	}

	removePort(port: P): string {
		const updatedPorts = this._ports.getValue();

		delete updatedPorts[port.id];
		this._ports.next({ ...updatedPorts });

		port.destroy();

		return port.id;
	}

	getPort(id: ID): P {
		return this._ports.value[id];
	}

	selectPorts(selector?: () => boolean | ID | ID[]): Observable<P[]> {
		// TODO: implement selector
		// TODO: create coerce func
		return this.ports$.pipe(
			takeUntil(this.onEntityDestroy()),
			distinctUntilChanged(),
			map(ports => mapToArray(ports)),
			this.withLog('selectPorts')
		);
	}

	getPorts(ids?: ID[]): { [s: string]: P | P[] } {
		return this._ports.getValue();
	}

	setDimensions({ width, height }: Dimensions) {
		this._dimensions.next({ width, height });
	}

	getDimensions(): Dimensions {
		return this._dimensions.getValue();
	}

	// TODO: return BaseEvent extension
	dimensionChanges(): Observable<Dimensions> {
		return this.dimensions$.pipe(takeUntil(this.onEntityDestroy()), distinctUntilChanged(), this.withLog('DimensionChanges'));
	}

	getHeight(): number {
		return this._dimensions.getValue().height;
	}

	getWidth(): number {
		return this._dimensions.getValue().width;
	}

	selectWidth(): Observable<number> {
		return this.dimensions$.pipe(
			takeUntil(this.onEntityDestroy()),
			map(d => d.width),
			distinctUntilChanged(),
			this.withLog('selectWidth')
		);
	}

	selectHeight(): Observable<number> {
		return this.dimensions$.pipe(
			takeUntil(this.onEntityDestroy()),
			map(d => d.width),
			distinctUntilChanged(),
			this.withLog('selectHeight')
		);
	}

	setExtras(extras: any) {
		this._extras.next(extras);
	}

	getExtras() {
		return this._extras.getValue();
	}

	selectExtras<E = any>(selector?: (extra: E) => E[keyof E] | string | string[]) {
		// TODO: impl selector
		return this.extras$.pipe(takeUntil(this.onEntityDestroy()), distinctUntilChanged());
	}

	deserialize() {
		return {
			extras: this.getExtras(),
			ports: Object.values(this.getPorts()).map((port: P) => port.deserialize()),
			coords: this.getCoords(),
			dimensions: this.getDimensions(),
			...super.deserialize()
		};
	}
}
