import { mxgraph } from 'mxgraph';
import { Modeler } from '../modeler-initializator';
import { ActorRole } from 'src/app/model/model';
import { ModelerConstants } from '../defines-constants';
import { Guid } from 'guid-typescript';

const mx = require('mxgraph')({
    mxImageBasePath: '/assets/mxgraph/images',
    mxBasePath: '/assets/mxgraph'
});

export class ModelParser {

    static setActorLabel(modeler: Modeler, cell: mxgraph.mxCell, actorLabel: string) {
        let labelCell = cell;
        if (labelCell.value.tagName != ModelerConstants.ACTOR_ROLE_NAME) {
            labelCell = this.getChildLabel(cell);
        }

        this.setCellLabel(modeler, labelCell, actorLabel);        
    } 

    static setActorGuid(modeler: Modeler, cell: mxgraph.mxCell, actorGuid: Guid) {
        let newValue = cell.value.cloneNode(true);
        newValue.setAttribute("actorGuid", actorGuid.toString());

        modeler.model.beginUpdate();
        try {
            modeler.model.setValue(cell, newValue);
        } finally {
            modeler.model.endUpdate();
        }
        
    }    

    static setTransactionLabel(modeler: Modeler, cell: mxgraph.mxCell, transactionLabel: string) {
        this.setCellLabel(modeler, cell, transactionLabel);
    } 

    static setTransactionGuid(modeler: Modeler, cell: mxgraph.mxCell, transactionGuid: Guid) {
        let newValue = cell.value.cloneNode(true);
        newValue.setAttribute("transactionGuid", transactionGuid.toString());

        modeler.model.beginUpdate();
        try {
            modeler.model.setValue(cell, newValue);
        } finally {
            modeler.model.endUpdate();
        }
        
    }    

    public static setCellLabel(modeler: Modeler, cell: mxgraph.mxCell, label: string) {
        if (cell) {
            let newValue = cell.value.cloneNode(true);
            newValue.setAttribute("label", label);
    
            modeler.model.beginUpdate();
            try {
                modeler.model.setValue(cell, newValue);
            } finally {
                modeler.model.endUpdate();
            }
        }
    }

    private static getChildLabel(cell: mxgraph.mxCell): mxgraph.mxCell {
        for (let child of cell.children) {
            if (child.value && child.value.tagName == ModelerConstants.ACTOR_LABEL_NAME) {
                return child;
            }
        }
    }
}