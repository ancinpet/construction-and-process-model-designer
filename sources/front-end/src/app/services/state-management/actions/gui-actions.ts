import { IAction, ActionType, IActionPayload } from '../state-manager.service';
import { IPsiContract } from 'src/app/model';
import { Guid } from 'guid-typescript';

export class UndoChangeAction implements IAction {
	type: string;
	constructor() {
		this.type = ActionType.UndoChange;
	}
}

export class RedoChangeAction implements IAction {
	type: string;
	constructor() {
		this.type = ActionType.RedoChange;
	}
}

export class SaveModelAction implements IAction {
	type: string;
	constructor() {
		this.type = ActionType.SaveModel;
	}
}

export class LoadModelAction implements IAction {
	type: string;
	constructor() {
		this.type = ActionType.LoadModel;
	}
}

export class ChangeModelNameActionPayload implements IActionPayload {
	constructor(public actionId: Guid, public changedName: string) { }
}


export class ChangeModelNameAction implements IAction {
	type: string;
	payload: ChangeModelNameActionPayload;
	constructor(changedName: string) {
		this.type = ActionType.ChangeModelName;
		this.payload = new ChangeModelNameActionPayload(Guid.create(), changedName);
	}
}

export class ImportModelActionPayload implements IActionPayload {
	constructor(public actionId: Guid, public psiContract: IPsiContract) { }
}

export class ImportModelAction implements IAction {
	type: string = ActionType.ImportModel;
	payload: ImportModelActionPayload;
	constructor(psiContract: IPsiContract) {
		this.payload = new ImportModelActionPayload(Guid.create(), psiContract);
	}
}

export class NewModelAction implements IAction {
	type: string = ActionType.NewModel;
}