import { AbstractModelFactory, FactoryBank, CanvasEngineListener, CanvasEngine } from '@projectstorm/react-canvas-core';
import { AbstractAngularFactory } from './core/abstract-angular-factory';
import { Type } from '@angular/core';
import { DiagramModel, NodeModel, LinkModel, PortModel, LabelModel } from 'dist/ngx-diagrams/lib/models';

export class NgDiagramEngine extends CanvasEngine<CanvasEngineListener, DiagramModel> {
	protected nodeFactories: FactoryBank<AbstractAngularFactory<NodeModel, NgDiagramEngine>>;
	protected linkFactories: FactoryBank<AbstractAngularFactory<LinkModel, NgDiagramEngine>>;
	protected portFactories: FactoryBank<AbstractAngularFactory<PortModel, NgDiagramEngine>>;
	protected labelFactories: FactoryBank<AbstractAngularFactory<LabelModel, NgDiagramEngine>>;

	constructor() {
		super();
	}

	getFactoryForLink<F extends AbstractAngularFactory<LinkModel, NgDiagramEngine>>(link: LinkModel | string) {
		if (typeof link === 'string') {
			return this.linkFactories.getFactory<F>(link);
		}
		return this.linkFactories.getFactory<F>(link.getType());
	}

	getFactoryForNode<F extends AbstractAngularFactory<NodeModel, NgDiagramEngine>>(node: NodeModel | string) {
		if (typeof node === 'string') {
			return this.nodeFactories.getFactory<F>(node);
		}
		return this.nodeFactories.getFactory<F>(node.getType());
	}

	getFactoryForLabel<F extends AbstractAngularFactory<LabelModel, NgDiagramEngine>>(label: LabelModel) {
		if (typeof label === 'string') {
			return this.labelFactories.getFactory<F>(label);
		}
		return this.labelFactories.getFactory<F>(label.getType());
	}

	getFactoryForPort<F extends AbstractModelFactory<PortModel, NgDiagramEngine>>(port: PortModel) {
		if (typeof port === 'string') {
			return this.portFactories.getFactory<F>(port);
		}
		return this.portFactories.getFactory<F>(port.getType());
	}

	generateComponentForLink(link: LinkModel): Type<any> {
		return this.getFactoryForLink(link).generateAngularComponent({ model: link });
	}

	generateComponentForNode(node: NodeModel): Type<any> {
		return this.getFactoryForNode(node).generateAngularComponent({ model: node });
	}
}
