import { IAction, ActionType, IActionPayload } from '../state-manager.service';
import { Guid } from 'guid-typescript';

export class AddBpmnDiagramActionPayload implements IActionPayload {
    constructor(public actionId: Guid, public processId: Guid, public diagram: string) { }
}

export class RemoveBpmnDiagramActionPayload implements IActionPayload {
    constructor(public actionId: Guid, public processId: Guid, public diagramId: string) { }
}

export class UpdateBpmnDiagramActionPayload implements IActionPayload {
    constructor(public actionId: Guid, public processId: Guid, public diagramId: string, public diagram: string) { }
}


export class AddBpmnDiagramAction implements IAction {
    type: string = ActionType.AddBpmnDiagram;
    payload: AddBpmnDiagramActionPayload;
    constructor(processId: Guid, diagram: string) {
        this.payload = new AddBpmnDiagramActionPayload(Guid.create(), processId, diagram);
    }
}


export class RemoveBpmnDiagramAction implements IAction {
    type: string = ActionType.RemoveBpmnDiagram;
    payload: RemoveBpmnDiagramActionPayload;
    constructor(processId: Guid, diagramId: string) {
        this.payload = new RemoveBpmnDiagramActionPayload(Guid.create(), processId, diagramId);
    }


}

export class UpdateBpmnDiagramAction implements IAction {
    type: string = ActionType.UpdateBpmnDiagram;
    payload: UpdateBpmnDiagramActionPayload;
    constructor(processId: Guid, diagramId: string, diagram: string) {
        this.payload = new UpdateBpmnDiagramActionPayload(Guid.create(), processId, diagramId, diagram);
    }


} 