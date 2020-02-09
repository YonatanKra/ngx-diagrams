import { CanvasEngine, AbstractModelFactory, BaseModel, GenerateWidgetEvent } from '@projectstorm/react-canvas-core';

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
