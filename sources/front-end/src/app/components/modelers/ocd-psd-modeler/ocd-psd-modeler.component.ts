import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Workplace } from './modelerClasses/workplace-initializator';
import { StateManagerService } from 'src/app/services/state-management/state-manager.service';
import { OCDCommunicationService } from 'src/app/services/ocd-communication/ocd-communication.service';

@Component({
	selector: 'app-ocd-psd-modeler',
	templateUrl: './ocd-psd-modeler.component.html',
	styleUrls: ['./ocd-psd-modeler.component.scss']
})

export class OcdPsdModelerComponent implements OnInit {
	@ViewChild('ocdModelContainer') private _container: ElementRef;
	private _stateManager: StateManagerService;
	private _interactionManger: OCDCommunicationService;
	private _workplace: Workplace;

	constructor(stateManager: StateManagerService, interactionManager: OCDCommunicationService) {
		this._stateManager = stateManager;
		this._interactionManger = interactionManager;
	}

	public ngOnInit(): void {
		this._workplace = new Workplace(this._container.nativeElement, this._stateManager, this._interactionManger);
		this._workplace.start();
		document.getElementById("mxgraph-toolbar").style.display = "block";
		document.getElementById("toolbar-zoom-in").style.display = "inline";
		document.getElementById("toolbar-zoom-out").style.display = "inline";
		document.getElementById("toolbar-action-delete").style.display = "inline";
		document.getElementById("toolbar-action-process").style.display = "inline";
	}

	public ngOnDestroy(): void {
		this._workplace.stop();
		document.getElementById("mxgraph-toolbar").style.display = "none";
		document.getElementById("toolbar-zoom-in").style.display = "none";
		document.getElementById("toolbar-zoom-out").style.display = "none";
		document.getElementById("toolbar-action-delete").style.display = "none";
		document.getElementById("toolbar-action-process").style.display = "none";
	}

	get container(): HTMLElement {
		return this._container.nativeElement;
	}

	get workplace(): Workplace {
		return this._workplace;
	}
}
