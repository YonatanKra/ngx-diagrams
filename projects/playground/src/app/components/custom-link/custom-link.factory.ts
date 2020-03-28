import { ViewContainerRef, ComponentRef, ComponentFactoryResolver, ComponentFactory, Renderer2 } from '@angular/core';
import { CustomLinkComponent } from './custom-link.component';
import { AbstractLinkFactory, DefaultLinkModel, DiagramEngine } from 'projects/ngx-diagrams/public-api';

export class CustomLinkFactory extends AbstractLinkFactory<DefaultLinkModel> {
	constructor(private resolver: ComponentFactoryResolver, private renderer: Renderer2) {
		super('custom');
	}

	generateWidget(diagramEngine: DiagramEngine, link: DefaultLinkModel, linksHost: ViewContainerRef): ComponentRef<CustomLinkComponent> {
		const componentRef = linksHost.createComponent(this.getRecipe());

		// attach coordinates and default positional behaviour to the generated component host
		const rootNode = componentRef.location.nativeElement;

		// default style for link
		this.renderer.setStyle(rootNode, 'position', 'absolute');

		// data attributes
		this.renderer.setAttribute(rootNode, 'data-linkid', link.id);

		// on destroy make sure to destroy the componentRef
		link.onEntityDestroy().subscribe(() => {
			componentRef.destroy();
		});

		// assign all passed properties to node initialization.
		Object.entries(link).forEach(([key, value]) => {
			componentRef.instance[key] = value;
		});
		componentRef.instance.diagramEngine = diagramEngine;
		return componentRef;
	}

	getRecipe(): ComponentFactory<CustomLinkComponent> {
		return this.resolver.resolveComponentFactory(CustomLinkComponent);
	}

	getNewInstance() {
		return new DefaultLinkModel('intent-link');
	}
}
