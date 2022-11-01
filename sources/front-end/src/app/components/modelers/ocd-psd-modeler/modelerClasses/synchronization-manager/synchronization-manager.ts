import * as OCDA from '../../../../../services/state-management/actions'
import { Guid } from 'guid-typescript';
import { Modeler } from '../modeler-initializator';

export class SynchronizationManager {
    static _modeler: Modeler;

    static sendAddProcess(_id: Guid, _name: string) {
        let process = new OCDA.AddProcessAction(_id, _name);
        this.modeler.contractLoader.actionId = process.actionId;
        this.modeler.stateManager.dispatchAction(process);
    }

    static sendRemoveProcess(_id: Guid) {
        let process = new OCDA.RemoveProcessAction(_id);
        this.modeler.contractLoader.actionId = process.actionId;
        this.modeler.stateManager.dispatchAction(process);
    }

    static sendChangeProcess(_id: Guid, _name?: string) {
        let process = new OCDA.ChangeProcessContentAction(_id, _name);
        this.modeler.contractLoader.actionId = process.actionId;
        this.modeler.stateManager.dispatchAction(process);
    }

    static sendAddCompositeTransactor(_tid: Guid, _aid: Guid, _phase: string, _actorId: number, _name: string, _parent: Guid, _isRoot: boolean) {
        let transactor = new OCDA.AddCompositeTransactorAction(_tid, _aid, _phase, _actorId, _name, _parent);
        this.modeler.contractLoader.actionId = transactor.actionId;
        this.modeler.stateManager.dispatchAction(transactor);
    }

    static sendAddSelfActivatingTransactor(_tid: Guid, _aid: Guid, _tnid: Guid, _transactionId: number, _transactionSort: string, _transactionName: string, _phase: string, _actorId: number, _name: string, _parent: Guid, _isRoot: boolean) {
        let transactor = new OCDA.AddSelfActivatingTransactorAction(_tid, _aid, _tnid, _transactionId, _transactionSort, _transactionName, _phase, _actorId, _name, _parent);
        this.modeler.contractLoader.actionId = transactor.actionId;
        this.modeler.stateManager.dispatchAction(transactor);
    }

    static sendAddElementaryTransactor(_tid: Guid, _aid: Guid, _tnid: Guid, _transactionId: number, _transactionSort: string, _transactionName: string, _phase: string, _actorId: number, _name: string, _parent: Guid, _isRoot: boolean) {
        let transactor = new OCDA.AddElementaryTransactorAction(_tid, _aid, _tnid, _transactionId, _transactionSort, _transactionName, _phase, _actorId, _name, _parent);
        this.modeler.contractLoader.actionId = transactor.actionId;
        this.modeler.stateManager.dispatchAction(transactor);
    }

    static sendAddWaitLink(_lid: string, _lsid: string, _ltid: string, _isDown: boolean, _graphicalPoints: Array<[number, number]>) {
        let waitlink = new OCDA.AddWaitLinkAction(Guid.parse(_lid), Guid.parse(_lsid), Guid.parse(_ltid), _isDown, _isDown, _graphicalPoints);
        this.modeler.contractLoader.actionId = waitlink.actionId;
        this.modeler.stateManager.dispatchAction(waitlink);
    }

    static sendRemoveLink(_lid: string) {
        let waitlink = new OCDA.RemoveConstraintLinkAction(Guid.parse(_lid));
        this.modeler.contractLoader.actionId = waitlink.actionId;
        this.modeler.stateManager.dispatchAction(waitlink);
    }

    static sendRemoveTransactor(_tid: string) {
        let transactor = new OCDA.RemoveTransactorAction(Guid.parse(_tid));
        this.modeler.contractLoader.actionId = transactor.actionId;
        this.modeler.stateManager.dispatchAction(transactor);
    }

    static sendChangeTransactor(_tid: string, _aid?: string, _tnid?: string, _cardinalityMin?: string, _cardinalityMax?: string, _sourceCAct?: string) {
        let transactor = new OCDA.ChangeTransactorContentAction(Guid.parse(_tid), _aid ? Guid.parse(_aid) : null, _tnid ? Guid.parse(_tnid) : null, _cardinalityMin, _cardinalityMax, _sourceCAct);
        this.modeler.contractLoader.actionId = transactor.actionId;
        this.modeler.stateManager.dispatchAction(transactor);
    }

    static sendChangeActor(_aid: string, _name?: string, _roleType?: string) {
        let actor = new OCDA.ChangeActorContentAction(Guid.parse(_aid), _name, _roleType);
        this.modeler.contractLoader.actionId = actor.actionId;
        this.modeler.stateManager.dispatchAction(actor);
    }

    static sendChangeTransaction(_tnid: string, _name?: string, _transactionSort?: string) {
        let transaction = new OCDA.ChangeTransactionContentAction(Guid.parse(_tnid), _name, _transactionSort);
        this.modeler.contractLoader.actionId = transaction.actionId;
        this.modeler.stateManager.dispatchAction(transaction);
    }

    static sendChangeWaitLink(_lid: string, _linkType: string, _sCAct: string, _tCAct: string, _sIsDown: boolean, _tIsDown: boolean, _graphicalPoints: Array<[number, number]>) {
        let waitlink = new OCDA.ChangeConstraintLinkAction(Guid.parse(_lid), _linkType, _sCAct, _tCAct, _sIsDown, _tIsDown, _graphicalPoints);
        this.modeler.contractLoader.actionId = waitlink.actionId;
        this.modeler.stateManager.dispatchAction(waitlink);
    }

    static sendSwapVertices(_sid: string, _tid: string) {
        let swapChange = new OCDA.SwapTransactorsAction(Guid.parse(_sid), Guid.parse(_tid));
        this.modeler.contractLoader.actionId = swapChange.actionId;
        this.modeler.stateManager.dispatchAction(swapChange);
    }

    static sendAppendTransactor(_sid: string, _tid: string) {
        let appendChange = new OCDA.AppendTransactorAction(Guid.parse(_sid), Guid.parse(_tid));
        this.modeler.contractLoader.actionId = appendChange.actionId;
        this.modeler.stateManager.dispatchAction(appendChange);
    }

    static sendAppendTransactorAfter(_sid: string, _tid: string, _tnfid: string, _tnsid: string) {
        let appendChange = new OCDA.AppendTransactorAfterAction(Guid.parse(_sid), Guid.parse(_tid), Guid.parse(_tnfid), Guid.parse(_tnsid));
        this.modeler.contractLoader.actionId = appendChange.actionId;
        this.modeler.stateManager.dispatchAction(appendChange);
    }

    static set modeler(modeler: Modeler) {
        this._modeler = modeler;
    }

    static get modeler(): Modeler {
        return this._modeler;
    }
}