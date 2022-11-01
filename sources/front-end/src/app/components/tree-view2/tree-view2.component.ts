import { Component, OnInit, OnDestroy, Injectable, ViewChild, } from '@angular/core';
import { Subscription, BehaviorSubject } from "rxjs";
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';

import { StateManagerService } from "../../services/state-management/state-manager.service";
import { PsiContract, ITransactionKind, ITransactor, IPsiContract, IActorRole, IProcess, IEntityType, IAttributeType, ActorRoleType, IActionRule } from 'src/app/model/model';
import * as ModelUtils from 'src/app/model/utils';
import { MatMenuTrigger } from '@angular/material';
import { Guid } from 'guid-typescript';
import { RemoveActorRoleAction, RemoveTransactionKindAction } from 'src/app/services/state-management/actions';
import { Router } from '@angular/router';
import * as AMActions from 'src/app/services/state-management/actions'

export enum NodeType {
    process = 'process',
    actorRole = 'actorRole',
    transactionKind = 'transactionKind',
    entityType = 'entityType',
    attributeType = 'attributeType',
    processes_root = 'processes_root',
    actorRoles_root = 'actorRoles_root',
    transactionKinds_root = 'transactionKinds_root',
    dataStructure_root = 'dataStructure_root',
    actionRule = 'actionRule',
    actionRules_root = 'actionRules_root',
    bpmn = 'bpmn'
};

export class TreeNode {
    public children: TreeNode[];
    expanded: boolean

    constructor(public id: Guid, public type: NodeType, public label: string, public isExtendable: boolean, children?: TreeNode[], public otherId?: any) {
        if (!children) {
            this.children = [];
        }
        else {
            this.children = children;
        }
    }

}

@Injectable()
export class TreeViewData {
    dataChange = new BehaviorSubject<TreeNode[]>([]);

    get data(): TreeNode[] { return this.dataChange.value; }

    constructor() {
    }

    initialize(psiContract: IPsiContract) {
        const data = this.buildTree(psiContract);
        this.dataChange.next(data);
    }

    private createActorRoleNode(actorRole: IActorRole): TreeNode {
        let label: string;
        if (actorRole.type == ActorRoleType.composite) {
            label = `(CA${actorRole.identificationNumber}) ${actorRole.name}`;
        }
        else {
            label = `(A${actorRole.identificationNumber}) ${actorRole.name}`;
        }
        return new TreeNode(actorRole.id, NodeType.actorRole, label, false);
    }

    private createTransactionKindNode(transactionKind: ITransactionKind): TreeNode {
        let label: string = `(T${transactionKind.identificationNumber}) ${transactionKind.name}`;
        return new TreeNode(transactionKind.id, NodeType.transactionKind, label, false);
    }

    private createProcessNode(process: IProcess, psiContract: IPsiContract): TreeNode {
        let bpmnNodes: TreeNode[] = process.bpmnDiagrams.map((bpmn) => {
            let name: string = ModelUtils.parseBpmnNameFromXml(bpmn);
            if (!name) {
                name = ModelUtils.parseBpmnIdFromXml(bpmn);
            }
            return new TreeNode(process.id, NodeType.bpmn, name, false, null, ModelUtils.parseBpmnIdFromXml(bpmn));
        });

        return new TreeNode(process.id, NodeType.process, `${process.name}`, true, bpmnNodes);
    }

    private createAttributeTypeNode(attributeType: IAttributeType): TreeNode {
        return new TreeNode(attributeType.id, NodeType.attributeType, `${attributeType.name} (${ModelUtils.attributeValueTypeToString(attributeType.valueType)})`, false);
    }

    private createEntityTypeNode(entityType: IEntityType, psiContract: IPsiContract): TreeNode {
        let attributeTypeNodes: TreeNode[] = [];
        psiContract.dataModel.attributeTypes.forEach(attributeType => {
            if (ModelUtils.guidEquals(attributeType.entityType, entityType.id)) {
                attributeTypeNodes.push(this.createAttributeTypeNode(attributeType));
            }
        });
        return new TreeNode(entityType.id, NodeType.entityType, `${entityType.name}`, true, attributeTypeNodes);
    } 

    private createActionRuleNode(actionRule: IActionRule, psiContract: IPsiContract): TreeNode{
      return new TreeNode(actionRule.id, NodeType.actionRule, `${actionRule.name}`, false);
    }

    buildTree(psiContract: PsiContract): TreeNode[] {
        let result: TreeNode[] = [];

        let processesNodes: TreeNode[] = psiContract.processes.map(process => this.createProcessNode(process, psiContract));
        let actorRolesNodes: TreeNode[] = psiContract.actorRoles.map(actorRole => this.createActorRoleNode(actorRole));
        let transactionKindsNodes: TreeNode[] = psiContract.transactionKinds.map(transactionKind => this.createTransactionKindNode(transactionKind));
        let dataStructureNodes: TreeNode[] = psiContract.dataModel.entityTypes.map(entityType => this.createEntityTypeNode(entityType, psiContract));
        let actionRulesNodes: TreeNode[] = psiContract.actionRules.map(actionRule => this.createActionRuleNode(actionRule, psiContract));

        let processesRootNode: TreeNode = new TreeNode(psiContract.id, NodeType.processes_root, "Processes", true, processesNodes);
        let actorRoleRootNode: TreeNode = new TreeNode(psiContract.id, NodeType.actorRoles_root, "Actor Roles", true, actorRolesNodes);
        let transactionKindsRootNode: TreeNode = new TreeNode(psiContract.id, NodeType.transactionKinds_root, "Transaction Kinds", true, transactionKindsNodes);
        let dataStructureRootNode: TreeNode = new TreeNode(psiContract.id, NodeType.dataStructure_root, "Data Structure", true, dataStructureNodes);
        let actionRulesRootNode: TreeNode = new TreeNode(psiContract.id, NodeType.actionRules_root, "Action Rules", true, actionRulesNodes);
        result.push(processesRootNode, actorRoleRootNode, transactionKindsRootNode, dataStructureRootNode, actionRulesRootNode);
        return result;
  }
}

@Component({
    selector: 'app-tree-view2',
    templateUrl: './tree-view2.component.html',
    styleUrls: ['./tree-view2.component.scss'],
    providers: [TreeViewData]
})

export class TreeViewComponent implements OnInit, OnDestroy {

    private subscribtion: Subscription;
    nestedTreeControl: NestedTreeControl<TreeNode>;
    nestedDataSource: MatTreeNestedDataSource<TreeNode>;
    public treeData: TreeViewData;
    private psiContract: IPsiContract;

    constructor(private stateManagerService: StateManagerService, treeData: TreeViewData, private router: Router) {
        this.nestedTreeControl = new NestedTreeControl<TreeNode>(this._getChildren);
        this.nestedDataSource = new MatTreeNestedDataSource();
        this.treeData = treeData;
        this.treeData.dataChange.subscribe(data => this.nestedDataSource.data = data);
    }

    @ViewChild(MatMenuTrigger)
    contextMenu: MatMenuTrigger;

    contextMenuPosition = { x: '0px', y: '0px' };

    onContextMenu(event: MouseEvent, node: TreeNode) {
        event.preventDefault();
        this.contextMenuPosition.x = event.clientX + 'px';
        this.contextMenuPosition.y = event.clientY + 'px';
        if (
            node.type === NodeType.process ||
            node.type === NodeType.actorRole ||
            node.type === NodeType.transactionKind ||
            node.type === NodeType.bpmn ||
            node.type === NodeType.actionRule
        ) {
            this.contextMenu.menuData = { 'node': node };
            this.contextMenu.openMenu();
        }
    }

    onClick(event: MouseEvent, node: TreeNode) {
    }

    isRemovable(node: TreeNode): boolean {
        let result: boolean;
        switch (node.type) {
            case NodeType.actorRole:
                result = !ModelUtils.actorRoleIsReferenced(this.psiContract, node.id);
                break;
            case NodeType.transactionKind:
                result = !ModelUtils.transactionKindIsReferenced(this.psiContract, node.id);
                break;
            default:
                result = false;
                break;
        }
        return result;
    }

    onRemoveActorRole(id: Guid) {
        this.stateManagerService.dispatchAction(new RemoveActorRoleAction(id));
    }

    onRemoveTransactionKind(id: Guid) {
        this.stateManagerService.dispatchAction(new RemoveTransactionKindAction(id));
    }

    onRemoveBpmnDiagram(processId:Guid, bpmnId: string){
      let action = new AMActions.RemoveBpmnDiagramAction(processId, bpmnId);
      this.stateManagerService.dispatchAction(action);
    }

    onNewBpmnDiagram(id: Guid) {
    var bpmnId = Guid.create();
    var xml = '<?xml version="1.0" encoding="UTF-8"?>\n' +
      '<bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" id="Definitions_1i1m84k" targetNamespace="http://bpmn.io/schema/bpmn" exporter="bpmn-js (https://demo.bpmn.io)" exporterVersion="3.3.1">\n' +
      '  <bpmn:process id="'+ bpmnId + '" isExecutable="false" name="New diagram">\n' +
      '    <bpmn:startEvent id="StartEvent_1g5o27h"/>\n' +
      '  </bpmn:process>\n' +
      '  <bpmndi:BPMNDiagram id="BPMNDiagram_1">\n' +
      '    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="' + bpmnId + '">\n' +
      '      <bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_1g5o27h">\n' +
      '        <dc:Bounds x="156" y="81" width="36" height="36" />\n' +
      '      </bpmndi:BPMNShape>\n' +
      '    </bpmndi:BPMNPlane>\n' +
      '  </bpmndi:BPMNDiagram>\n' +
      '</bpmn:definitions>';

        
        let action = new AMActions.AddBpmnDiagramAction(id, xml);
        this.stateManagerService.dispatchAction(action);
        this.router.navigate(['/modelerPsd/' + id + '/' + bpmnId]);
    }

    onNewDmnTable(id: Guid) {
        // TODO
    }

    onDeleteActionRule(id: Guid) {
      let action = new AMActions.RemoveActionRule(id);
      this.stateManagerService.dispatchAction(action);
    }




    hasNestedChild = (_: number, nodeData: TreeNode) => { return nodeData.isExtendable };

    private _getChildren = (node: TreeNode) => { return node.children };

    ngOnInit() {
        this.subscribtion = this.stateManagerService.getPsiContract$()
            .subscribe((psiContract => this.onUpdate(psiContract)), (error => this.onError(error)), (() => this.onComplete()));
    }

    changeState(node) {
        node.expanded = !node.expanded;
    }
    ngOnDestroy() {
        this.subscribtion.unsubscribe();
    }

    private onUpdate(psiContract: IPsiContract): void {
        this.psiContract = psiContract;
        this.treeData.initialize(psiContract);
    }

    private onError(error) {
        console.log("subscribber error: %s", error);
    }

    private onComplete() {
        console.log("subscribtion end");
    }

}
