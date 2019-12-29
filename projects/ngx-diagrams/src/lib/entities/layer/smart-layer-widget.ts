import { LayerModel, CanvasEngine } from '@projectstorm/react-canvas-core';
import { Component, Input } from '@angular/core';

@Component({})
export class SmartLayerComponent {
	@Input() layer: LayerModel;
	@Input() engine: CanvasEngine;

	shouldComponentUpdate(): boolean {
		return this.layer.isRepaintEnabled();
	}

	render() {
		return this.engine.getFactoryForLayer(this.layer).generateReactWidget({ model: this.layer });
	}
}
