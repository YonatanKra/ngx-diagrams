import { CanvasEngine, AbstractModelFactory, BaseModel } from '@projectstorm/react-canvas-core';

export interface GenerateWidgetEvent<T extends BaseModel> {
	model: T;
}

/**
 * Further extends the AbstractFactory to add widget generation capability.
 */
export abstract class AbstractAngularFactory<
	T extends BaseModel = BaseModel,
	E extends CanvasEngine = CanvasEngine
> extends AbstractModelFactory<T, E> {
	/**
	 * Generates Angular components from the model contained in the event object
	 */
	abstract generateAngularComponent(event: GenerateWidgetEvent<T>): any;
}
