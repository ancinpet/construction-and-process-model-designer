import { PsiContractEditorState, ActionType, IAction } from "../state-manager.service";
import { PsiContract, IProcess, WaitLink, ILink, InspectionLink, Process, ActorRoleType, IConstructionDiagram, LinkPosition, Point, ConstructionDiagram, TransactorPosition, ITransactor, IElementaryTransactor, ISelfActivatingTransactor, IPsiContract, Diagram, IActionRule } from 'src/app/model';
import { Guid } from 'guid-typescript';
import * as ModelUtils from '../../../model/utils';
import { AddWaitLinkActionPayload, ChangeTransactorContentActionPayload, ChangeActorContentActionPayload, ChangeTransactionContentActionPayload, ChangeConstraintLinkActionPayload, SwapTransactorsActionPayload, AppendTransactorActionPayload, AppendTransactorAfterActionPayload, ChangeProcessContentActionPayload, AddCompositeTransactorActionPayload, AddSelfActivatingTransactorActionPayload, AddElementaryTransactorActionPayload, AddProcessActionPayload, ChangeModelNameActionPayload, ImportModelActionPayload, RemoveTransactionKindActionPayload as RemoveTransactionKindActionPayload, RemoveActorRoleActionPayload, RemoveConstraintLinkActionPayload, RemoveTransactorAction, RemoveTransactorActionPayload, RemoveProcessActionPayload } from '../actions';
import { ModelerConstants } from 'src/app/components/modelers/ocd-psd-modeler/modelerClasses/defines-constants';
import { AddBpmnDiagramActionPayload, RemoveBpmnDiagramActionPayload, UpdateBpmnDiagramActionPayload } from '../actions/bpmn-actions';
import { AddActionRulePayload, UpdateActionRulePayload, RemoveActionRulePayload } from '../actions/am-actions';

const LOCAL_STORAGE_KEY = "EnterpriseDesigner_AppStateKey";

 /**
   * initial state of the store
   * 
  */
export const intialState = new PsiContractEditorState(new PsiContract(Guid.create(), "", Guid.create()));

 /**
   * manage undo and redo stacks, updete versionId
   * @param actionId ID of the action becomes new version ID in the new state
   * @param newState 
   * @param oldState
  */
function manageHistory(newState: PsiContractEditorState, oldState: PsiContractEditorState, actionId: Guid) {
	newState.undoStack.push(oldState.psiContract);
	newState.redoStack = [];
	newState.psiContract.versionId = actionId;
}

/**
 * deep copy of a object
 * @param object object to be cloned
 */
export function clone<T>(object: T): T {
	return JSON.parse(JSON.stringify(object), ModelUtils.jsonGuidReviver);
}

/**
 * class wrapper for psi contract reducers (methods instead of functions)
 * abstract class used for force usage as static class
 */
export abstract class PsiContractEditorReducer{
	public static reducer(currentState: PsiContractEditorState = intialState, action: IAction): PsiContractEditorState {

		let newState: PsiContractEditorState =
			new PsiContractEditorState(clone<PsiContract>(currentState.psiContract), currentState.undoStack, currentState.redoStack);
	
		switch (action.type) {
			case ActionType.AddProcess:
			case ActionType.AddProcess_RECEIVED:
				{
					let payload = action.payload as AddProcessActionPayload;
					manageHistory(newState, currentState, payload.actionId);
					ModelUtils.addProcess(newState.psiContract, payload.process);
				}
				break;
	
			case ActionType.RemoveProcess:
			case ActionType.RemoveProcess_RECEIVED:
				{
					let payload = action.payload as RemoveProcessActionPayload;
					manageHistory(newState, currentState, payload.actionId);
					ModelUtils.removeProcess(newState.psiContract, payload.processId);
				}
				break;
	
			case ActionType.ChangeProcess:
			case ActionType.ChangeProcess_RECEIVED:
				{
					let payload = action.payload as ChangeProcessContentActionPayload;
					manageHistory(newState, currentState, payload.actionId);
					let process: IProcess = ModelUtils.getProcess(newState.psiContract, payload.id);
					if (payload.name != null && payload.name != undefined) {
						process.name = payload.name;
					}
	
				}
				break;
	
			case ActionType.AddCompositeTransactor:
			case ActionType.AddCompositeTransactor_RECEIVED:
				{
					let payload = action.payload as AddCompositeTransactorActionPayload;
					manageHistory(newState, currentState, payload.actionId);
					ModelUtils.addActorRole(newState.psiContract, payload.actor);
					ModelUtils.addTransactor(newState.psiContract, payload.transactor, payload.parent);
				}
				break;
	
			case ActionType.AddSelfActivatingTransactor:
			case ActionType.AddSelfActivatingTransactor_RECEIVED:
				{
					let payload = action.payload as AddSelfActivatingTransactorActionPayload;
					manageHistory(newState, currentState, payload.actionId);
					ModelUtils.addActorRole(newState.psiContract, payload.actor);
					ModelUtils.addTransactionKind(newState.psiContract, payload.transaction);
					ModelUtils.addTransactor(newState.psiContract, payload.transactor, payload.parent);
				}
				break;
	
			case ActionType.AddElementaryTransactor:
			case ActionType.AddElementaryTransactor_RECEIVED:
				{
					let payload = action.payload as AddElementaryTransactorActionPayload;
					manageHistory(newState, currentState, payload.actionId);
					ModelUtils.addActorRole(newState.psiContract, payload.actor);
					ModelUtils.addTransactionKind(newState.psiContract, payload.transaction);
					ModelUtils.addTransactor(newState.psiContract, payload.transactor, payload.parent);
				}
				break;
	
			case ActionType.RemoveTransactor:
			case ActionType.RemoveTransactor_RECEIVED:
				{
					let payload = action.payload as RemoveTransactorActionPayload;
					manageHistory(newState, currentState, payload.actionId);
					ModelUtils.removeTransactor(newState.psiContract, payload.transactorId);
				}
				break;
	
			case ActionType.AddWaitLink:
			case ActionType.AddWaitLink_RECEIVED:
				{
					let payload = action.payload as AddWaitLinkActionPayload;
					manageHistory(newState, currentState, payload.actionId);
					let transactor = ModelUtils.getTransactor(newState.psiContract, payload.linkSourceGuid);
					transactor.waitLinks.push(new WaitLink(payload.linkGuid, payload.sourceCAct, payload.targetCAct, payload.linkTargetGuid));
					let diagram: IConstructionDiagram = ModelUtils.getConstructionDiagram(newState.psiContract);
					let linkPosition = new LinkPosition(payload.linkGuid, payload.sourcePositionDown, payload.targetPositionDown);
					payload.graphicalPoints.map(touple => linkPosition.lineBends.push(new Point(touple[0], touple[1])));
					diagram.linkPositions.push(linkPosition);
					break;
				}
	
			case ActionType.ChangeTransactorContent:
			case ActionType.ChangeTransactorContent_RECEIVED:
				{
					let payload = action.payload as ChangeTransactorContentActionPayload;
					manageHistory(newState, currentState, payload.actionId);
					let transactor = ModelUtils.getTransactor(newState.psiContract, payload.transactorGuid);
					if (payload.actorGuid) {
						transactor.actorRole = payload.actorGuid;
					}
					if (
						(ModelUtils.isEelentaryTransactor(transactor) ||
							ModelUtils.isSelfActivatingTransactor(transactor)) &&
						payload.transactionGuid) {
						transactor.transactionKind = payload.transactionGuid
					}
					if (ModelUtils.isEelentaryTransactor(transactor) &&
						payload.sourceCAct !== null &&
						payload.sourceCAct !== undefined) {
						transactor.sourceCAct = payload.sourceCAct;
					}
					if (ModelUtils.isEelentaryTransactor(transactor) && payload.cardinalityMin) {
						transactor.cardinality.minCard = payload.cardinalityMin
					}
					if (ModelUtils.isEelentaryTransactor(transactor) && payload.cardinalityMax) {
						transactor.cardinality.maxCard = payload.cardinalityMax;
					}
				}
				break;
	
			case ActionType.ChangeActorContent:
			case ActionType.ChangeActorContent_RECEIVED:
				{
					let payload = action.payload as ChangeActorContentActionPayload;
					manageHistory(newState, currentState, payload.actionId);
					let actorRole = ModelUtils.getActorRole(newState.psiContract, payload.actorGuid);
					if (payload.name != null && payload.name != undefined) {
						actorRole.name = payload.name;
					}
					if (payload.roleType !== null && payload.roleType !== undefined) {
						actorRole.type = payload.roleType;
					}
				}
				break;
	
			case ActionType.ChangeTransactionContent:
			case ActionType.ChangeTransactionContent_RECEIVED:
				{
					let payload = action.payload as ChangeTransactionContentActionPayload;
					manageHistory(newState, currentState, payload.actionId);
					let transactionKind = ModelUtils.getTransactionKind(newState.psiContract, payload.transactionGuid);
					if (payload.name != null && payload.name != undefined) {
						transactionKind.name = payload.name;
					}
					if (payload.transactionSort !== null && payload.transactionSort !== undefined) {
						transactionKind.transactionSort = payload.transactionSort;
					}
				}
				break;
	
			case ActionType.ChangeConstraintLink:
			case ActionType.ChangeConstraintLink_RECEIVED:
				{
					let payload = action.payload as ChangeConstraintLinkActionPayload;
					manageHistory(newState, currentState, payload.actionId);
					let transactor = ModelUtils.getConstraintLinkTransactor(newState.psiContract, payload.linkGuid);
					let link: ILink = transactor.waitLinks.find(link => ModelUtils.guidEquals(link.id, payload.linkGuid));
					if (!link) {
						link = transactor.inspectionLinks.find(link => ModelUtils.guidEquals(link.id, payload.linkGuid));
					}
	
					if (ModelUtils.isWaitLink(link)) {
	
						if (payload.linkType && payload.linkType == ModelerConstants.LINKTYPE_INSPECTION) {
							transactor.waitLinks = transactor.waitLinks.filter(element => !ModelUtils.guidEquals(element.id, link.id));
							transactor.inspectionLinks.push(new InspectionLink(link.id, link.waitingForTransactor));
						}
						if (payload.sourceCAct != null && payload.sourceCAct != undefined) {
							link.sourceCAct = payload.sourceCAct;
						}
						if (payload.sourceCAct != null && payload.sourceCAct != undefined) {
							link.targetCAct = payload.targetCAct;
						}
					}
	
					if (ModelUtils.isInspectionLink(link)) {
						if (payload.linkType && payload.linkType == ModelerConstants.LINKTYPE_WAIT) {
							transactor.inspectionLinks = transactor.inspectionLinks.filter(element => !ModelUtils.guidEquals(element.id, link.id));
							transactor.waitLinks.push(new WaitLink(link.id, payload.sourceCAct, payload.targetCAct, link.inspectionTargetTransactor));
						}
					}
	
					let linkPosition =
						ModelUtils.getConstructionDiagram(newState.psiContract).linkPositions.find(element => ModelUtils.guidEquals(element.linkId, payload.linkGuid));
	
					if (payload.graphicalPoints) {
						linkPosition.lineBends = [];
						payload.graphicalPoints.map(touple => linkPosition.lineBends.push(new Point(touple[0], touple[1])));
					}
	
					if (payload.sourcePositionDown !== null && payload.sourcePositionDown !== undefined) {
						linkPosition.sourcePositionDown = payload.sourcePositionDown
					}
	
					if (payload.targetPositionDown !== null && payload.targetPositionDown !== undefined) {
						linkPosition.targetPositionDown = payload.targetPositionDown;
					}
				}
				break;
	
			case ActionType.RemoveConstraintLink:
			case ActionType.RemoveConstraintLink_RECEIVED:
				{
					let payload = action.payload as RemoveConstraintLinkActionPayload;
					manageHistory(newState, currentState, payload.actionId);
					let transactor = ModelUtils.getConstraintLinkTransactor(newState.psiContract, payload.linkId);
					transactor.inspectionLinks =
						transactor.inspectionLinks.filter(element => !ModelUtils.guidEquals(element.id, payload.linkId));
					transactor.waitLinks =
						transactor.waitLinks.filter(element => !ModelUtils.guidEquals(element.id, payload.linkId));
					let diagram: IConstructionDiagram = ModelUtils.getConstructionDiagram(newState.psiContract);
					diagram.linkPositions = diagram.linkPositions.filter(link => !ModelUtils.guidEquals(link.linkId, payload.linkId));
				}
				break;
	
			case ActionType.SwapVertices:
			case ActionType.SwapVertices_RECEIVED:
				{
					let payload = action.payload as SwapTransactorsActionPayload;
					manageHistory(newState, currentState, payload.actionId);
					ModelUtils.swapTransactors(newState.psiContract, payload.sourceGuid, payload.targetGuid);
				}
				break;
	
			case ActionType.AppendTransactor:
			case ActionType.AppendTransactor_RECEIVED:
				{
					let payload = action.payload as AppendTransactorActionPayload;
					manageHistory(newState, currentState, payload.actionId);
					ModelUtils.appendTransactor(newState.psiContract, payload.sourceGuid, payload.targetGuid);
				}
	
				break;
	
			case ActionType.AppendTransactorAfter:
			case ActionType.AppendTransactorAfter_RECEIVED:
				{
					let payload = action.payload as AppendTransactorAfterActionPayload;
					manageHistory(newState, currentState, payload.actionId);
					ModelUtils.appendTransactorInbetween(newState.psiContract, payload.sourceGuid,
						payload.targetGuid, payload.transactorFirstGuid, payload.transactorSecondGuid);
	
				}
				break;
	
			case ActionType.RemoveActorRole:
			case ActionType.RemoveActorRole_RECEIVED:
				{
					let payload = action.payload as RemoveActorRoleActionPayload;
					manageHistory(newState, currentState, payload.actionId);
					if (!ModelUtils.actorRoleIsReferenced(newState.psiContract, payload.actorRoleId)) {
						ModelUtils.removeActorRole(newState.psiContract, payload.actorRoleId);
					}
				}
				break;
	
			case ActionType.RemoveTransactionKind:
			case ActionType.RemoveTransactionKind_RECEIVED:
				{
					let payload = action.payload as RemoveTransactionKindActionPayload;
					manageHistory(newState, currentState, payload.actionId);
					if (!ModelUtils.transactionKindIsReferenced(newState.psiContract, payload.transactionKindId)) {
						ModelUtils.removeTransactionKind(newState.psiContract, payload.transactionKindId);
					}
				}
				break;
	
			case ActionType.AddBpmnDiagram:
			case ActionType.AddBpmnDiagram_RECEIVED:
				{
					let payload = action.payload as AddBpmnDiagramActionPayload;
					manageHistory(newState, currentState, payload.actionId);
					ModelUtils.getProcess(newState.psiContract, payload.processId)
						.bpmnDiagrams.push(payload.diagram);
				}
				break;
	
			case ActionType.RemoveBpmnDiagram:
			case ActionType.RemoveBpmnDiagram_RECEIVED:
				{
					let payload = action.payload as RemoveBpmnDiagramActionPayload;
					manageHistory(newState, currentState, payload.actionId);
					let process = ModelUtils.getProcess(newState.psiContract, payload.processId);
					process.bpmnDiagrams =
						process.bpmnDiagrams.filter(bpmn => ModelUtils.parseBpmnIdFromXml(bpmn) != payload.diagramId);
				}
				break;
	
			case ActionType.UpdateBpmnDiagram:
			case ActionType.UpdateBpmnDiagram_RECEIVED:
				{
					let payload = action.payload as UpdateBpmnDiagramActionPayload;
					manageHistory(newState, currentState, payload.actionId);
					let process = ModelUtils.getProcess(newState.psiContract, payload.processId);
					process.bpmnDiagrams =
						process.bpmnDiagrams.filter(bpmn => ModelUtils.parseBpmnIdFromXml(bpmn) != payload.diagramId);
					process.bpmnDiagrams.push(payload.diagram);
				}
				break;
	
			case ActionType.SaveModel:
				{
					window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(currentState.psiContract));
				}
				break;
	
			case ActionType.LoadModel:
				{
					let loadedData = JSON.parse(window.localStorage.getItem(LOCAL_STORAGE_KEY), ModelUtils.jsonGuidReviver);
					newState = new PsiContractEditorState(loadedData);
				}
				break;
	
			case ActionType.ImportModel:
			case ActionType.ImportModel_RECEIVED:
				{
					let payload = action.payload as ImportModelActionPayload;
					newState = new PsiContractEditorState(payload.psiContract);
				}
				break;
	
			case ActionType.ChangeModelName:
			case ActionType.ChangeModelName_RECEIVED:
				{
					let payload = action.payload as ChangeModelNameActionPayload;
					manageHistory(newState, currentState, payload.actionId);
					newState.psiContract.name = payload.changedName;
				}
				break;
	
			case ActionType.UndoChange:
			case ActionType.UndoChange_RECEIVED:
				if (newState.undoStack.length > 0) {
					newState.redoStack.push(newState.psiContract)
					newState.psiContract = newState.undoStack.pop();
				}
				break;
	
			case ActionType.RedoChange:
			case ActionType.RedoChange_RECEIVED:
				if (newState.redoStack.length > 0) {
					newState.undoStack.push(newState.psiContract)
					newState.psiContract = newState.redoStack.pop();
				}
				break;
	
			case ActionType.NewModel:
			case ActionType.NewModel_RECEIVED:
				{
					newState = intialState;
				}
                break;
            case ActionType.AddActionRule:
            case ActionType.AddActionRule_RECIEVED:
                {
                    let payload = action.payload as AddActionRulePayload;
                    manageHistory(newState, currentState, payload.actionId);
                    ModelUtils.addActionRule(newState.psiContract, payload.actionRule);
                }
                break;
            case ActionType.UpdateActionRule:
            case ActionType.UpdateActionRule_RECIEVED:
                {
                    let payload = action.payload as UpdateActionRulePayload;
                    manageHistory(newState, currentState, payload.actionId);
                    let actionRule: IActionRule = ModelUtils.getActionRule(newState.psiContract, payload.actionRule.id);
                    if (payload.actionRule.ruleFormulation != null && payload.actionRule.ruleFormulation != undefined) {
                        actionRule.ruleFormulation = payload.actionRule.ruleFormulation;
                    }
                }
                break;
            case ActionType.RemoveActionRule:
            case ActionType.RemoveActionRule_RECIEVED:
                {
                    let payload = action.payload as RemoveActionRulePayload;
                    manageHistory(newState, currentState, payload.actionId);
                    ModelUtils.removeActionRule(newState.psiContract, payload.ruleId);
                }
                break;
			default:
				newState = currentState;
		}
		return newState;
	}
}
