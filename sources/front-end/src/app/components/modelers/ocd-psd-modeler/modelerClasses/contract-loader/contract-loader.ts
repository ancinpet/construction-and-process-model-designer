import { mxgraph } from 'mxgraph';
import { ModelerConstants } from '../defines-constants';
import { Modeler } from '../modeler-initializator';
import { SynchronizationManager as Sync } from '../synchronization-manager';
import { Guid } from 'guid-typescript';
import * as Mdl from 'src/app/model';
import * as Utils from 'src/app/model/utils';
import { Point } from 'src/app/model';

const mx = require('mxgraph')({
    mxImageBasePath: '/assets/mxgraph/images',
    mxBasePath: '/assets/mxgraph'
});

export class ContractLoader {
    private _modeler: Modeler;
    public actionId: Guid;

    constructor(modeler: Modeler) {
        this._modeler = modeler;
        this.actionId = null;
    }

    public load(psiContract: Mdl.PsiContract): void {
        if (!this.actionId || !psiContract.versionId.equals(this.actionId)) {
            let allVertices = this.graph.getChildVertices(this.modeler.parent).filter((cell) => {return cell.value != "OCDROOT"});
            this.graph.removeCells(allVertices);
            this.loadProcesses(psiContract);
            this.loadConditionalLinks(psiContract);
            this.updateCounters(psiContract);
            this.actionId = null;
        }
    }

    private loadProcesses(psiContract: Mdl.PsiContract): void {
        let diagram = Utils.getConstructionDiagram(psiContract);
        for (let processGraphics of diagram.hiddenRoot.children) {
            let process = Utils.getProcess(psiContract, processGraphics.trasactorId);
            let processBox = this.modeler.cellFactory.createProcessBoxFrom(process.id, process.name);
            let vertex = this.modeler.insertRoleToGraphWithEdge(processBox, this.modeler.ocdRoot, ModelerConstants.STYLE_EDGE_PROCESS_TO_ANY);

            if (processGraphics.children.length == 1) {
                let rootTransactorGraphics = processGraphics.children[0];                
                let rootTransactor = Utils.getTransactor(psiContract, rootTransactorGraphics.trasactorId);
                if (Utils.isSelfActivatingTransactor(rootTransactor)) {
                    this.loadSelfTransactor(psiContract, rootTransactorGraphics, vertex);
                } else {
                    this.loadCompTransactor(psiContract, rootTransactorGraphics, vertex);
                }
            }
        }
    }

    private loadSelfTransactor(psiContract: Mdl.PsiContract, transactorGraphics: Mdl.TransactorPosition, previousCell: mxgraph.mxCell): void {
        let transactor = <Mdl.SelfActivatingTransactor>Utils.getTransactor(psiContract, transactorGraphics.trasactorId);
        let transaction = Utils.getTransactionKind(psiContract, transactor.transactionKind);
        let actor = Utils.getActorRole(psiContract, transactor.actorRole);
        let selfActivatingRole = this.modeler.cellFactory.createSelfActivatingRoleFrom([this.resolveTransactionType(transaction.transactionSort), this.resolveActorType(actor.type)],
        transaction.identificationNumber, actor.identificationNumber, transactor.id, actor.id, transaction.id, actor.name, transaction.name);
        let vertex = this.modeler.insertRoleToGraphWithEdge(selfActivatingRole, previousCell, ModelerConstants.STYLE_EDGE_PROCESS_TO_ANY);
        for (let child of transactorGraphics.children) {
            this.loadElemTransactor(psiContract, child, vertex);
        }
    }

    private loadCompTransactor(psiContract: Mdl.PsiContract, transactorGraphics: Mdl.TransactorPosition, previousCell: mxgraph.mxCell): void {
        let transactor = <Mdl.CompositeTransactor>Utils.getTransactor(psiContract, transactorGraphics.trasactorId);
        let actor = Utils.getActorRole(psiContract, transactor.actorRole);
        let compositeRole = this.modeler.cellFactory.createActorRoleFrom(this.resolveActorType(actor.type), transactor.id, actor.identificationNumber, actor.id, actor.name);
        let vertex = this.modeler.insertRoleToGraphWithEdge(compositeRole, previousCell, ModelerConstants.STYLE_EDGE_PROCESS_TO_ANY);
        for (let child of transactorGraphics.children) {
            this.loadElemTransactor(psiContract, child, vertex);
        }
    }

    private loadElemTransactor(psiContract: Mdl.PsiContract, transactorGraphics: Mdl.TransactorPosition, previousCell: mxgraph.mxCell): void {
        let transactor = <Mdl.ElementaryTransactor>Utils.getTransactor(psiContract, transactorGraphics.trasactorId);
        let transaction = Utils.getTransactionKind(psiContract, transactor.transactionKind);
        let actor = Utils.getActorRole(psiContract, transactor.actorRole);
        let elementaryRole = this.modeler.cellFactory.createElementaryRoleFrom([this.resolveTransactionType(transaction.transactionSort), this.resolveActorType(actor.type)],
        transaction.identificationNumber, actor.identificationNumber, transactor.id, actor.id, transaction.id, actor.name, transaction.name);
        let vertex = this.modeler.insertRoleToGraphWithEdge(elementaryRole, previousCell, "", transactor);
        for (let child of transactorGraphics.children) {
            this.loadElemTransactor(psiContract, child, vertex);
        }
    }

    private loadConditionalLinks(psiContract: Mdl.PsiContract): void {
        let diagram = Utils.getConstructionDiagram(psiContract);
        for (let condLinkGraphics of diagram.linkPositions) {
            let condLink = Utils.getConstraintLink(psiContract, condLinkGraphics.linkId);
            if (Utils.isWaitLink(condLink)) {
                this.loadWaitLink(psiContract, condLink, condLinkGraphics);
            } else if (Utils.isInspectionLink(condLink)) {
                this.loadInspectionLink(psiContract, condLink, condLinkGraphics);
            }
        }
    }

    private loadWaitLink(psiContract: Mdl.PsiContract, condLink: Mdl.WaitLink, condLinkGraphics: Mdl.LinkPosition): void {
        let source = Utils.getConstraintLinkTransactor(psiContract, condLink.id);
        let target = Utils.getTransactor(psiContract, condLink.waitingForTransactor);
        let sourceVertex = this.getGraphVertexSrc(source.id, condLinkGraphics.sourcePositionDown);
        let targetVertex = this.getGraphVertex(target.id);

        let edge = (<any>this.modeler.graph.connectionHandler).createEdge(null, sourceVertex, targetVertex, null, true, condLink.id, this.getCActs(condLink), condLinkGraphics);
        let insertedEdge = this.modeler.graph.addEdge(edge, this.modeler.parent, sourceVertex.parent, targetVertex);

        let style = insertedEdge.style;
        let geo = insertedEdge.geometry.clone();
        geo.points = this.getNewPoints(condLinkGraphics.lineBends);
        this.modeler.model.beginUpdate();
        try {
            this.modeler.model.setGeometry(insertedEdge, geo);
            this.modeler.model.setStyle(insertedEdge, style + ";");
            this.modeler.model.setStyle(insertedEdge, style);
        } finally {
            this.modeler.model.endUpdate();
        }
    }

    private loadInspectionLink(psiContract: Mdl.PsiContract, condLink: Mdl.InspectionLink, condLinkGraphics: Mdl.LinkPosition): void {
        let source = Utils.getConstraintLinkTransactor(psiContract, condLink.id);
        let target = Utils.getTransactor(psiContract, condLink.inspectionTargetTransactor);
        let sourceVertex = this.getGraphVertexSrc(source.id, condLinkGraphics.sourcePositionDown);
        let targetVertex = this.getGraphVertex(target.id);

        let edge = (<any>this.modeler.graph.connectionHandler).createEdge(null, sourceVertex, targetVertex, null, false, condLink.id, null, condLinkGraphics);
        let insertedEdge = this.modeler.graph.addEdge(edge, this.modeler.parent, sourceVertex.parent, targetVertex);

        let style = insertedEdge.style;
        let geo = insertedEdge.geometry.clone();
        geo.points = this.getNewPoints(condLinkGraphics.lineBends);
        this.modeler.model.beginUpdate();
        try {
            this.modeler.model.setGeometry(insertedEdge, geo);
            this.modeler.model.setStyle(insertedEdge, style + ";");
            this.modeler.model.setStyle(insertedEdge, style);
        } finally {
            this.modeler.model.endUpdate();
        }
    }

    private updateCounters(psiContract: Mdl.PsiContract): void {
        this.modeler.cellFactory.updateProcessCounter(Utils.getHighestProcessNumber(psiContract));
        this.modeler.cellFactory.updateTransactionCounter(Utils.getHighestTransactionNumber(psiContract));
        this.modeler.cellFactory.updateActorCounter(Utils.getHighestActorNumber(psiContract));
    }

    private resolveActorType(type: Mdl.ActorRoleType): string {
        if (type == Mdl.ActorRoleType.elementary) {
            return ModelerConstants.SOI_INTERNAL;
        } else {
            return ModelerConstants.SOI_EXTERNAL
        }
    }

    private resolveTransactionType(type: Mdl.TransactionSort): string {
        if (type == Mdl.TransactionSort.documental) {
            return ModelerConstants.ROLETYPE_DOCUMENTAL;
        } else if (type == Mdl.TransactionSort.informational) {
            return ModelerConstants.ROLETYPE_INFORMATIONAL;
        } else {
            return ModelerConstants.ROLETYPE_ORIGINAL;
        }
    }

    private getGraphVertex(id: Guid): mxgraph.mxCell {
        let allVertices = this.modeler.graph.getChildVertices(this.modeler.parent);

        return allVertices.find(cellTmp => {
            let transactorGuid;
            return cellTmp.value && cellTmp.value.tagName && (transactorGuid = cellTmp.value.getAttribute("guid")) && id.equals(Guid.parse(transactorGuid));
        });
    }

    private getGraphVertexSrc(id: Guid, bottom: boolean): mxgraph.mxCell {
        let allVertices = this.modeler.graph.getChildVertices(this.modeler.parent);
        let transactorVertex = allVertices.find(cellTmp => {
            let transactorGuid;
            return cellTmp.value && cellTmp.value.tagName && (transactorGuid = cellTmp.value.getAttribute("guid")) && id.equals(Guid.parse(transactorGuid));
        });

        for (let child of transactorVertex.children) {
            if (!bottom && child.value == "waitLinkNode") {
                return child;
            }

            if (bottom && child.value == "waitLinkNodeDown") {
                return child;
            }
        }
        
        return transactorVertex;
    }

    private getCActs(condLink: Mdl.WaitLink): [string, string] {
        return [this.parseCAct(condLink.sourceCAct), this.parseCAct(condLink.targetCAct)];
    }

    private parseCAct(act: Mdl.CAct): string {
        let res = ModelerConstants.LINK_ACT_REQUEST;
        switch (act) {
            case Mdl.CAct.request:
                res = ModelerConstants.LINK_ACT_REQUEST;
                break;
            case Mdl.CAct.promise:
                res = ModelerConstants.LINK_ACT_PROMISE;
                break;
            case Mdl.CAct.decline:
                res = ModelerConstants.LINK_ACT_DECLINE;
                break;
            case Mdl.CAct.quit:
                res = ModelerConstants.LINK_ACT_QUIT;
                break;
            case Mdl.CAct.state:
                res = ModelerConstants.LINK_ACT_STATE;
                break;
            case Mdl.CAct.accept:
                res = ModelerConstants.LINK_ACT_ACCEPT;
                break;
            case Mdl.CAct.reject:
                res = ModelerConstants.LINK_ACT_REJECT;
                break;
            case Mdl.CAct.stop:
                res = ModelerConstants.LINK_ACT_STOP;
                break;
            default:
                res = ModelerConstants.LINK_ACT_REQUEST;
                break;
        }

        return res;
    }

    private getNewPoints(newPoints: Array<Point>): Array<mxgraph.mxPoint> {
        let res = new Array<mxgraph.mxPoint>();
        for (let point of newPoints) {
            res.push(new mx.mxPoint(point.xPos, point.yPos));
        }

        return res;
    }

    get modeler() {
        return this._modeler;
    }

    get graph() {
        return this._modeler.graph;
    }
}