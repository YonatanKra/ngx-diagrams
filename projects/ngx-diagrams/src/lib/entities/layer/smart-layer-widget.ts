import { LayerModel } from '@projectstorm/react-canvas-core';
import { Component, Input } from '@angular/core';
import { NgDiagramEngine } from '../../diagram-engine';

@Component({})
export class SmartLayerComponent {
	@Input() layer: LayerModel;
	@Input() engine: NgDiagramEngine;

	shouldComponentUpdate(): boolean {
		return this.layer.isRepaintEnabled();
	}

	render() {
		return this.engine.getFactoryForLayer(this.layer).generateAngularComponent({ model: this.layer });
	}
}
