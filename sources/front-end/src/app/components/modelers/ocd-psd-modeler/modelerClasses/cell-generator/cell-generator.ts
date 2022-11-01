import { ModelerConstants } from '../defines-constants';
import { SynchronizationManager as Sync } from '../synchronization-manager';
import { Guid } from 'guid-typescript';
import * as Mdl from 'src/app/model';

const svgElementaryRole = "PHN2ZyB3aWR0aD0iMTMwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczpzdmc9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4NCiAgPHJlY3QgZmlsbD0ie3JlY3RhbmdsZUZpbGx9IiB4PSIzMiIgeT0iMCIgd2lkdGg9Ijk3LjUiIGhlaWdodD0iMTAwJSIgc3Ryb2tlPSIjMDAwMDAwIi8+DQogIDxjaXJjbGUgZmlsbD0iI2ZmZmZmZiIgc3Ryb2tlPSIjMDAwMDAwIiBjeD0iMzIiIGN5PSI1MCUiIHI9IjMwIi8+DQogIDxyZWN0IHRyYW5zZm9ybT0icm90YXRlKDQ1LCAzMS41LCA1MCkiIHg9IjExLjUiIHk9IjMwIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHN0cm9rZT0ie2RpYW1vbmRTdHJva2V9IiBmaWxsPSJ7ZGlhbW9uZEZpbGx9Ii8+DQogIDx0ZXh0IHk9IjU3IiB4PSIzMiIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9InNlcmlmIiBmb250LXNpemU9IjI0IiBmaWxsPSIjZmZmZmZmIj57dHJhbnNhY3Rpb25OdW1iZXJ9PC90ZXh0Pg0KPC9zdmc+";
const defaultElementaryRoleWidth = 130;
const defaultElementaryRoleHeight = 100;

const svgSelfActivatingRole = "PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczpzdmc9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4NCiAgPHJlY3Qgc3Ryb2tlPSIjMDAwMDAwIiBoZWlnaHQ9IjEwMCUiIHdpZHRoPSIxMDAiIHk9IjAiIHg9IjAiIGZpbGw9IntyZWN0YW5nbGVGaWxsfSIvPg0KICA8Y2lyY2xlIHI9IjMwIiBjeT0iNTAlIiBjeD0iNTAiIHN0cm9rZT0iIzAwMDAwMCIgZmlsbD0iI2ZmZmZmZiIvPg0KICA8cmVjdCB0cmFuc2Zvcm09InJvdGF0ZSg0NSwgNTAsIDUwKSIgeT0iMzAiIHg9IjMwIiBoZWlnaHQ9IjQwIiB3aWR0aD0iNDAiIGZpbGw9IntkaWFtb25kRmlsbH0iIHN0cm9rZT0ie2RpYW1vbmRTdHJva2V9Ii8+DQogIDx0ZXh0IHg9IjUwIiB5PSI1NyIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iI2ZmZmZmZiIgc3Ryb2tlLXdpZHRoPSIwIiBmb250LXNpemU9IjI0IiBmb250LWZhbWlseT0ic2VyaWYiIHhtbDpzcGFjZT0icHJlc2VydmUiPnt0cmFuc2FjdGlvbk51bWJlcn08L3RleHQ+DQo8L3N2Zz4=";
const defaultSelfActivatingRoleWidth = 100;
const defaultSelfActivatingRoleHeight = 100;

const svgProcessBox = "PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczpzdmc9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4NCiA8Zz4NCiA8L2c+DQo8L3N2Zz4=";
const defaultProcessBoxWidth = 100;
const defaultProcessBoxHeight = 100;

const svgActorRole = "PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczpzdmc9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4NCiA8Zz4NCiAgPHJlY3Qgc3Ryb2tlPSIjMDAwMDAwIiBoZWlnaHQ9IjEwMCUiIHdpZHRoPSIxMDAiIHk9IjAiIHg9IjAiIGZpbGw9IntyZWN0YW5nbGVGaWxsfSIvPg0KIDwvZz4NCjwvc3ZnPg==";
const defaultActorRoleWidth = 100;
const defaultActorRoleHeight = 100;

const svgWaitLinkNode = "PHN2ZyB3aWR0aD0iMzAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6c3ZnPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiA8Zz4KICA8cGF0aCBkPSJtMS4wNTg1MzUsMTQuMTE4MDA4bDEzLjkzNzU5NSwtMTMuMjU0Nzk1bDEzLjkzNzU5NSwxMy4yNTQ3OTVsLTI3Ljg3NTE4OSwweiIgZmlsbD0iIzllYzdmZiIvPgogPC9nPgo8L3N2Zz4=";
const svgWaitLinkNodeDown = "PHN2ZyB3aWR0aD0iMzAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6c3ZnPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiA8Zz4KICA8ZyB0cmFuc2Zvcm09InJvdGF0ZSgxODAgMTQuOTk2MTM0NzU3OTk1NjA1LDcuNDkwNjEwMTIyNjgwNjY0KSB0cmFuc2xhdGUoMCAtNSkiPgogICA8cGF0aCBmaWxsPSIjOWVjN2ZmIiBkPSJtMS4wNTg1NCwxNC4xMTgwMWwxMy45Mzc1OSwtMTMuMjU0OGwxMy45Mzc2LDEzLjI1NDhsLTI3Ljg3NTE5LDB6Ii8+CiAgPC9nPgogPC9nPgo8L3N2Zz4=";
const defaultWaitLinkNodeWidth = 30;
const defaultWaitLinkNodeHeight = 20;

const svgActorLabel = "PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjIwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnN2Zz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L3N2Zz4=";
const defaultActorLabelWidth = 100;
const defaultActorLabelHeight = 20;





class RoleType {
    stringRepresentation: string;
    colorRepresentation: string;

    private constructor(stringRepresentation: string, colorRepresentation: string) {
        this.stringRepresentation = stringRepresentation;
        this.colorRepresentation = colorRepresentation;
    }

    public static Original = new RoleType("original", "#c21807");
    public static Informational = new RoleType("informational", "#0b6623");
    public static Documental = new RoleType("documental", "#1134a6");

    public getColor(): string {
        return this.colorRepresentation;
    }

    public getString(): string {
        return this.stringRepresentation;
    }
}

class RolePhase {
    stringRepresentation: string;
    colorRepresentation: string;

    private constructor(stringRepresentation: string, colorRepresentation: string) {
        this.stringRepresentation = stringRepresentation;
        this.colorRepresentation = colorRepresentation;
    }

    public static Internal = new RolePhase("internal", "#ffffff");
    public static External = new RolePhase("external", "#d1d1d1");

    public getColor(): string {
        return this.colorRepresentation;
    }

    public getString(): string {
        return this.stringRepresentation;
    }
}

export class CellFactory {
    private _roleManager: RoleManager;
    private _processManager: ProcessManager;
    private _actorManager: ActorManager;
    private _xmlDocument: XMLDocument;

    constructor(xmlDocument: XMLDocument) {
        this._roleManager = new RoleManager();
        this._actorManager = new ActorManager();
        this._processManager = new ProcessManager();
		this._xmlDocument = xmlDocument;
    }

    public updateProcessCounter(value: number): void {
        this._processManager.processId = value;
    }

    public updateTransactionCounter(value: number): void {
        this._roleManager.transactionNumber = value;
    }

    public updateActorCounter(value: number): void {
        this._roleManager.actorNumber = value;
    }

    public createActorRole(rolePhase: string, _parent: Guid, _isRoot: boolean): ActorRole {
        this._roleManager.registerActor();

		let phase = this.resolvePhase(rolePhase);
		let style = this.createStyleActor(rolePhase);

        let node = this._xmlDocument.createElement(ModelerConstants.ACTOR_ROLE_NAME);
        let transactorGuid = Guid.create();
        let actorGuid = Guid.create();
        let actorLabel = "A-" + this._roleManager.actorNumber.toString();

        node.setAttribute("label", actorLabel);
        node.setAttribute("actorNumber", this._roleManager.actorNumber.toString());
        node.setAttribute("rolePhase", phase.getString());
        node.setAttribute("guid", transactorGuid.toString());
        node.setAttribute("actorGuid", actorGuid.toString());

        Sync.sendAddCompositeTransactor(transactorGuid, actorGuid, phase.getString(), this._roleManager.actorNumber, actorLabel, _parent, _isRoot);

        return new ActorRole(style, node);
    }

    public createActorRoleFrom(rolePhase: string, transactorGuid: Guid, actorNumber: number, actorGuid: Guid, actorLabel: string): ActorRole {
		let phase = this.resolvePhase(rolePhase);
		let style = this.createStyleActor(rolePhase);

        let node = this._xmlDocument.createElement(ModelerConstants.ACTOR_ROLE_NAME);

        node.setAttribute("label", actorLabel);
        node.setAttribute("actorNumber", actorNumber.toString());
        node.setAttribute("rolePhase", phase.getString());
        node.setAttribute("guid", transactorGuid.toString());
        node.setAttribute("actorGuid", actorGuid.toString());

        return new ActorRole(style, node);
    }

    public getDefaultEdgeNode(transactorData?: Mdl.ElementaryTransactor) {
        let node = this._xmlDocument.createElement(ModelerConstants.LINKTYPE_DEFAULT);

        if (transactorData) {
            let minCard = transactorData.cardinality.minCard;
            let maxCard = transactorData.cardinality.maxCard;
            let [cAct, cActLabel] = this.parseCAct(transactorData.sourceCAct);

            if (minCard == "1" && maxCard == "1") {
                node.setAttribute("label", "\n\n" + cActLabel + ModelerConstants.DEFAULT_LINK_ACT_PAD);
            } else {
                node.setAttribute("label", minCard + " .. " + maxCard + "\n\n" + cActLabel + ModelerConstants.DEFAULT_LINK_ACT_PAD);
            }
            node.setAttribute("cardinalityAct", cAct);
            node.setAttribute("cardinalityFrom", minCard);
            node.setAttribute("cardinalityTo", maxCard);
        } else {
            node.setAttribute("label", "\n\n" + ModelerConstants.LINK_ACT_PROMISE_S + ModelerConstants.DEFAULT_LINK_ACT_PAD);
            node.setAttribute("cardinalityAct", ModelerConstants.LINK_ACT_PROMISE);
            node.setAttribute("cardinalityFrom", "1");
            node.setAttribute("cardinalityTo", "1");
        }

        return node;
    }

    public getDefaultActorEdgeNode(transactorData?: Mdl.ElementaryTransactor) {
        let node = this._xmlDocument.createElement(ModelerConstants.LINKTYPE_DEFAULT);

        if (transactorData) {
            let minCard = transactorData.cardinality.minCard;
            let maxCard = transactorData.cardinality.maxCard;

            if (minCard == "1" && maxCard == "1") {
                node.setAttribute("label", "");
            } else {
                node.setAttribute("label", minCard + " .. " + maxCard);
            }

            node.setAttribute("cardinalityAct", "hidden");
            node.setAttribute("cardinalityFrom", minCard);
            node.setAttribute("cardinalityTo", maxCard);
        } else {
            node.setAttribute("label", "");
            node.setAttribute("cardinalityAct", "hidden");
            node.setAttribute("cardinalityFrom", "1");
            node.setAttribute("cardinalityTo", "1");
        }

        return node;
    }

    public createElementaryRole([roleType, rolePhase]: [string, string], _parent: Guid, _isRoot: boolean): ElementaryRole {	
        this._roleManager.registerRole();	
        this._roleManager.registerActor();

        let type = this.resolveType(roleType);
        let phase = this.resolvePhase(rolePhase);
		let style = this.createStyleElementary([roleType, rolePhase], this._roleManager.transactionNumber);

        let node = this._xmlDocument.createElement(ModelerConstants.ELEMENTARY_ROLE_NAME);
        let transactorGuid = Guid.create();
        let actorGuid = Guid.create();
        let transactionGuid = Guid.create();
        let actorLabel = "A-" + this._roleManager.actorNumber.toString();
        let transactorLabel = "T-" + this._roleManager.transactionNumber.toString();

        node.setAttribute("label", transactorLabel);
        node.setAttribute("actorLabel", actorLabel);
        node.setAttribute("transactionNumber", this._roleManager.transactionNumber.toString());
        node.setAttribute("actorNumber", this._roleManager.actorNumber.toString());
        node.setAttribute("roleType", type.getString());
        node.setAttribute("rolePhase", phase.getString());
        node.setAttribute("guid", transactorGuid.toString());
        node.setAttribute("actorGuid", actorGuid.toString());
        node.setAttribute("transactionGuid", transactionGuid.toString());

        Sync.sendAddElementaryTransactor(transactorGuid, actorGuid, transactionGuid, this._roleManager.transactionNumber, type.getString(), transactorLabel, phase.getString(), this._roleManager.actorNumber, actorLabel, _parent, _isRoot);

        return new ElementaryRole(style, node);
    }

    public createElementaryRoleFrom([roleType, rolePhase]: [string, string], transactionNumber: number, actorNumber: number, transactorGuid: Guid, actorGuid: Guid,
                                    transactionGuid: Guid, actorLabel: string, transactorLabel: string): ElementaryRole {	

        let type = this.resolveType(roleType);
        let phase = this.resolvePhase(rolePhase);
		let style = this.createStyleElementary([roleType, rolePhase], transactionNumber);

        let node = this._xmlDocument.createElement(ModelerConstants.ELEMENTARY_ROLE_NAME);

        node.setAttribute("label", transactorLabel);
        node.setAttribute("actorLabel", actorLabel);
        node.setAttribute("transactionNumber", transactionNumber.toString());
        node.setAttribute("actorNumber", actorNumber.toString());
        node.setAttribute("roleType", type.getString());
        node.setAttribute("rolePhase", phase.getString());
        node.setAttribute("guid", transactorGuid.toString());
        node.setAttribute("actorGuid", actorGuid.toString());
        node.setAttribute("transactionGuid", transactionGuid.toString());

        return new ElementaryRole(style, node);
    }

    public createSelfActivatingRole([roleType, rolePhase]: [string, string], _parent: Guid, _isRoot: boolean): SelfActivatingRole {
        this._roleManager.registerRole();
        this._roleManager.registerActor();

        let type = this.resolveType(roleType);
        let phase = this.resolvePhase(rolePhase);
		let style = this.createStyleSelfActivating([roleType, rolePhase], this._roleManager.transactionNumber);

        let node = this._xmlDocument.createElement(ModelerConstants.SELF_ACTIVATING_ROLE_NAME);
        let transactorGuid = Guid.create();
        let actorGuid = Guid.create();
        let transactionGuid = Guid.create();
        let actorLabel = "A-" + this._roleManager.actorNumber.toString();
        let transactorLabel = "T-" + this._roleManager.transactionNumber.toString();

        node.setAttribute("label", transactorLabel);
        node.setAttribute("actorLabel", actorLabel);
        node.setAttribute("transactionNumber", this._roleManager.transactionNumber.toString());
        node.setAttribute("actorNumber", this._roleManager.actorNumber.toString());
        node.setAttribute("roleType", type.getString());
        node.setAttribute("rolePhase", phase.getString());
        node.setAttribute("guid", transactorGuid.toString());
        node.setAttribute("actorGuid", actorGuid.toString());
        node.setAttribute("transactionGuid", transactionGuid.toString());

        Sync.sendAddSelfActivatingTransactor(transactorGuid, actorGuid, transactionGuid, this._roleManager.transactionNumber, type.getString(), transactorLabel, phase.getString(), this._roleManager.actorNumber, actorLabel, _parent, _isRoot);

        return new SelfActivatingRole(style, node);
    }

    public createSelfActivatingRoleFrom([roleType, rolePhase]: [string, string], transactionNumber: number, actorNumber: number, transactorGuid: Guid, actorGuid: Guid,
        transactionGuid: Guid, actorLabel: string, transactorLabel: string): SelfActivatingRole {
        let type = this.resolveType(roleType);
        let phase = this.resolvePhase(rolePhase);
		let style = this.createStyleSelfActivating([roleType, rolePhase], transactionNumber);

        let node = this._xmlDocument.createElement(ModelerConstants.SELF_ACTIVATING_ROLE_NAME);

        node.setAttribute("label", transactorLabel);
        node.setAttribute("actorLabel", actorLabel);
        node.setAttribute("transactionNumber", transactionNumber.toString());
        node.setAttribute("actorNumber", actorNumber.toString());
        node.setAttribute("roleType", type.getString());
        node.setAttribute("rolePhase", phase.getString());
        node.setAttribute("guid", transactorGuid.toString());
        node.setAttribute("actorGuid", actorGuid.toString());
        node.setAttribute("transactionGuid", transactionGuid.toString());

        return new SelfActivatingRole(style, node);
    }

    public createProcessBox(): ProcessBox {
        this._processManager.registerProcess();

        let style = this._processManager.generateStyle(svgProcessBox);

        let node = this._xmlDocument.createElement(ModelerConstants.PROCESS_NAME);
        let label = "Process #" + this._processManager.processId.toString();
        let guid = Guid.create();

        node.setAttribute("label", label);
        node.setAttribute("guid", guid.toString());

        Sync.sendAddProcess(guid, label);

        return new ProcessBox(style, node);
    }

    public createProcessBoxFrom(guid: Guid, label: string): ProcessBox {
        let style = this._processManager.generateStyle(svgProcessBox);
        let node = this._xmlDocument.createElement(ModelerConstants.PROCESS_NAME);

        node.setAttribute("label", label);
        node.setAttribute("guid", guid.toString());

        return new ProcessBox(style, node);
    }

    public createStyleActor(rolePhase: string): string {
        let phase = this.resolvePhase(rolePhase);
        
		return this._actorManager.generateStyle(phase, svgActorRole);
    }

    public createStyleElementary([roleType, rolePhase]: [string, string], transactionNumber: number): string {
        let type = this.resolveType(roleType);
        let phase = this.resolvePhase(rolePhase);
        return "labelWidth=65;" + this._roleManager.generateStyle([type, phase], transactionNumber, svgElementaryRole);
    }

    public createStyleSelfActivating([roleType, rolePhase]: [string, string], transactionNumber: number): string {
        let type = this.resolveType(roleType);
        let phase = this.resolvePhase(rolePhase);
        return this._roleManager.generateStyle([type, phase], transactionNumber, svgSelfActivatingRole);
    }

    public createWaitLinkNode(): WaitLinkNode {
        let style = this._processManager.generateStyle(svgWaitLinkNode);
        let id = "waitLinkNode";

        return new WaitLinkNode(style, id);
    }

    public createWaitLinkNodeDown(): WaitLinkNode {
        let style = this._processManager.generateStyle(svgWaitLinkNodeDown);
        let id = "waitLinkNodeDown";

        return new WaitLinkNode(style, id);
    }

    public createActorLabel(label: string): ActorLabel {
        let style = this._processManager.generateStyle(svgActorLabel);

        let node = this._xmlDocument.createElement(ModelerConstants.ACTOR_LABEL_NAME);

        node.setAttribute("label", label);

        return new ActorLabel(style, node);
    }

    private resolveType(type: string): RoleType {
        let roleType = RoleType.Original;

        switch (type) {
            case "original":
                roleType = RoleType.Original;
                break;
            case "informational":
                roleType = RoleType.Informational;
                break;
            case "documental":
                roleType = RoleType.Documental;
                break;
        }

        return roleType;
    }

    private resolvePhase(phase: string): RolePhase {
        let rolePhase = RolePhase.Internal;

        switch (phase) {
            case "internal":
                rolePhase = RolePhase.Internal;
                break;
            case "external":
                rolePhase = RolePhase.External;
                break;
        }

        return rolePhase;
    }
    
    private parseCAct(act: Mdl.CAct): [string, string] {
        switch (act) {
            case Mdl.CAct.request:
                return [ModelerConstants.LINK_ACT_REQUEST, ModelerConstants.LINK_ACT_REQUEST_S];
            case Mdl.CAct.promise:
                return [ModelerConstants.LINK_ACT_PROMISE, ModelerConstants.LINK_ACT_PROMISE_S];
            case Mdl.CAct.decline:
                return [ModelerConstants.LINK_ACT_DECLINE, ModelerConstants.LINK_ACT_DECLINE_S];
            case Mdl.CAct.quit:
                return [ModelerConstants.LINK_ACT_QUIT, ModelerConstants.LINK_ACT_QUIT_S];
            case Mdl.CAct.state:
                return [ModelerConstants.LINK_ACT_STATE, ModelerConstants.LINK_ACT_STATE_S];
            case Mdl.CAct.accept:
                return [ModelerConstants.LINK_ACT_ACCEPT, ModelerConstants.LINK_ACT_ACCEPT_S];
            case Mdl.CAct.reject:
                return [ModelerConstants.LINK_ACT_REJECT, ModelerConstants.LINK_ACT_REJECT_S];
            case Mdl.CAct.stop:
                return [ModelerConstants.LINK_ACT_STOP, ModelerConstants.LINK_ACT_STOP_S];
            default:
                return [ModelerConstants.LINK_ACT_REQUEST, ModelerConstants.LINK_ACT_REQUEST_S];
        }
    }

    get xmlDocument(): XMLDocument {
        return this._xmlDocument;
    }
}

abstract class VertexManager {
}

class ProcessManager extends VertexManager {
    private _processId: number;

    constructor() {
        super();
        this._processId = 0;
    }

    public registerProcess() {
        ++this._processId;
    }

    public generateStyle(svgTemplate: string): string {
        return ModelerConstants.MXGRAPH_SHAPE_IMAGE + svgTemplate + ";";
    }

    get processId(): number {
        return this._processId;
    }

    set processId(val: number) {
        this._processId = val;
    }
}

class ActorManager extends VertexManager {
    public generateStyle(phase: RolePhase, svgTemplate: string): string {
        let tmpSvg: String = new String(atob(svgTemplate));
        
        tmpSvg = tmpSvg.replace("{rectangleFill}", phase.getColor());

        return ModelerConstants.MXGRAPH_SHAPE_IMAGE + btoa(tmpSvg.toString()) + ";";
    }
}

class RoleManager extends VertexManager {
    private _transactionNumber: number;
    private _actorNumber: number;

    constructor() {
        super();
        this._transactionNumber = 0;
        this._actorNumber = 0;
    }

    public registerRole() {
        ++this._transactionNumber;
    }

    public registerActor() {
        ++this._actorNumber;
    }

    public generateStyle([type, phase]: [RoleType, RolePhase], transactionNumber: number, svgTemplate: string): string {
        let tmpSvg: String = new String(atob(svgTemplate));
        
        tmpSvg = tmpSvg.replace("{rectangleFill}", phase.getColor());
        tmpSvg = tmpSvg.replace("{diamondStroke}", type.getColor());
        tmpSvg = tmpSvg.replace("{diamondFill}", type.getColor());
        tmpSvg = tmpSvg.replace("{transactionNumber}", transactionNumber.toString());

        return ModelerConstants.MXGRAPH_SHAPE_IMAGE + btoa(tmpSvg.toString()) + ";";
    }

    get transactionNumber(): number {
        return this._transactionNumber;
    }

    set transactionNumber(val: number) {
        this._transactionNumber = val;
    }

    get actorNumber(): number {
        return this._actorNumber;
    }

    set actorNumber(val: number) {
        this._actorNumber = val;
    }
}

export abstract class Role {
    private _style: string;
    private _node: any;
    protected _width: number;
    protected _height: number;

    constructor(style: string, node: any) {
        this._style = style;
        this._node = node;
    }

    get style(): string {
        return this._style;
    }

    get node(): any {
        return this._node;
    }

    get width(): number {
        return this._width;
    }

    get height(): number {
        return this._height;
    }

    public abstract textOffset(): [number, number];
}

export class ActorRole extends Role {
    constructor(style: string, node: any) {
        super(style, node);
        this._width = defaultActorRoleWidth;
        this._height = defaultActorRoleHeight;
    }

    public textOffset(): [number, number] {
        return [ModelerConstants.TEXT_OFFSET_ACTOR_ROLE_X, ModelerConstants.TEXT_OFFSET_ACTOR_ROLE_Y];
    }
}

export class ElementaryRole extends Role {
    constructor(style: string, node: any) {
        super(style, node);
        this._width = defaultElementaryRoleWidth;
        this._height = defaultElementaryRoleHeight;
    }

    public textOffset(): [number, number] {
        return [ModelerConstants.TEXT_OFFSET_ELEMENTARY_ROLE_X, ModelerConstants.TEXT_OFFSET_ELEMENTARY_ROLE_Y];
    }
}

export class SelfActivatingRole extends Role {
    constructor(style: string, node: any) {
        super(style, node);
        this._width = defaultSelfActivatingRoleWidth;
        this._height = defaultSelfActivatingRoleHeight;
    }

    public textOffset(): [number, number] {
        return [ModelerConstants.TEXT_OFFSET_SELF_ACTIVATING_ROLE_X, ModelerConstants.TEXT_OFFSET_SELF_ACTIVATING_ROLE_Y];
    }
}

export class ProcessBox extends Role {
    constructor(style: string, node: any) {
        super(style, node);
        this._width = defaultProcessBoxWidth;
        this._height = defaultProcessBoxHeight;
    }

    public textOffset(): [number, number] {
        return [ModelerConstants.TEXT_OFFSET_PROCESS_X, ModelerConstants.TEXT_OFFSET_PROCESS_Y];
    }
}

export class WaitLinkNode extends Role {
    constructor(style: string, node: any) {
        super(style, node);
        this._width = defaultWaitLinkNodeWidth;
        this._height = defaultWaitLinkNodeHeight;
    }

    public textOffset(): [number, number] {
        return [ModelerConstants.WAIT_LINK_RELATIVE_POSITION_UP_X, ModelerConstants.WAIT_LINK_RELATIVE_POSITION_UP_Y];
    }

    public textOffsetElementary(): [number, number] {
        return [ModelerConstants.WAIT_LINK_RELATIVE_POSITION_UP_ELEMENTARY_X, ModelerConstants.WAIT_LINK_RELATIVE_POSITION_UP_ELEMENTARY_Y];
    }

    public textOffsetDown(): [number, number] {
        return [ModelerConstants.WAIT_LINK_RELATIVE_POSITION_DOWN_X, ModelerConstants.WAIT_LINK_RELATIVE_POSITION_DOWN_Y];
    }

    public textOffsetElementaryDown(): [number, number] {
        return [ModelerConstants.WAIT_LINK_RELATIVE_POSITION_DOWN_ELEMENTARY_X, ModelerConstants.WAIT_LINK_RELATIVE_POSITION_DOWN_ELEMENTARY_Y];
    }
}

export class ActorLabel extends Role {
    constructor(style: string, node: any) {
        super(style, node);
        this._width = defaultActorLabelWidth;
        this._height = defaultActorLabelHeight;
    }

    public textOffset(): [number, number] {
        return [0, 0];
    }
}