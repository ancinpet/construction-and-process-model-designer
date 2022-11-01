declare var Blockly: any;

function dataOptions() {
  //TODO: get parameters from data model
  return [['Mortage.ammount', 'MortageAmmount']
    , ['Mortage.Client', 'MortageClient']
    , ['Client.Age', 'ClientAge']
    , ['Property.Owner', 'PropertyOwner']]
  
}

export function registerWith() {
  
  Blockly.Blocks['with'] = {
    init: function () {
      this.setColour(60);
      this.setMutator(new Blockly.Mutator(['dataHelper']));
      this.setPreviousStatement(true);
      this.values = 0;

      // this.appendDummyInput('VALUE' + this.values).appnedField(new Blockly.FieldTextInput('default text'), 'Data value');

    },
    mutationToDom: function () {
      var container = document.createElement('mutation');
      container.setAttribute('values', this.values);

      return container;
    },
    domToMutation: function (xmlElement) {
      this.values = parseInt(xmlElement.getAttribute('values'), 10);
      this.rebuildShape_();
      
    }
    ,
    decompose: function (workspace) {
      var topBlock = workspace.newBlock('with_helper');
      topBlock.initSvg();

      var connection = topBlock.nextConnection;
      for (var i = 1; i <= this.values; i++) {
        var dataBlock = workspace.newBlock('dataHelper');
        dataBlock.initSvg();
        connection.connect(dataBlock.previousConnection);
        connection = dataBlock.nextConnection;
      }
      return topBlock;
    },
    compose: function (topBlock) {


      this.values = 0;
      var dataConnections: any = [null];

      var clauseBlock = topBlock.nextConnection.targetBlock();
      while (clauseBlock) {
        switch (clauseBlock.type) {
          case 'dataHelper':
            this.values++;            
            dataConnections.push(clauseBlock.valueConnection_);
            break;

        }
        clauseBlock = clauseBlock.nextConnection &&
          clauseBlock.nextConnection.targetBlock();
      }


      this.updateShape_();
      this.reconnectChildBlocks_(dataConnections);
    },
    rebuildShape_: function () {

      var dataConnections: any = [null];      
      var i = 1;
      while (this.getInput('VALUE' + i)) {
        var input = this.getInput('VALUE' + i);
        dataConnections.push(input.connection.targetConnection);
        i++;
      }
      
      this.updateShape_();
      this.reconnectChildBlocks_(dataConnections);
    },
    updateShape_: function () {
      var i = 1;
      //remove all inputs
      while (this.getInput('VALUE' + i)) {
        this.removeInput('VALUE' + i);
        i++;
      }

      //add new inputs
      for (var j = 1; j <= this.values; j++) {

        /*this.appendDummyInput('VALUE' + i)
        .appendField(new Blockly.FieldTextInput('default text'), 'Data value');*/
        this.appendValueInput('VALUE' + j);
      }
    },
    reconnectChildBlocks_: function (dataConnections) {
      
      for (var i = 1; i <= this.values; i++) {        
        Blockly.Mutator.reconnect(dataConnections[i], this, 'VALUE' + i);
      }

    },
    saveConnections: function (containerBlock) {
      var clauseBlock = containerBlock.nextConnection.targetBlock();
      var i = 1;
      while (clauseBlock) {
        var input;
        switch (clauseBlock.type) {
          case 'dataHelper':
            input = this.getInput('VALUE' + i);
            clauseBlock.valueConnection_ =
              input && input.connection.targetConnection;           
            i++;
            break;
        }
        clauseBlock = clauseBlock.nextConnection &&
          clauseBlock.nextConnection.targetBlock();
       
      }
    }
  };

  Blockly.Blocks['dataHelper'] = {
    init: function () {
      this.setColour(23);
      this.appendDummyInput()
        .appendField('Data');
      this.setPreviousStatement(true);
      this.setNextStatement(true);
      
    }
  }
  Blockly.Blocks['dataField'] = {
    init: function () {
      var dataChooser = new Blockly.FieldDropdown(dataOptions);
      this.setColour(75);
      this.appendDummyInput()
        .appendField(dataChooser, "Value");
      this.setPreviousStatement(true);
      this.setNextStatement(true);
      //this.setOutput(true);

    }
  }    
}

