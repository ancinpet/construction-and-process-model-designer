import { IElementaryTransactor, ISelfActivatingTransactor, IPsiContract, ITransactionKind, IActorRole, ITransactor, IProcess, IConnection, IAttributeType, IEntityType, IActionRule, IDiagram, ILink, IWaitLink, IInspectionLink, ITransactorPosition, IConstructionDiagram, TransactorPosition, AttributeValueType, ActorRoleType, TransactionSort, ICompositeTransactor, CAct, IDataModel } from './model';
import { Guid } from 'guid-typescript';


/*
*utility functions that can make manipulation with model easier
*functionality: 
*			- typescript custom type guards for some objects (interfaces)
*			- ADD, GET, REMOVE functions for psi contract parts
*			- other useful utility function
*
*/


/** 
* reviever function for JSON parsing - to parse GUID objects (js plain objects parsed from JSON) to GUID class instances
*/
export function jsonGuidReviver(key, value) {
	if (value && value.hasOwnProperty("value")) {
		return Object.assign(Guid.createEmpty(), value);
	}
	else {
		return value;
	}
}

export function equals(objectA: any, objectB: any): boolean {
	return JSON.stringify(objectA) === JSON.stringify(objectB);
}


/**
* function to  recursivelly parse GUID objects (js plain objects parsed from JSON) to GUID class instances
* @depricated  @see jsonGuidReviver
*/
export function deserializeGUIDs(object: any): any {
	if (!object) {
		return;
	}
	for (const key in object) {
		if (object.hasOwnProperty(key)) {
			if (object[key] && object[key].hasOwnProperty("value")) {
				object[key] = Object.assign(Guid.createEmpty(), object[key]);
			}
			else {
				if (object != object[key]) {
					deserializeGUIDs(object[key]);
				}
			}
		}
	}
	return object;
}

/**
 * TEMPORARY
 */
export function getConstructionDiagram(psiContract: IPsiContract): IConstructionDiagram {
	return psiContract.diagrams[0] as IConstructionDiagram;
}

/**
 * equals function for guids
 * @param id1 
 * @param id2 
 */
export function guidEquals(id1: Guid, id2: Guid): boolean {
	// return (id1 as any).value == (id2 as any).value;
	return id1.equals(id2);
}

/**
 * ElementaryTransactor type guard
 * @param object 
 */
export function isEelentaryTransactor(object: any): object is IElementaryTransactor {
	return (
		'transactionKind' in object &&
		'cardinality' in object &&
		'sourceCAct' in object
	);
}

/**
 * SelfActivatingTransactor type guard
 * @param object 
 */
export function isSelfActivatingTransactor(object: any): object is ISelfActivatingTransactor {
	return (
		'transactionKind' in object
	);
}

export function isCompositeTransactor(object: any): object is ICompositeTransactor {
	return (!isSelfActivatingTransactor(object) && !isEelentaryTransactor(object))
}

/**
 * WaitLink type guard
 * @param object 
 */
export function isWaitLink(object: any): object is IWaitLink {
	return (
		'waitingForTransactor' in object &&
		'sourceCAct' in object &&
		'targetCAct' in object &&
		object.waitingForTransactor &&
		object.sourceCAct != null &&
		object.targetCAct != null &&
		CAct[object.sourceCAct] != undefined &&
		CAct[object.targetCAct] != undefined
	);
}

/**
 * InspectionLink type guard
 * @param object 
 */
export function isInspectionLink(object: any): object is IInspectionLink {
	return (
		'inspectionTargetTransactor' in object &&
		object.inspectionTargetTransactor &&
		Guid.isGuid(object.inspectionTargetTransactor)
	);
}

export function isConstructionDiagram(object: any): object is IConstructionDiagram {
	return (
		'hiddenRoot' in object &&
		'linkPositions' in object
	);
}

export function isActorRole(object: any): object is IActorRole {
	return (
		'id' in object &&
		'identificationNumber' in object &&
		'name' in object &&
		'type' in object &&
		object.id &&
		object.identificationNumber != null &&
		// object.name &&
		object.type != null &&
		Guid.isGuid(object.id) &&
		typeof object.identificationNumber == 'number' &&
		typeof object.name == 'string' &&
		typeof object.type == 'number' &&
		ActorRoleType[object.type] != undefined
	)
}

export function isTransactionKind(object: any): object is ITransactionKind {
	return (
		'id' in object &&
		'identificationNumber' in object &&
		'name' in object &&
		'transactionSort' in object &&
		'executor' in object &&
		object.id &&
		object.identificationNumber != null &&
		// object.name &&
		object.transactionSort != null &&
		object.executor &&
		Guid.isGuid(object.id) &&
		typeof object.identificationNumber == 'number' &&
		typeof object.name == 'string' &&
		typeof object.transactionSort == 'number' &&
		TransactionSort[object.transactionSort] != undefined &&
		Guid.isGuid(object.executor)
	)
}
export function isProcess(object: any): object is IProcess {
	if (!('id' in object &&
		'name' in object &&
		'root' in object &&
		'bpmnDiagrams' in object &&
		object.id &&
		// object.name &&
		Guid.isGuid(object.id) &&
		typeof object.name == 'string' &&
		object.bpmnDiagrams &&
		Array.isArray(object.bpmnDiagrams)
	)) {
		return false;
	}
	if (object.root) {
		if (isTransactor(object.root)) {
			return true;
		}
		else {
			return false;
		}
	}
	return true;

}



export function isTransactor(object: any): object is ITransactor {
	let x: number[];
	return (
		'id' in object &&
		'actorRole' in object &&
		'waitLinks' in object &&
		'inspectionLinks' in object &&
		'children' in object &&

		object.id &&
		object.actorRole &&
		object.waitLinks &&
		object.inspectionLinks &&
		object.children &&

		Guid.isGuid(object.id) &&
		Guid.isGuid(object.actorRole) &&
		Array.isArray(object.waitLinks) &&
		Array.isArray(object.inspectionLinks) &&
		Array.isArray(object.children) &&
		object.waitLinks.every(elem => isWaitLink(elem)) &&
		object.inspectionLinks.every(elem => isInspectionLink(elem)) &&
		object.children.every(elem => isTransactor(elem))
	)
}
export function isDataModel(object: any): object is IDataModel {
	return (
		'id' in object &&
		'name' in object &&
		'entityTypes' in object &&
		'attributeTypes' in object &&
		'connections' in object &&

		object.id &&
		// object.name //&&
		object.entityTypes &&
		object.attributeTypes &&
		object.connections &&

		Guid.isGuid(object.id) &&
		typeof object.name == 'string' &&
		Array.isArray(object.entityTypes) &&
		Array.isArray(object.attributeTypes) &&
		Array.isArray(object.connections)
	);
}

export function isActionRule(object: any): object is IActionRule {
	return (
		'id' in object &&
		'name' in object &&
		'ruleFormulation' in object &&
		object.id &&
		// object.name &&
		// object.ruleFormulation &&
		Guid.isGuid(object.id) &&
		typeof object.name == 'string' &&
		typeof object.ruleFormulation == 'string'
	);
}

export function isPsiContract(object: any): object is IPsiContract {
	let result: boolean = false;

	if (!('id' in object &&
		'versionId' in object &&
		'name' in object &&
		'transactionKinds' in object &&
		'actorRoles' in object &&
		'processes' in object &&
		'dataModel' in object &&
		'actionRules' in object &&
		'diagrams' in object)) {
		return false;
	}

	let psiContract = object as IPsiContract;
	if (
		psiContract.id &&
		psiContract.versionId != null &&
		// psiContract.name &&
		psiContract.transactionKinds &&
		psiContract.actorRoles &&
		psiContract.processes &&
		psiContract.dataModel &&
		psiContract.actionRules &&
		psiContract.diagrams &&
		Guid.isGuid(psiContract.id) &&
		typeof psiContract.name == 'string' &&
		Guid.isGuid(psiContract.versionId) &&
		Array.isArray(psiContract.transactionKinds) &&
		Array.isArray(psiContract.actorRoles) &&
		Array.isArray(psiContract.processes) &&
		Array.isArray(psiContract.actionRules) &&
		Array.isArray(psiContract.diagrams) &&

		isDataModel(psiContract.dataModel) &&
		psiContract.transactionKinds.every(elem => isTransactionKind(elem)) &&
		psiContract.actorRoles.every(elem => isActorRole(elem)) &&
		psiContract.processes.every(elem => isProcess(elem)) &&
		psiContract.actionRules.every(elem => isActionRule(elem)) &&
		isConstructionDiagram(psiContract.diagrams[0])
	) {
		return true;
	}

}


// returns transaction from model by its model reference ID
export function getTransactionKind(psiContract: IPsiContract, referenceId: Guid): ITransactionKind {

	return psiContract.transactionKinds.find(transaction => guidEquals(transaction.id, referenceId));

}


export function removeTransactionKind(psiContract: IPsiContract, referenceId: Guid) {
	psiContract.transactionKinds = psiContract.transactionKinds.filter(transaction => !guidEquals(transaction.id, referenceId));
}

export function addTransactionKind(psiContract: IPsiContract, transactionKind: ITransactionKind) {
	psiContract.transactionKinds.push(transactionKind);
}

//returns actorRole from model by its reference ID
export function getActorRole(psiContract: IPsiContract, referenceId: Guid): IActorRole {
	return psiContract.actorRoles.find(actorRole => guidEquals(actorRole.id, referenceId));
}

export function removeActorRole(psiContract: IPsiContract, referenceId: Guid) {
	psiContract.actorRoles = psiContract.actorRoles.filter(actorRole => !guidEquals(actorRole.id, referenceId));
}

export function addActorRole(psiContract: IPsiContract, actorRole: IActorRole) {
	psiContract.actorRoles.push(actorRole);
}

export function searchProcesses(psiContract: IPsiContract, validator: (T: ITransactor) => boolean): ITransactor {
	let result: ITransactor = null;
	psiContract.processes.forEach(element => {
		let res = searchProcess(element.root, validator);

		if (res) {
			result = res;
			return;
		}
	});
	return result;
}

export function getConstraintLink(psiContract: IPsiContract, referenceId: Guid): ILink {
	function validator(transactor: ITransactor): boolean {
		return transactor.waitLinks.some(link => guidEquals(link.id, referenceId))
			|| transactor.inspectionLinks.some(link => guidEquals(link.id, referenceId))
	};
	let transactor = searchProcesses(psiContract, validator);
	let link: ILink = transactor.waitLinks.find(link => guidEquals(link.id, referenceId));
	if (!link) {
		link = transactor.inspectionLinks.find(link => guidEquals(link.id, referenceId));
	}
	return link;
}

export function parseBpmnIdFromXml(xmlString: string): string {
	let parser = new DOMParser();
	let xmlDoc = parser.parseFromString(xmlString, "text/xml");
  let result = xmlDoc.getElementsByTagNameNS("*", "process")[0].getAttribute("id");
	return result;
}

export function parseBpmnNameFromXml(xmlString: string): string {
	let parser = new DOMParser();
	let xmlDoc = parser.parseFromString(xmlString, "text/xml");
  let result = xmlDoc.getElementsByTagNameNS("*", "process")[0].getAttribute("name");
	return result;
}

export function getBpmnDiagram(process: IProcess, id: string): string {
	return process.bpmnDiagrams.find((bpmnDiagram) => parseBpmnIdFromXml(bpmnDiagram) == id);
}

export function getConstraintLinkTransactor(psiContract: IPsiContract, referenceId: Guid): ITransactor {
	function validator(transactor: ITransactor): boolean {
		return transactor.waitLinks.some(link => guidEquals(link.id, referenceId))
			|| transactor.inspectionLinks.some(link => guidEquals(link.id, referenceId))
	};
	let transactor = searchProcesses(psiContract, validator);

	return transactor;
}

export function getTransactor(psiContract: IPsiContract, referenceId: Guid): ITransactor {
	let result: ITransactor = null;
	psiContract.processes.forEach(element => {
		let res: ITransactor = findTransactorNode(element.root, referenceId);
		if (res) {
			result = res;
			return;
		}
	});
	return result;
}

export function removeTransactor(psiContract: IPsiContract, referenceId: Guid) {
	psiContract.processes.forEach(process => {
		if (process.root) {
			if (guidEquals(process.root.id, referenceId)) {
				let toBeRemovedTransactor = process.root;
				process.root = null;
				deleteTransactor(psiContract, toBeRemovedTransactor);

				let diagram = getConstructionDiagram(psiContract);
				let parentVertex = diagram.hiddenRoot.children.find(element => guidEquals(element.children[0].trasactorId, referenceId));
				parentVertex.children = parentVertex.children.filter(element => !guidEquals(element.trasactorId, referenceId));
				return;
			}
			else {
				let parentNode: ITransactor = findTransactorParentNode(process.root, referenceId);
				if (parentNode) {
					let toBeRemovedTransactor: ITransactor = parentNode.children.find(element => guidEquals(element.id, referenceId));
					parentNode.children = parentNode.children.filter(element => !guidEquals(element.id, referenceId));
					deleteTransactor(psiContract, toBeRemovedTransactor);

					let diagram = getConstructionDiagram(psiContract);
					let parentVertex = findTransactorParentVertex(diagram.hiddenRoot, referenceId);
					parentVertex.children = parentVertex.children.filter(element => !guidEquals(element.trasactorId, referenceId));

					return;
				}

			}
		}
	});

}

export function addTransactor(psiContract: IPsiContract, transactor: ITransactor, connectNode: Guid) {
	if (isEelentaryTransactor(transactor)) {
		psiContract.processes.forEach(process => {
			let connectNodeTransactor = findTransactorNode(process.root, connectNode);
			if (connectNodeTransactor) {
				connectNodeTransactor.children.push(transactor);
			}
		});
		let diagram = getConstructionDiagram(psiContract);
		findTransactorVertex(diagram.hiddenRoot, connectNode).children.push(new TransactorPosition(transactor.id));
	}
	else {
		psiContract.processes.forEach(process => {
			if (guidEquals(process.id, connectNode)) {
				process.root = transactor;
			}

		});

		let diagram = getConstructionDiagram(psiContract);
		diagram.hiddenRoot.children.find(element => guidEquals(element.trasactorId, connectNode)).children.push(new TransactorPosition(transactor.id));
	}
}

export function getProcess(psiContract: IPsiContract, referenceId: Guid): IProcess {
	return psiContract.processes.find(process => guidEquals(process.id, referenceId));
}

export function addProcess(psiContract: IPsiContract, process: IProcess) {
	psiContract.processes.push(process);
	getConstructionDiagram(psiContract).hiddenRoot.children.push(new TransactorPosition(process.id));
}

export function removeProcess(psiContract: IPsiContract, referenceId: Guid) {
	let toBeRemovedTransactor = psiContract.processes.find(process => guidEquals(process.id, referenceId)).root;
	psiContract.processes = psiContract.processes.filter(process => !guidEquals(process.id, referenceId));
	deleteTransactor(psiContract, toBeRemovedTransactor);


	let diagram = getConstructionDiagram(psiContract);
	diagram.hiddenRoot.children = diagram.hiddenRoot.children.filter(element => !guidEquals(element.trasactorId, referenceId));
}

export function getConnection(psiContract: IPsiContract, referenceId: Guid): IConnection {
	return psiContract.dataModel.connections.find(connection => guidEquals(connection.id, referenceId));
}

export function addConnection(psiContract: IPsiContract, connection: IConnection) {
	psiContract.dataModel.connections.push(connection);
}

export function removeConnection(psiContract: IPsiContract, referenceId: Guid) {
	psiContract.dataModel.connections = psiContract.dataModel.connections.filter(connection => !guidEquals(connection.id, referenceId));
	findAndRemoveInvalidConnections(psiContract.dataModel.connections, referenceId);
}

export function getAttributeType(psiContract: IPsiContract, referenceId: Guid): IAttributeType {
	return psiContract.dataModel.attributeTypes.find(attributeType => guidEquals(attributeType.id, referenceId));
}

export function addAttributeType(psiContract: IPsiContract, attributeType: IAttributeType) {
	psiContract.dataModel.attributeTypes.push(attributeType);
}

export function removeAttributeType(psiContract: IPsiContract, referenceId: Guid) {
	psiContract.dataModel.attributeTypes =
		psiContract.dataModel.attributeTypes.filter(attributeType => !guidEquals(attributeType.id, referenceId));
}

export function getEntityType(psiContract: IPsiContract, referenceId: Guid): IEntityType {
	return psiContract.dataModel.entityTypes.find(entityType => guidEquals(entityType.id, referenceId));
}

export function addEntityType(psiContract: IPsiContract, entityType: IEntityType) {
	psiContract.dataModel.entityTypes.push(entityType);
}

export function removeEntityType(psiContract: IPsiContract, referenceId: Guid) {
	let entity: IEntityType = psiContract.dataModel.entityTypes.find(entityType => guidEquals(entityType.id, referenceId));

	if (entity.productKind) {
		findAndRemoveInvalidConnections(psiContract.dataModel.connections, entity.productKind.id);
	}
	findAndRemoveInvalidConnections(psiContract.dataModel.connections, referenceId);

	psiContract.dataModel.entityTypes =
		psiContract.dataModel.entityTypes.filter(entityType => !guidEquals(entityType.id, referenceId));
	psiContract.dataModel.attributeTypes =
		psiContract.dataModel.attributeTypes.filter(attributeType => !guidEquals(attributeType.entityType, referenceId));
}

export function getActionRule(psiContract: IPsiContract, referenceId: Guid): IActionRule {
	return psiContract.actionRules.find(actionRule => guidEquals(actionRule.id, referenceId));
}

export function addActionRule(psiContract: IPsiContract, actionRule: IActionRule) {
	psiContract.actionRules.push(actionRule);
}

export function removeActionRule(psiContract: IPsiContract, referenceId: Guid) {
	psiContract.actionRules = psiContract.actionRules.filter(actionRule => !guidEquals(actionRule.id, referenceId));
}

export function getDiagram(psiContract: IPsiContract, referenceId: Guid): IDiagram {
	return psiContract.diagrams.find(diagram => guidEquals(diagram.id, referenceId));
}

export function addDiagram(psiContract: IPsiContract, diagram: IDiagram) {
	psiContract.diagrams.push(diagram);
}

export function removeDiagram(psiContract: IPsiContract, referenceId: Guid) {
	psiContract.diagrams = psiContract.diagrams.filter(diagram => !guidEquals(diagram.id, referenceId));
}

/**
 * checks if transactor has some children transactors
 * @param transactor 
 */
export function hasChildren(transactor: ITransactor): boolean {
	if (!transactor) {
		return false;
	}

	if (!transactor.children) {
		return false;
	}
	if (transactor.children.length == 0) {
		return false;
	}
	return true;
}

export function actorRoleIsReferenced(psiContract: IPsiContract, actorRoleId: Guid): boolean {
	let validator = ((transactor: ITransactor) => guidEquals(transactor.actorRole, actorRoleId));
	return (searchProcesses(psiContract, validator) !== null);
}

export function transactionKindIsReferenced(psiContract: IPsiContract, transactionKindId: Guid): boolean {
	let validator = ((transactor: ITransactor) =>
		(isEelentaryTransactor(transactor) || isSelfActivatingTransactor(transactor))
		&& guidEquals(transactor.transactionKind, transactionKindId));
	return (searchProcesses(psiContract, validator) !== null);
}


export function swapTransactors(psiContract: IPsiContract, sourceTransactorReference: Guid, targetTransactorReference: Guid): void {
	swapTransactorsInModel(psiContract, sourceTransactorReference, targetTransactorReference);
	swapTransactorsInDiagram(psiContract, sourceTransactorReference, targetTransactorReference);
}

export function appendTransactor(psiContract: IPsiContract, sourceTransactorReference: Guid, targetTransactorReference: Guid): void {
	appendTransactorInModel(psiContract, sourceTransactorReference, targetTransactorReference);
	appendTransactorInDiagram(psiContract, sourceTransactorReference, targetTransactorReference);
}

export function appendTransactorInbetween(
	psiContract: IPsiContract,
	sourceTransactorReference: Guid,
	targetTransactorReference: Guid,
	transactorFirst: Guid,
	transactorSecond: Guid): void {

	appendTransactorInModel(psiContract, sourceTransactorReference, targetTransactorReference);
	appendTransactorInbetweenInDiagram(psiContract, sourceTransactorReference, targetTransactorReference, transactorFirst, transactorSecond);
}

export function getTransactorPosition(psiContract: IPsiContract, referenceId: Guid): ITransactorPosition {
	let result: ITransactorPosition;
	psiContract.diagrams.forEach(element => {
		if (isConstructionDiagram(element)) {
			let res: ITransactorPosition = findTransactorVertex(element.hiddenRoot, referenceId);
			if (res) {
				result = res;
				return;
			}
		}
	});
	return result;
}


export function attributeValueTypeToString(valueType: AttributeValueType): string {
	let result: string;
	switch (valueType) {
		case AttributeValueType.int:
			result = "int";
			break;

		case AttributeValueType.address:
			result = "address";
			break;

		case AttributeValueType.string:
			result = "string";
			break;

		case AttributeValueType.uint:
			result = "uint";
			break;

		default:
			result = "?";
			break;
	}
	return result;
}

export function getHighestTransactionNumber(psiContract: IPsiContract): number {
	let best = 0;
	psiContract.transactionKinds.forEach(transactionKind => {
		if (transactionKind.identificationNumber > best) {
			best = transactionKind.identificationNumber;
		}
	});

	return best;
}

export function getHighestActorNumber(psiContract: IPsiContract): number {
	let best = 0;
	psiContract.actorRoles.forEach(actorRole => {
		if (actorRole.identificationNumber > best) {
			best = actorRole.identificationNumber;
		}
	});

	return best;
}

export function getHighestProcessNumber(psiContract: IPsiContract): number {
	let best = 0;
	psiContract.processes.forEach(process => {
		let matches = process.name.match(/\d+/);

		if (matches && matches.length > 0) {
			let tmpNumber: number = +matches[matches.length - 1];

			if (!isNaN(tmpNumber) && tmpNumber > best) {
				best = tmpNumber;
			}
		}
	});

	return best;
}


// ------------------ internal functions --------------

// deletes transactors assets from psiContract (recursively)
function deleteTransactor(psiContract: IPsiContract, transactor: ITransactor): void {
	if (!transactor) {
		return;
	}

	// remove transaction kind if it is its last apperance in model
	if ((isEelentaryTransactor(transactor) || isSelfActivatingTransactor(transactor))
		&& !transactionKindIsReferenced(psiContract, transactor.transactionKind)) {
		removeTransactionKind(psiContract, transactor.transactionKind)
	}

	// remove actor role if it is its last apperance in model
	if (!actorRoleIsReferenced(psiContract, transactor.actorRole)) {
		removeActorRole(psiContract, transactor.actorRole);
	}

	// remove all contraint links targeted to this transactor
	psiContract.processes.forEach(process => findAndRemoveInvalidConstraintLinks(process.root, transactor.id));

	// recursively deletes assets of the children
	transactor.children.forEach(child => deleteTransactor(psiContract, child));
}

function findTransactorNode(transactor: ITransactor, targetId: Guid): ITransactor {
	if (!transactor) {
		return null;
	}

	if (guidEquals(transactor.id, targetId)) {
		return transactor;
	}
	else {
		let result: ITransactor = null;
		transactor.children.forEach(element => {
			let res: ITransactor = findTransactorNode(element, targetId);
			if (res) {
				result = res;
				return;
			}

		});
		return result;
	}
}

function searchProcess(transactor: ITransactor, validator: (T: ITransactor) => boolean): ITransactor {
	if (!transactor) {
		return null;
	}

	if (validator(transactor)) {
		return transactor;
	}
	else {
		let result: ITransactor = null;
		transactor.children.forEach(element => {
			let res: ITransactor = searchProcess(element, validator);
			if (res) {
				result = res;
				return;
			}

		});
		return result;
	}
}

function findTransactorParentNode(transactor: ITransactor, targetId: Guid): ITransactor {
	if (!transactor) {
		return null;
	}

	if (transactor.children.some(element => guidEquals(element.id, targetId))) {
		return transactor;
	}
	else {
		let result: ITransactor = null;
		transactor.children.forEach(element => {
			let res: ITransactor = findTransactorParentNode(element, targetId);
			if (res) {
				result = res;
				return;
			}
		});
		return result;
	}
}

function findTransactorVertex(vertex: ITransactorPosition, targetId: Guid): ITransactorPosition {
	if (!vertex) {
		return null;
	}

	if (guidEquals(vertex.trasactorId, targetId)) {
		return vertex;
	}
	else {
		let result: ITransactorPosition = null;
		vertex.children.forEach(element => {
			let res: ITransactorPosition = findTransactorVertex(element, targetId);
			if (res) {
				result = res;
				return;
			}

		});
		return result;
	}
}


function findTransactorParentVertex(vertex: ITransactorPosition, targetId: Guid): ITransactorPosition {
	if (!vertex) {
		return null;
	}

	if (vertex.children.some(element => guidEquals(element.trasactorId, targetId))) {
		return vertex;
	}
	else {
		let result: ITransactorPosition = null;
		vertex.children.forEach(element => {
			let res: ITransactorPosition = findTransactorParentVertex(element, targetId);
			if (res) {
				result = res;
				return;
			}
		});
		return result;
	}
}


function swapTransactorsInModel(psiContract: IPsiContract, sourceTransactorReference: Guid, targetTransactorReference: Guid): void {
	let sourceTransactorParent: ITransactor,
		targetTransactorParent: ITransactor,
		sourceTransactor: ITransactor,
		targetTransactor: ITransactor;
	let swapBranch: Boolean = true;

	psiContract.processes.forEach(element => {
		let res: ITransactor = findTransactorParentNode(element.root, sourceTransactorReference);
		if (res) {
			sourceTransactorParent = res;
			return;
		}
	});

	psiContract.processes.forEach(element => {
		let res: ITransactor = findTransactorParentNode(element.root, targetTransactorReference);
		if (res) {
			targetTransactorParent = res;
			return;
		}
	});

	// it is processes
	if (targetTransactorParent == null || sourceTransactorParent == null) {
		return;
	}

	sourceTransactor = sourceTransactorParent.children.find(element => guidEquals(element.id, sourceTransactorReference));

	targetTransactor = targetTransactorParent.children.find(element => guidEquals(element.id, targetTransactorReference));

	if (findTransactorNode(sourceTransactor, targetTransactorReference) ||
		findTransactorNode(targetTransactor, sourceTransactorReference)) {
		swapBranch = false;
	}

	sourceTransactorParent.children =
		sourceTransactorParent.children.filter(element => !guidEquals(element.id, sourceTransactorReference))

	targetTransactorParent.children =
		targetTransactorParent.children.filter(element => !guidEquals(element.id, targetTransactorReference));

	if (!swapBranch) {
		console.log("model swap");

		let tmp = sourceTransactor.children;
		sourceTransactor.children = targetTransactor.children;
		targetTransactor.children = tmp;
	}

	if (guidEquals(sourceTransactor.id, targetTransactorParent.id)) {
		sourceTransactorParent.children.push(targetTransactor as IElementaryTransactor);
		targetTransactor.children.push(sourceTransactor as IElementaryTransactor);
	}
	else if (guidEquals(targetTransactor.id, sourceTransactorParent.id)) {
		targetTransactorParent.children.push(sourceTransactor as IElementaryTransactor);
		sourceTransactor.children.push(targetTransactor as IElementaryTransactor);
	}
	else {
		sourceTransactorParent.children.push(targetTransactor as IElementaryTransactor);
		targetTransactorParent.children.push(sourceTransactor as IElementaryTransactor);
	}
}

function appendTransactorInModel(psiContract: IPsiContract, sourceTransactorReference: Guid, targetTransactorReference: Guid): void {
	let sourceTransactorParent: ITransactor,
		sourceTransactor: ITransactor,
		targetTransactor: ITransactor;

	psiContract.processes.forEach(element => {
		let res: ITransactor = findTransactorParentNode(element.root, sourceTransactorReference);
		if (res) {
			sourceTransactorParent = res;
			return;
		}
	});
	sourceTransactor = sourceTransactorParent.children.find(element => guidEquals(element.id, sourceTransactorReference));
	sourceTransactorParent.children =
		sourceTransactorParent.children.filter(element => !guidEquals(element.id, sourceTransactorReference))


	targetTransactor = getTransactor(psiContract, targetTransactorReference);

	targetTransactor.children.push(sourceTransactor as IElementaryTransactor);
}

function swapTransactorsInDiagram(psiContract: IPsiContract, sourceTransactorReference: Guid, targetTransactorReference: Guid): void {

	let sourceVertexParent: ITransactorPosition,
		targetVertexParent: ITransactorPosition,
		sourceVertex: ITransactorPosition,
		targetVertex: ITransactorPosition;
	let swapBranch: Boolean = true;


	psiContract.diagrams.forEach(element => {
		if (isConstructionDiagram(element)) {
			let res: ITransactorPosition = findTransactorParentVertex(element.hiddenRoot, sourceTransactorReference);
			if (res) {
				sourceVertexParent = res;
				return;
			}
		}
	});

	psiContract.diagrams.forEach(element => {
		if (isConstructionDiagram(element)) {
			let res: ITransactorPosition = findTransactorParentVertex(element.hiddenRoot, targetTransactorReference);
			if (res) {
				targetVertexParent = res;
				return;
			}
		}
	});

	sourceVertex = sourceVertexParent.children.find(element => guidEquals(element.trasactorId, sourceTransactorReference));

	targetVertex = targetVertexParent.children.find(element => guidEquals(element.trasactorId, targetTransactorReference));

	if (findTransactorVertex(sourceVertex, targetTransactorReference) ||
		findTransactorVertex(targetVertex, sourceTransactorReference)) {
		swapBranch = false;
	}


	let sourceVertexPos: number, targetVertexPos: number;

	sourceVertexPos = sourceVertexParent.children.findIndex(element => guidEquals(element.trasactorId, sourceTransactorReference));
	targetVertexPos = targetVertexParent.children.findIndex(element => guidEquals(element.trasactorId, targetTransactorReference));

	sourceVertexParent.children =
		sourceVertexParent.children.filter(element => !guidEquals(element.trasactorId, sourceTransactorReference))

	targetVertexParent.children =
		targetVertexParent.children.filter(element => !guidEquals(element.trasactorId, targetTransactorReference));

	if (!swapBranch) {
		console.log("diagram swap");
		let tmp = sourceVertex.children;
		sourceVertex.children = targetVertex.children;
		targetVertex.children = tmp;
	}

	if (guidEquals(sourceVertex.trasactorId, targetVertexParent.trasactorId)) {
		sourceVertexParent.children.splice(sourceVertexPos, 0, targetVertex);
		targetVertex.children.splice(targetVertexPos, 0, sourceVertex); //
	}
	else if (guidEquals(targetVertex.trasactorId, sourceVertexParent.trasactorId)) {
		targetVertexParent.children.splice(targetVertexPos, 0, sourceVertex);
		sourceVertex.children.splice(sourceVertexPos, 0, targetVertex); //
	}
	else {
		if (sourceVertexPos < targetVertexPos) {
			sourceVertexParent.children.splice(sourceVertexPos, 0, targetVertex);
			targetVertexParent.children.splice(targetVertexPos, 0, sourceVertex);
		}
		else {
			targetVertexParent.children.splice(targetVertexPos, 0, sourceVertex);
			sourceVertexParent.children.splice(sourceVertexPos, 0, targetVertex);
		}
	}
}

function appendTransactorInDiagram(psiContract: IPsiContract, sourceTransactorReference: Guid, targetTransactorReference: Guid): void {
	let sourceVertexParent: ITransactorPosition,
		sourceVertex: ITransactorPosition,
		targetVertex: ITransactorPosition;

	psiContract.diagrams.forEach(element => {
		if (isConstructionDiagram(element)) {
			let res: ITransactorPosition = findTransactorParentVertex(element.hiddenRoot, sourceTransactorReference);
			if (res) {
				sourceVertexParent = res;
				return;
			}
		}
	});
	sourceVertex = sourceVertexParent.children.find(element => guidEquals(element.trasactorId, sourceTransactorReference));
	sourceVertexParent.children =
		sourceVertexParent.children.filter(element => !guidEquals(element.trasactorId, sourceTransactorReference))

	targetVertex = getTransactorPosition(psiContract, targetTransactorReference);

	targetVertex.children.push(sourceVertex);
}

function appendTransactorInbetweenInDiagram(psiContract: IPsiContract,
	sourceTransactorReference: Guid,
	targetTransactorReference: Guid,
	transactorFirst: Guid,
	transactorSecond: Guid): void {

	let sourceVertexParent: ITransactorPosition,
		sourceVertex: ITransactorPosition,
		targetVertex: ITransactorPosition;

	psiContract.diagrams.forEach(element => {
		if (isConstructionDiagram(element)) {
			let res: ITransactorPosition = findTransactorParentVertex(element.hiddenRoot, sourceTransactorReference);
			if (res) {
				sourceVertexParent = res;
				return;
			}
		}
	});
	sourceVertex = sourceVertexParent.children.find(element => guidEquals(element.trasactorId, sourceTransactorReference));
	sourceVertexParent.children =
		sourceVertexParent.children.filter(element => !guidEquals(element.trasactorId, sourceTransactorReference))

	targetVertex = getTransactorPosition(psiContract, targetTransactorReference);

	let position = targetVertex.children.findIndex(element => guidEquals(element.trasactorId, transactorFirst)) + 1;
	targetVertex.children.splice(position, 0, sourceVertex);
}



function findAndRemoveInvalidConnections(connections: IConnection[], referenceId: Guid) {
	connections =
		connections.filter(connection => !guidEquals(connection.to, referenceId) && !guidEquals(connection.from, referenceId));
}

function findAndRemoveInvalidConstraintLinks(transactor: ITransactor, referenceId: Guid) {
	transactor.inspectionLinks =
		transactor.inspectionLinks.filter(elem => !guidEquals(elem.inspectionTargetTransactor, referenceId));

	transactor.waitLinks =
		transactor.waitLinks.filter(elem => !guidEquals(elem.waitingForTransactor, referenceId));

	transactor.children.forEach(element => {
		findAndRemoveInvalidConstraintLinks(element, referenceId);
	});
}

