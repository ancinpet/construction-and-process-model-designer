import * as Model from '../../../model'
import { Guid } from 'guid-typescript';
import { IAction, ActionType, IActionPayload } from '../state-manager.service';
import { ModelerConstants } from 'src/app/components/modelers/ocd-psd-modeler/modelerClasses/defines-constants';

export abstract class OcdAction implements IAction {

	protected getTransactionSortFromString(_transactionSort: string): Model.TransactionSort {
		if (_transactionSort == null || _transactionSort == undefined) {
			return null;
		}

		switch (_transactionSort) {
			case ModelerConstants.ROLETYPE_ORIGINAL:
				return Model.TransactionSort.original;
			case ModelerConstants.ROLETYPE_PHYSICAL:
				return Model.TransactionSort.physical;
			case ModelerConstants.ROLETYPE_INFORMATIONAL:
				return Model.TransactionSort.informational;
			case ModelerConstants.ROLETYPE_DOCUMENTAL:
				return Model.TransactionSort.documental;
			default:
				return Model.TransactionSort.original;
		}
	}

	protected getCActFromString(_cact: string): Model.CAct {
		if (_cact == null || _cact == undefined) {
			return null;
		}

		let result: Model.CAct;
		switch (_cact) {

			case ModelerConstants.LINK_ACT_ACCEPT:
			case ModelerConstants.LINK_ACT_ACCEPT_S:
				result = Model.CAct.accept;
				break;

			case ModelerConstants.LINK_ACT_DECLINE:
			case ModelerConstants.LINK_ACT_DECLINE_S:
				result = Model.CAct.decline;
				break;

			case ModelerConstants.LINK_ACT_PROMISE:
			case ModelerConstants.LINK_ACT_PROMISE_S:
				result = Model.CAct.promise;
				break;

			case ModelerConstants.LINK_ACT_QUIT:
			case ModelerConstants.LINK_ACT_QUIT_S:
				result = Model.CAct.quit;
				break;

			case ModelerConstants.LINK_ACT_REJECT:
			case ModelerConstants.LINK_ACT_REJECT_S:
				result = Model.CAct.reject;
				break;

			case ModelerConstants.LINK_ACT_REQUEST:
			case ModelerConstants.LINK_ACT_REQUEST_S:
				result = Model.CAct.request;
				break;

			case ModelerConstants.LINK_ACT_STATE:
			case ModelerConstants.LINK_ACT_STATE_S:
				result = Model.CAct.state;
				break;

			case ModelerConstants.LINK_ACT_STOP:
			case ModelerConstants.LINK_ACT_STOP_S:
				result = Model.CAct.stop;
				break;

			default:
				result = Model.CAct.request;
				break;
		}
		return result;
	}

	protected getActorRoleTypeFromString(_actorRoleType: string): Model.ActorRoleType {
		if (_actorRoleType == null || _actorRoleType == undefined) {
			return null;
		}
		let result: Model.ActorRoleType;
		switch (_actorRoleType) {
			case ModelerConstants.SOI_INTERNAL:
				result = Model.ActorRoleType.elementary;
				break;

			case ModelerConstants.SOI_EXTERNAL:
				result = Model.ActorRoleType.composite
				break;

			default:
				result = Model.ActorRoleType.elementary;
				break;
		}
		return result;
	}

	public get actionId(): Guid {
		return this.payload.actionId;
	}

	abstract get payload(): IActionPayload;
	abstract type: string;
}

export class AddProcessActionPayload implements IActionPayload {
	constructor(public process: Model.Process, public actionId: Guid) { }
}

// Add process to model. Transactor is always null because new process is created without Transactor
export class AddProcessAction extends OcdAction {
	private _value: AddProcessActionPayload;
	public type: string = ActionType.AddProcess;

	constructor(_id: Guid, _name: string) {
		super();
		this._value = new AddProcessActionPayload(new Model.Process(_id, _name, null), Guid.create())
	}

	get payload(): AddProcessActionPayload {
		return this._value;
	}
}

export class RemoveProcessActionPayload implements IActionPayload {
	constructor(public processId: Guid, public actionId: Guid) { }
}

// Remove process from model. Only process Guid is needed
export class RemoveProcessAction extends OcdAction {
	private _value: RemoveProcessActionPayload;
	public type: string = ActionType.RemoveProcess;

	constructor(_id: Guid) {
		super();
		this._value = new RemoveProcessActionPayload(_id, Guid.create());
	}

	get payload(): RemoveProcessActionPayload {
		return this._value;
	}

}

export class ChangeProcessContentActionPayload implements IActionPayload {
	constructor(public id: Guid, public name: string, public actionId: Guid) { }
}


// Change process in model. Guid is always provided, label xor transactor is provided, other is null.
// Only change parameters that are not null. If Transactor is provided, he will only contain Guid.
export class ChangeProcessContentAction extends OcdAction {
	private _value: ChangeProcessContentActionPayload;
	public type: string = ActionType.ChangeProcess;

	constructor(_id: Guid, _name?: string) {
		super();
		this._value = new ChangeProcessContentActionPayload(_id, _name, Guid.create());
	}

	get payload(): ChangeProcessContentActionPayload {
		return this._value;
	}

}


// utility wrapper class
// it contains all required information to add composite transactor
// used as argument in redux actions
export class AddCompositeTransactorActionPayload implements IActionPayload {

	public actor: Model.ActorRole = undefined;


	public transactor: Model.CompositeTransactor = undefined;

	public parent: Guid = undefined;

	constructor(
		actor: Model.ActorRole,
		transactor: Model.CompositeTransactor,
		parent: Guid,
		public actionId: Guid
	) {
		this.actor = actor;
		this.transactor = transactor;
		this.parent = parent;
	}
}


// Add composite transactor to model. Children is always null because new transactor is created without children.
export class AddCompositeTransactorAction extends OcdAction {
	private _value: AddCompositeTransactorActionPayload;
	public type: string = ActionType.AddCompositeTransactor;

	constructor(_tid: Guid, _aid: Guid, _phase: string, _actorId: number, _name: string, parent: Guid) {
		super();
		let actorRoleType = this.getActorRoleTypeFromString(_phase);
		let actor = new Model.ActorRole(_aid, _actorId, _name, actorRoleType);
		let actorRoleReference = _aid;

		let transactor = new Model.CompositeTransactor(_tid, actorRoleReference, null);

		this._value = new AddCompositeTransactorActionPayload(actor, transactor, parent, Guid.create());
	}

	get payload(): AddCompositeTransactorActionPayload {
		return this._value;
	}
}


// utility wrapper class
// it contains all required information to add self activating transactor
// used as argument in redux actions
export class AddSelfActivatingTransactorActionPayload implements IActionPayload {

	public actor: Model.ActorRole = undefined;

	public transaction: Model.TransactionKind = undefined;

	public transactor: Model.SelfActivatingTransactor = undefined;

	public parent: Guid = undefined;

	constructor(
		actor: Model.ActorRole,
		transaction: Model.TransactionKind,
		transactor: Model.SelfActivatingTransactor,
		parent: Guid,
		public actionId: Guid
	) {

		this.actor = actor;
		this.transaction = transaction;
		this.transactor = transactor;
		this.parent = parent;
	}
}

// Add self activating transactor to model. Children is always null because new transactor is created without children.
export class AddSelfActivatingTransactorAction extends OcdAction {
	private _value: AddSelfActivatingTransactorActionPayload;
	public type: string = ActionType.AddSelfActivatingTransactor;

	constructor(_tid: Guid, _aid: Guid, _tnid: Guid, _transactionId: number, _transactionSort: string, _transactionName: string, _phase: string, _actorId: number, _name: string, parent: Guid) {
		super();

		let actorRoleType = this.getActorRoleTypeFromString(_phase);
		let actor = new Model.ActorRole(_aid, _actorId, _name, actorRoleType);
		let actorReference = _aid;

		let transactionSort = this.getTransactionSortFromString(_transactionSort);
		let transaction = new Model.TransactionKind(_tnid, _transactionId, _transactionName, transactionSort, actorReference);
		let transactionReference = _tnid;

		let transactor = new Model.SelfActivatingTransactor(_tid, actorReference, transactionReference);

		this._value = new AddSelfActivatingTransactorActionPayload(actor, transaction, transactor, parent, Guid.create());
	}

	get payload(): AddSelfActivatingTransactorActionPayload {
		return this._value;
	}

}

// utility wrapper class
// it contains all required information to add elementary transactor
// used as argument in redux actions
export class AddElementaryTransactorActionPayload implements IActionPayload {

	public actor: Model.ActorRole = undefined;

	public transaction: Model.TransactionKind = undefined;

	public transactor: Model.ElementaryTransactor = undefined;

	public parent: Guid = undefined;

	constructor(
		actor: Model.ActorRole,
		transaction: Model.TransactionKind,
		transactor: Model.ElementaryTransactor,
		parent: Guid,
		public actionId: Guid
	) {
		this.actor = actor;
		this.transaction = transaction;
		this.transactor = transactor;
		this.parent = parent;
	}
}

// Add elementary transactor to model. Children is always null because new transactor is created without children.
export class AddElementaryTransactorAction extends OcdAction {
	private _value: AddElementaryTransactorActionPayload;
	public type: string = ActionType.AddElementaryTransactor;

	constructor(_tid: Guid, _aid: Guid, _tnid: Guid, _transactionId: number, _transactionSort: string, _transactionName: string, _phase: string, _actorId: number, _name: string, parent: Guid) {
		super();

		let actorRoleType = this.getActorRoleTypeFromString(_phase);
		let actor = new Model.ActorRole(_aid, _actorId, _name, actorRoleType);
		let actorReference = _aid;

		let transactionSort = this.getTransactionSortFromString(_transactionSort);
		let transaction = new Model.TransactionKind(_tnid, _transactionId, _transactionName, transactionSort, actorReference);
		let transactionReference = _tnid;

		let transactor = new Model.ElementaryTransactor(_tid, actorReference, transactionReference, new Model.TransactorCardinality("1", "1"), Model.CAct.promise);

		this._value = new AddElementaryTransactorActionPayload(actor, transaction, transactor, parent, Guid.create());
	}

	get payload(): AddElementaryTransactorActionPayload {
		return this._value;
	}
}


export class AddWaitLinkActionPayload implements IActionPayload {
	public sourceCAct: Model.CAct = Model.CAct.request;
	public targetCAct: Model.CAct = Model.CAct.request;
	constructor(
		public linkGuid: Guid,
		public linkSourceGuid: Guid,
		public linkTargetGuid: Guid,
		public sourcePositionDown: boolean,
		public targetPositionDown: boolean,
		public graphicalPoints: Array<[number, number]>,
		public actionId: Guid
	) { }
}

// Add waitlink to model.
export class AddWaitLinkAction extends OcdAction implements IActionPayload {
	private _value: AddWaitLinkActionPayload;
	public type: string = ActionType.AddWaitLink;

	//If any optional parameter is null, it did not change
	constructor(
		linkGuid: Guid,
		linkSourceGuid: Guid,
		linkTargetGuid: Guid,
		sourcePositionDown: boolean,
		targetPositionDown: boolean,
		graphicalPoints: Array<[number, number]>
	) {
		super();
		this._value = new AddWaitLinkActionPayload(linkGuid, linkSourceGuid, linkTargetGuid, sourcePositionDown, targetPositionDown, graphicalPoints, Guid.create());
	}

	get payload(): AddWaitLinkActionPayload {
		return this._value;
	}
}


export class RemoveConstraintLinkActionPayload implements IActionPayload {
	constructor(public linkId, public actionId: Guid) { }
}

// Add waitlink to model.
export class RemoveConstraintLinkAction extends OcdAction {
	private _value: RemoveConstraintLinkActionPayload;
	public type: string = ActionType.RemoveConstraintLink;

	//If any optional parameter is null, it did not change
	constructor(
		linkId: Guid
	) {
		super();
		this._value = new RemoveConstraintLinkActionPayload(linkId, Guid.create());
	}

	get payload(): RemoveConstraintLinkActionPayload {
		return this._value;
	}
}

export class RemoveTransactorActionPayload implements IActionPayload {
	constructor(public transactorId: Guid, public actionId: Guid) { }
}

// Remove Transactor from model. Only Transactor Guid is needed
export class RemoveTransactorAction extends OcdAction {
	private _value: RemoveTransactorActionPayload;
	public type: string = ActionType.RemoveTransactor;

	constructor(_id: Guid) {
		super();
		this._value = new RemoveTransactorActionPayload(_id, Guid.create());
	}

	get payload(): RemoveTransactorActionPayload {
		return this._value;
	}

}

export class ChangeTransactorContentActionPayload implements IActionPayload {
	constructor(
		public actionId: Guid,
		public transactorGuid: Guid,
		public actorGuid?: Guid,
		public transactionGuid?: Guid,
		public cardinalityMin?: string,
		public cardinalityMax?: string,
		public sourceCAct?: Model.CAct,
	) { }
}


// Change Transactor contents from model.
export class ChangeTransactorContentAction extends OcdAction {
	private _value: ChangeTransactorContentActionPayload;
	public type: string = ActionType.ChangeTransactorContent;

	//If any optional parameter is null, it did not change
	constructor(
		transactorGuid: Guid,
		actorGuid?: Guid,
		transactionGuid?: Guid,
		cardinalityMin?: string,
		cardinalityMax?: string,
		sourceCActString?: string) {
		super();

		this._value = new ChangeTransactorContentActionPayload(Guid.create(), transactorGuid,
			actorGuid, transactionGuid, cardinalityMin, cardinalityMax, this.getCActFromString(sourceCActString));
	}

	get payload(): ChangeTransactorContentActionPayload {
		return this._value;
	}
}

export class ChangeActorContentActionPayload implements IActionPayload {

	constructor(
		public actionId: Guid,
		public actorGuid: Guid,
		public name?: string,
		public roleType?: Model.ActorRoleType
	) { }
}

// Change Actor contents from model.
export class ChangeActorContentAction extends OcdAction {
	private _value: ChangeActorContentActionPayload;
	public type: string = ActionType.ChangeActorContent;

	//If any optional parameter is null, it did not change
	constructor(
		actorGuid: Guid,
		name?: string,
		roleTypeString?: string) {
		super();
		this._value = new ChangeActorContentActionPayload(Guid.create(), actorGuid,
			name, this.getActorRoleTypeFromString(roleTypeString));
	}

	get payload(): ChangeActorContentActionPayload {
		return this._value;
	}
}

export class ChangeTransactionContentActionPayload implements IActionPayload {
	constructor(
		public actionId: Guid,
		public transactionGuid: Guid,
		public name?: string,
		public transactionSort?: Model.TransactionSort
	) { }
}

// Change Transaction contents from model.
export class ChangeTransactionContentAction extends OcdAction {
	private _value: ChangeTransactionContentActionPayload;
	public type: string = ActionType.ChangeTransactionContent;

	//If any optional parameter is null, it did not change
	constructor(
		transactionGuid: Guid,
		name?: string,
		transactionSortString?: string) {
		super();
		this._value = new ChangeTransactionContentActionPayload(Guid.create(), transactionGuid,
			name, this.getTransactionSortFromString(transactionSortString));
	}

	get payload(): ChangeTransactionContentActionPayload {
		return this._value;
	}
}

export class ChangeConstraintLinkActionPayload implements IActionPayload {
	constructor(
		public actionId: Guid,
		public linkGuid: Guid,
		public linkType?: string,
		public sourceCAct?: Model.CAct,
		public targetCAct?: Model.CAct,
		public sourcePositionDown?: boolean,
		public targetPositionDown?: boolean,
		public graphicalPoints?: Array<[number, number]>
	) { }
}

// Change constraint contents from model.
export class ChangeConstraintLinkAction extends OcdAction {
	private _value: ChangeConstraintLinkActionPayload;
	public type: string = ActionType.ChangeConstraintLink;

	//If any optional parameter is null, it did not change
	constructor(
		linkGuid: Guid,
		linkTypeString?: string,
		sourceCActString?: string,
		targetCActString?: string,
		sourcePositionDown?: boolean,
		targetPositionDown?: boolean,
		graphicalPoints?: Array<[number, number]>
	) {
		super();
		this._value = new ChangeConstraintLinkActionPayload(
			Guid.create(),
			linkGuid,
			linkTypeString,
			this.getCActFromString(sourceCActString),
			this.getCActFromString(targetCActString),
			sourcePositionDown,
			targetPositionDown,
			graphicalPoints
		);
	}

	get payload(): ChangeConstraintLinkActionPayload {
		return this._value;
	}
}


export class SwapTransactorsActionPayload implements IActionPayload {
	constructor(
		public actionId: Guid,
		public sourceGuid: Guid,
		public targetGuid: Guid
	) { }
}

// Swap two vertices (any)
export class SwapTransactorsAction extends OcdAction {
	private _value: SwapTransactorsActionPayload;
	public type: string = ActionType.SwapVertices;

	//If any optional parameter is null, it did not change
	constructor(
		sourceGuid: Guid,
		targetGuid: Guid
	) {
		super();
		this._value = new SwapTransactorsActionPayload(Guid.create(), sourceGuid, targetGuid);
	}

	get payload(): SwapTransactorsActionPayload {
		return this._value;
	}
}


export class AppendTransactorActionPayload implements IActionPayload {
	constructor(
		public actionId: Guid,
		public sourceGuid: Guid,
		public targetGuid: Guid
	) { }
}


// Append source to target
export class AppendTransactorAction extends OcdAction {
	private _value: AppendTransactorActionPayload;
	public type: string = ActionType.AppendTransactor;

	//If any optional parameter is null, it did not change
	constructor(
		sourceGuid: Guid,
		targetGuid: Guid
	) {
		super();
		this._value = new AppendTransactorActionPayload(Guid.create(), sourceGuid, targetGuid);
	}

	get payload(): AppendTransactorActionPayload {
		return this._value;
	}
}

export class AppendTransactorAfterActionPayload implements IActionPayload {
	constructor(
		public actionId: Guid,
		public sourceGuid: Guid,
		public targetGuid: Guid,
		public transactorFirstGuid: Guid,
		public transactorSecondGuid: Guid
	) { }
}

// Append source to target at position after transactor that is first found in childs of target
export class AppendTransactorAfterAction extends OcdAction {
	private _value: AppendTransactorAfterActionPayload;
	public type: string = ActionType.AppendTransactorAfter;

	//If any optional parameter is null, it did not change
	constructor(
		sourceGuid: Guid,
		targetGuid: Guid,
		transactorFirstGuid: Guid,
		transactorSecondGuid: Guid
	) {
		super();
		this._value = new AppendTransactorAfterActionPayload(Guid.create(), sourceGuid, targetGuid, transactorFirstGuid, transactorSecondGuid);
	}

	get payload(): AppendTransactorAfterActionPayload {
		return this._value;
	}
}

export class RemoveTransactionKindActionPayload implements IActionPayload {
	constructor(public actionId: Guid, public transactionKindId: Guid) { }
}

export class RemoveTransactionKindAction extends OcdAction {
	private _value: RemoveTransactionKindActionPayload;
	public type: string = ActionType.RemoveTransactionKind;

	constructor(transactionKindId: Guid) {
		super();
		this._value = new RemoveTransactionKindActionPayload(Guid.create(), transactionKindId);
	}

	get payload(): RemoveTransactionKindActionPayload {
		return this._value;
	}
}

export class RemoveActorRoleActionPayload implements IActionPayload {
	constructor(public actionId: Guid, public actorRoleId: Guid) { }
}
export class RemoveActorRoleAction extends OcdAction {
	private _value: RemoveActorRoleActionPayload;
	public type: string = ActionType.RemoveActorRole;

	constructor(actorRoleId: Guid) {
		super();
		this._value = new RemoveActorRoleActionPayload(Guid.create(), actorRoleId);
	}

	get payload(): RemoveActorRoleActionPayload {
		return this._value;
	}
}