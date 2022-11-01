import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
// import { Workplace } from './modelerClasses/workplace-initializator';
import { Workplace } from './modelerClasses/workplace-initializator';	
import { StateManagerService } from 'src/app/services/state-management/state-manager.service';
// import { OCDCommunicationService } from 'src/app/services/ocd-communication/ocd-communication.service';
//import { CellFactory } from './modelerClasses/cell-generator';
//import { Modeler } from './modelerClasses/modeler-initializator';

@Component({
	selector: 'app-ofd-modeler',
	templateUrl: './ofd-modeler.component.html',
	styleUrls: ['./ofd-modeler.component.scss']
})

export class OfdModelerComponent implements OnInit {
	@ViewChild('ofdModelContainer') private _container: ElementRef;
	//private _modeler: Modeler;
	//private _cellFactory: CellFactory;
	private _workplace: Workplace;
	// private _workplace: Workplace;
	private _stateManager: StateManagerService;
	// private _interactionManger: OCDCommunicationService;

	// constructor(stateManager: StateManagerService, interactionManager: OCDCommunicationService) {
	// 	this._stateManager = stateManager;
	// 	this._interactionManger = interactionManager;
	// }

	public ngOnInit(): void {
		// this._workplace = new Workplace(this._container.nativeElement, this._stateManager, this._interactionManger);
		// this._workplace.start();
		this._workplace = new Workplace(this._container.nativeElement);
		this._workplace.start();
		document.getElementById("toolbar-zoom-in").style.display = "none";
		document.getElementById("toolbar-zoom-out").style.display = "none";
		document.getElementById("toolbar-action-delete").style.display = "inline";
		document.getElementById("toolbar-action-process").style.display = "inline";
		document.getElementById("toolbar-action-fact").style.display = "inline";
		document.getElementById("toolbar-action-external-fact").style.display = "inline";
		document.getElementById("toolbar-action-product").style.display = "inline";
		document.getElementById("toolbar-action-edge").style.display = "inline";
		document.getElementById("toolbar-action-reverse-edge").style.display = "inline";
		document.getElementById("toolbar-action-change-edge").style.display = "inline";
		document.getElementById("toolbar-action-process").style.display = "none";

		console.log("Initialized modeler: ");
	}

	public ngOnDestroy(): void {
		document.getElementById("toolbar-zoom-in").style.display = "none";
		document.getElementById("toolbar-zoom-out").style.display = "none";
		document.getElementById("toolbar-action-delete").style.display = "none";
		document.getElementById("toolbar-action-process").style.display = "none";
		document.getElementById("toolbar-action-fact").style.display = "none";
		document.getElementById("toolbar-action-external-fact").style.display = "none";
		document.getElementById("toolbar-action-product").style.display = "none";
		document.getElementById("toolbar-action-edge").style.display = "none";
		document.getElementById("toolbar-action-reverse-edge").style.display = "none";
		document.getElementById("toolbar-action-change-edge").style.display = "none";
		document.getElementById("toolbar-action-process").style.display = "none";
	}

	get container(): HTMLElement {
		return this._container.nativeElement;
	}

	// get workplace(): Workplace {
	// 	return this._workplace;
	// }

	//get modeler(): Modeler {
	//	return this._modeler;
	//}
}
