import { Guid } from 'guid-typescript';


// ------------ OCD (CSD)--------------------

// type of ActorRole
export enum ActorRoleType { elementary, composite }

// actor role data definition
export interface IActorRole {
	id: Guid;
	identificationNumber: number;
	name: string;
	type: ActorRoleType;
}

// actor role implementation
export class ActorRole implements IActorRole {
	public id: Guid = undefined;
	public identificationNumber: number = undefined;
	public name: string = undefined;
	public type: ActorRoleType = undefined;

	constructor(
		id: Guid,
		identificationNumber: number,
		name: string,
		type: ActorRoleType

	) {
		this.id = id;
		this.name = name;
		this.identificationNumber = identificationNumber;
		this.type = type;
	}
}

// type of transaction
export enum TransactionSort { original, physical, informational, documental }

// transaction kind data definition
export interface ITransactionKind {
	id: Guid;
	identificationNumber: number;
	name: string;
	transactionSort: TransactionSort;
	executor: Guid;
}

// transaction kind implementation
export class TransactionKind implements ITransactionKind {
	public id: Guid = undefined;
	public identificationNumber: number = undefined;
	public name: string = undefined;
	public transactionSort: TransactionSort = undefined;
	public executor: Guid = undefined;

	constructor(
		id: Guid,
		identificationNumber: number,
		name: string,
		transactionSort: TransactionSort,
		executor: Guid
	) {
		this.id = id;
		this.identificationNumber = identificationNumber;
		this.name = name;
		this.transactionSort = transactionSort;
		this.executor = executor;
	}
}

// links abstract superclass definition
export interface ILink {
	id: Guid;
}

// links abstract superclass implementation
export abstract class Link implements ILink {
	constructor(public id: Guid) { }
}


// wait link data definition
export interface IWaitLink extends ILink {
	waitingForTransactor: Guid;
	sourceCAct: CAct;
	targetCAct: CAct;
}

//wait link implementation
export class WaitLink extends Link implements IWaitLink {
	public waitingForTransactor: Guid = undefined;
	sourceCAct: CAct;
	targetCAct: CAct;
	constructor(id: Guid, sourceCAct: CAct, targetCAct: CAct, waitingForTransactor: Guid) {
		super(id);
		this.sourceCAct = sourceCAct;
		this.targetCAct = targetCAct;
		this.waitingForTransactor = waitingForTransactor;
	}
}

// inspection link data definition
export interface IInspectionLink extends ILink {
	inspectionTargetTransactor: Guid;
}

// inspection link implementation
export class InspectionLink extends Link implements IInspectionLink {
	public inspectionTargetTransactor: Guid = undefined;

	constructor(id: Guid, inspectionTargetTransactor: Guid) {
		super(id);
		this.inspectionTargetTransactor = inspectionTargetTransactor;
	}
}

// abstract transactor data definition
export interface ITransactor {
	id: Guid;
	actorRole: Guid;
	waitLinks: IWaitLink[];
	inspectionLinks: IInspectionLink[];
	children: IElementaryTransactor[];
}

// abstract transactor implementation
export abstract class Transactor implements ITransactor {

	public waitLinks: WaitLink[] = undefined;

	public inspectionLinks: InspectionLink[] = undefined;

	public id: Guid = undefined;

	public actorRole: Guid = undefined;

	public children: ElementaryTransactor[];

	constructor(
		id: Guid,
		actorRole: Guid
	) {

		this.id = id;
		this.actorRole = actorRole;
		this.waitLinks = [];
		this.inspectionLinks = [];

		this.children = [];
	}


}


export interface ITransactorCardinality {
	minCard: string;
	maxCard: string;

}


export class TransactorCardinality implements ITransactorCardinality {

	public minCard: string;
	public maxCard: string;

	constructor(minCard: string, maxCard: string) {
		this.minCard = minCard;
		this.maxCard = maxCard;
	}
}

// Comunication Acts of the transaction
export enum CAct { request, promise, decline, quit, execute, state, accept, reject, stop, revoke_request, revoke_promise, revoke_state, revoke_accept }


// elementary transactor data definition
export interface IElementaryTransactor extends ITransactor {

	transactionKind: Guid;
	cardinality: ITransactorCardinality;
	sourceCAct: CAct;
}

// composite transactor data definition - intentionally empty
export interface ICompositeTransactor extends ITransactor {

}

// self activating transactor data definition
export interface ISelfActivatingTransactor extends ITransactor {

	transactionKind: Guid;
}

// elementary transactor implementation
export class ElementaryTransactor extends Transactor implements IElementaryTransactor {

	public transactionKind: Guid = undefined;

	public cardinality: TransactorCardinality = undefined;

	public sourceCAct: CAct = undefined;

	constructor(
		id: Guid,
		actorRole: Guid,
		transactionKind: Guid,
		cardinality: TransactorCardinality,
		sourceCAct: CAct
	) {
		super(id, actorRole);
		this.transactionKind = transactionKind;
		this.cardinality = cardinality;
		this.sourceCAct = sourceCAct;
	}

}

// composite transactor implementation
export class CompositeTransactor extends Transactor implements ICompositeTransactor {

	constructor(
		id: Guid,
		actorRole: Guid,
		child: ElementaryTransactor
	) {
		super(id, actorRole);
		if (child) {
			this.children.push(child);
		}
	}

}

// self activating transactor implementation
export class SelfActivatingTransactor extends Transactor implements ISelfActivatingTransactor {

	public transactionKind: Guid = undefined;

	constructor(
		id: Guid,
		actorRole: Guid,
		transactionKind: Guid
	) {
		super(id, actorRole);
		this.transactionKind = transactionKind;
	}

}

// process data definition
export interface IProcess {
	id: Guid;
	name: string;
	bpmnDiagrams: string[];
	root: ISelfActivatingTransactor | ICompositeTransactor; // not in UML model, but based on definition in DEMO
}

// process implementation
export class Process implements IProcess {

	public id: Guid = undefined;

	public name: string = undefined;

	public root: SelfActivatingTransactor | CompositeTransactor = undefined;
	bpmnDiagrams: string[];
	constructor(
		id: Guid,
		name: string,
		root: SelfActivatingTransactor | CompositeTransactor
	) {
		this.id = id;
		this.name = name;
		this.root = root;
		this.bpmnDiagrams = [];
	}
}


// ------------ OFD --------------------

// type of connection (used in OFD)
export enum ConnectionType { generalisation, specialisation, aggregation, reference, concerns, excludes, precedes, preludes }

// possible options when declaring minCard and maxCard of cardinality (used in OFD)
export enum CardinalityOption { zero, one, more };

// cardinality of connections in OFD (e.g. "0..1")
// data definition
export interface IConnectionCardinality {
	minCard: CardinalityOption;
	maxCard: CardinalityOption;
}

// cardinality implementation
export class ConnectionCardinality implements IConnectionCardinality {
	minCard: CardinalityOption;
	maxCard: CardinalityOption;

	constructor(minCard: CardinalityOption, maxCard: CardinalityOption) {
		this.maxCard = maxCard;
		this.minCard = minCard;
	}
}

// connection data definition
export interface IConnection {
	id: Guid;
	name: string;
	from: Guid;
	to: Guid;
	fromCardinality: IConnectionCardinality;
	toCardinality: IConnectionCardinality;
	type: ConnectionType;
}

// connection implementation
export class Connection implements IConnection {
	public id: Guid;
	public name: string;
	public from: Guid;
	public to: Guid;
	public fromCardinality: ConnectionCardinality;
	public toCardinality: ConnectionCardinality;
	public type: ConnectionType;

	constructor(
		id: Guid,
		name: string,
		from: Guid,
		to: Guid,
		fromCardinality: ConnectionCardinality,
		toCardinality: ConnectionCardinality,
		type: ConnectionType
	) {
		this.id = id;
		this.name = name;
		this.from = from;
		this.to = to;
		this.fromCardinality = fromCardinality;
		this.toCardinality = toCardinality;
		this.type = type;
	}
}

// product kind data definition
export interface IProductKind {
	id: Guid;
	formulation: string;
	identificationNumber: string;
}

// product kind implementation
export class ProductKind implements IProductKind {
	public id: Guid;
	public formulation: string;
	public identificationNumber: string;

	constructor(id: Guid, formulation: string, identificationNumber: string) {
		this.id = id;
		this.formulation = formulation;
		this.identificationNumber = identificationNumber;
	}


}

// entity type data definition
export interface IEntityType {
	id: Guid;
	name: string;
	isExternal: boolean;
	productKind?: ProductKind;
}

// entity type implementation
export class EntityType implements IEntityType {
	id: Guid;
	name: string;
	isExternal: boolean;
	productKind?: ProductKind;

	constructor(id: Guid, name: string, isExternal: boolean, productKind?: ProductKind) {
		this.id = id;
		this.name = name;
		this.isExternal = isExternal;
		if (productKind) {
			this.productKind = productKind;
		}
	}
}

// data type of attribute value
export enum AttributeValueType { string, int, uint, address }

// attribute type data definition
export interface IAttributeType {
	id: Guid;
	name: string;
	valueType: AttributeValueType;
	entityType: Guid;
}

// attribute type implementation
export class AttributeType implements IAttributeType {
	id: Guid;
	name: string;
	valueType: AttributeValueType;
	entityType: Guid;

	constructor(id: Guid, valueType: AttributeValueType, entityType: Guid) {
		this.id = id;
		this.valueType = valueType;
		this.entityType = entityType;
	}
}

// data model data definition
export interface IDataModel {
	id: Guid;
	name: string;
	entityTypes: IEntityType[];
	attributeTypes: IAttributeType[];
	connections: IConnection[];
}

// data model implementation
export class DataModel implements IDataModel {
	public id: Guid;
	public name: string;
	public entityTypes: IEntityType[];
	public attributeTypes: IAttributeType[];
	public connections: IConnection[];

	constructor(id: Guid, name: string) {
		this.id = id;
		this.name = name;
		this.entityTypes = [];
		this.attributeTypes = [];
		this.connections = [];
	}

}



// ------------ Action Model --------------------


// action rule data definition
export interface IActionRule {
	id: Guid;
	name: string;
	ruleFormulation: string;
}

// action rule implementation
export class ActionRule implements IActionRule {
	public id: Guid;
	public name: string;
	public ruleFormulation: string;

	constructor(id: Guid, name: string, ruleFormulation?: string) {
		this.id = id;
		this.name = name;
		if (ruleFormulation)
			this.ruleFormulation = ruleFormulation;
		else
			this.ruleFormulation = "";
	}
}


// ------------ Diagrams --------------------

// 2D point definition - represents 2D cooridinates
export interface IPoint {
	xPos: number;
	yPos: number;
}

// 2D point coordinates implementation
export class Point {
	constructor(public xPos: number, public yPos: number) { }
}

// (abstract) diagram data definition
export interface IDiagram {
	id: Guid;
	name: string;
}

// (abstract) diagram implementation
export abstract class Diagram implements IDiagram {
	public id: Guid;
	public name: string;

	constructor(id: Guid, name: string) {
		this.id = id;
		this.name = name;
	}
}


export interface ITransactorPosition {
	trasactorId: Guid;
	children: ITransactorPosition[];
}

export class TransactorPosition implements ITransactorPosition {
	trasactorId: Guid;
	children: TransactorPosition[];

	constructor(transactorId: Guid) {
		this.trasactorId = transactorId;
		this.children = [];
	}
}


export interface ILinkPosition {
	linkId: Guid;
	sourcePositionDown: boolean;
	targetPositionDown: boolean;
	lineBends: IPoint[];
}

export class LinkPosition implements ILinkPosition {
	linkId: Guid;
	lineBends: Point[];
	sourcePositionDown: boolean;
	targetPositionDown: boolean;

	constructor(linkId: Guid, sourcePositionDown: boolean, targetPositionDown: boolean, lineBends?: Point[]) {
		this.linkId = linkId;
		this.sourcePositionDown = sourcePositionDown;
		this.targetPositionDown = targetPositionDown;
		if (lineBends) {
			this.lineBends = lineBends;
		}
		else {
			this.lineBends = [];
		}
	}

}

export interface IConstructionDiagram extends IDiagram {
	hiddenRoot: ITransactorPosition;
	linkPositions: ILinkPosition[];
}

export class ConstructionDiagram extends Diagram implements IConstructionDiagram {
	hiddenRoot: TransactorPosition;
	linkPositions: LinkPosition[];

	constructor(id: Guid, name: string, rootPosition?: Point, hiddenRoot?: TransactorPosition) {
		super(id, name);
		if (hiddenRoot) {
			this.hiddenRoot = hiddenRoot;
		}
		else {
			this.hiddenRoot = new TransactorPosition(Guid.createEmpty());
		}

		this.linkPositions = [];
	}
}

export interface IDataStructureDiagram extends IDiagram {
	// TODO
}

export interface IActionRuleDiagram extends IDiagram {
	// TODO
}

/** @see {IPsiContract} ts-auto-guard:type-guard */
export interface IPsiContract {
	id: Guid;
	versionId: Guid;
	name: string;
	description?: string;
	transactionKinds: ITransactionKind[];
	actorRoles: IActorRole[];
	processes: IProcess[];
	dataModel: IDataModel;
	actionRules: IActionRule[];
	diagrams: IDiagram[];
}

// PSI CONTRACT IMPLEMENTATION
export class PsiContract implements IPsiContract {

	public transactionKinds: TransactionKind[] = undefined;

	public actorRoles: ActorRole[] = undefined;

	public processes: Process[] = undefined;

	public dataModel: IDataModel = undefined;

	public actionRules: ActionRule[] = undefined;

	public diagrams: IDiagram[] = undefined;

	public id: Guid = undefined;

	public versionId: Guid = undefined;

	public name: string = undefined;

	public description?: string = undefined;

	constructor(
		id: Guid,
		name: string,
		versionId: Guid,
		description?: string,
	) {
		this.id = id;
		this.name = name;
		this.versionId = versionId;
		if (description) {
			this.description = description;
		}


		this.actorRoles = [];
		this.transactionKinds = [];
		this.processes = [];
		this.dataModel = new DataModel(Guid.create(), "");
		this.actionRules = [];
		this.diagrams = [];
		this.diagrams.push(new ConstructionDiagram(Guid.create(), ""));
	}
}















// -------- DEPRICATED CODE -----------
// 		!!! DO NOT USE !!!


/** @deprecated */
export class IWhenPart {
	transaction: string;
	act: string;
	constructor(trans: string, act: string) {
		this.transaction = trans;
		this.act = act;
	}
}

/** @deprecated */
export class IWhilePart {
	transaction: string;
	act: CAct;
	constructor(trans: string, act: CAct) {
		this.transaction = trans;
		this.act = act;
	}
}

/** @deprecated */
export class IWithPart {
	// PLACEHOLDER!!
	dataProperty: string[];
	constructor(data: any) {
		this.dataProperty = data;
	}

}

/** @deprecated */
export class IIfPart {
	boolExpression: string;
	constructor(exp: string) {
		this.boolExpression = exp;
	}
}

/** @deprecated */
export class IThenPart {
	actions: IAmdAction[];
	constructor(a: IAmdAction[]) {
		this.actions = a;
	}
}

export class IElsePart {
	actions: IAmdAction[];
	constructor(a: IAmdAction[]) {
		this.actions = a;
	}
}

/** @deprecated */
export interface IAmdAction {
}

/** @deprecated */
export class IAssign implements IAmdAction {
	parameter: string;
	value: string;
	constructor(param: string, val: string) {
		this.parameter = param;
		this.value = val;
	}
}


/** @deprecated */
export class IAct implements IAmdAction {
	transaction: string;
	act: string;
	parameters: any;
	constructor(trans: any, act: string, param: any) {
		this.transaction = trans;
		this.act = act;
		this.parameters = param;
	}
}

/** @deprecated */
export class IStart implements IAmdAction {
	parameters: any;
	transaction: string;
	constructor(trans: any, param: any) {
		this.transaction = trans;
		this.parameters = param;
	}
}

/** @deprecated */

/*
export class IActionRule {

	id: Guid;
	name: string;
	blockId: string;
	// TODO
	whenPart: IWhenPart;
	whilePart: IWhilePart;
	withPart: IWithPart;
	ifPart: IIfPart;
	thenPart: IThenPart;
	elsePart: IElsePart;
	constructor(
		_id: Guid,
		_blockId: string,
		when: IWhenPart,
		_while: IWhilePart,
		_with: IWithPart,
		_if: IIfPart,
		_then: IThenPart,
		_else: IElsePart) {
		this.id = _id;
		this.blockId = _blockId;
		this.whenPart = when;
		this.whilePart = _while;
		this.withPart = _with;
		this.ifPart = _if;
		this.thenPart = _then;
		this.elsePart = _else;
	}
}
*/
