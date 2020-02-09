import { DefaultLabelModel } from './default-label.model';
import { DiagramEngine } from '@projectstorm/react-diagrams-core';
import { AbstractAngularFactory } from '../../core/abstract-angular-factory';

export class DefaultLabelFactory extends AbstractAngularFactory<DefaultLabelModel, DiagramEngine> {
	constructor() {
		super('default');
	}

	generateAngularComponent(event) {
		// return <DefaultLabelWidget model={event.model} />;
	}

	generateModel(event): DefaultLabelModel {
		return new DefaultLabelModel();
	}
}
