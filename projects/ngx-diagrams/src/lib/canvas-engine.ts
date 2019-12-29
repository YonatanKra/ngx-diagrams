import { CanvasEngine, LayerModel, FactoryBank } from '@projectstorm/react-canvas-core';
import { AbstractAngularFactory } from './core/abstract-angular-factory';

export class NgCanvasEngine extends CanvasEngine {
	protected layerFactories: FactoryBank<AbstractAngularFactory<LayerModel>>;

	getFactoryForLayer<F extends AbstractAngularFactory<LayerModel>>(layer: LayerModel | string) {
		if (typeof layer === 'string') {
			return this.layerFactories.getFactory(layer);
		}
		return this.layerFactories.getFactory(layer.getType());
	}
}
