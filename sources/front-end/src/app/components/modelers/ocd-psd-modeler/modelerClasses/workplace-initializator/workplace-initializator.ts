import { Modeler } from "../modeler-initializator"
import { StateManagerService } from 'src/app/services/state-management/state-manager.service';
import { OCDCommunicationService } from 'src/app/services/ocd-communication/ocd-communication.service';

export class Workplace {
    private _container: HTMLElement;
    private _modeler: Modeler;

    constructor(container: HTMLElement, stateManager: StateManagerService, interactionManager: OCDCommunicationService) {
        this._container = container;
        container.style.outline = "none";
        this._modeler = new Modeler(this.container, stateManager, interactionManager);
    }

    public start(): void {
        this.modeler.customizeModeler();
        this.modeler.setupPorts();
        this.modeler.addCellOverlay();
        this.modeler.manageEvents();
        this.modeler.createNewModel();
    }

    public stop(): void {
        this._modeler.destroy();
    }

    get container(): HTMLElement {
        return this._container;
    }

    get modeler(): Modeler {
        return this._modeler;
    }
}
