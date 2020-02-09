import { Component, OnInit, ComponentFactoryResolver, Renderer2 } from '@angular/core';
import { DiagramEngine, DefaultLinkModel, DiagramModel, DefaultNodeModel, DagreEngine, MoveItemsAction } from 'ngx-diagrams';
import { CustomLinkFactory } from './components/custom-link/custom-link.factory';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
	title = 'playground';
}
