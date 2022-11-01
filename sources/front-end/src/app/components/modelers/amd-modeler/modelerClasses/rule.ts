import { PsiContract } from "src/app/model/model";
import { AmdModelerComponent } from 'src/app/components/modelers/amd-modeler/amd-modeler.component';


declare var Blockly: any;

export function registerRule(amdModeler: AmdModelerComponent) {

  var toto;
  Blockly.Blocks['rule'] = {
    init: function () {
      toto = this;
      this.setColour(120);
      this.appendDummyInput().appendField("Rule: ")
        .appendField(new Blockly.FieldTextInput('default text'), 'RuleName');

      this.setMutator(new Blockly.Mutator([/*'when_helper', */'while', 'with_helper', /*'if_helper', 'then',*/ 'else']));
      this.resetVariables();
      this.updateShape_();

    },

    resetVariables: function () {
      this.join_ = 0;
      this.when = true;
      this.while = false;
      this.with = false;
      this.if = true;
      this.then = true;
      this.else = false;
    }
    ,
    mutationToDom: function () {
      var container = document.createElement('mutation');
      container.setAttribute('join', this.join_);
      container.setAttribute('when', this.when);
      container.setAttribute('while', this.while);
      container.setAttribute('with', this.with);
      container.setAttribute('if', this.if);
      container.setAttribute('then', this.then);
      container.setAttribute('else', this.else);
      return container;
    }
    ,
    domToMutation: function (xmlElement) {
      /*this.join_ = xmlElement.getAttribute('join');
      this.when = xmlElement.getAttribute('when');
      this.while = xmlElement.getAttribute('while');
      this.with = xmlElement.getAttribute('with');
      this.if = xmlElement.getAttribute('if');
      this.then = xmlElement.getAttribute('then');
      this.else = xmlElement.getAttribute('else');
      this.rebuildShape_();*/
    }
    ,
    decompose: function (workspace) {
      var topBlock = workspace.newBlock('rule_helper');
      topBlock.initSvg();

      var connection = topBlock.nextConnection;

      if (this.while == true) {
        var whileBlock = workspace.newBlock('while');
        whileBlock.initSvg();
        connection.connect(whileBlock.previousConnection);
        connection = whileBlock.nextConnection;
      }
      if (this.with == true) {
        var withBlock = workspace.newBlock('with_helper');
        withBlock.initSvg();
        connection.connect(withBlock.previousConnection);
        connection = withBlock.nextConnection;
      }

      if (this.else == true) {
        var elseBlock = workspace.newBlock('else');
        elseBlock.initSvg();
        connection.connect(elseBlock.previousConnection);
        connection = elseBlock.nextConnection;
      }

      return topBlock;
    }
    ,
    compose: function (topBlock) {


      this.resetVariables();

      var withConnections: any = [null];
      var ifConnections: any = [null];
      var thenConnections: any = [null];
      var elseConnections: any = [null];

      ifConnections.push(this.getInput("IF").connection.targetConnection);
      thenConnections.push(this.getInput("THEN").connection.targetConnection);

      var clauseBlock = topBlock.nextConnection.targetBlock();
      while (clauseBlock) {
        switch (clauseBlock.type) {

          case 'while':
            this.while = true;

            break;
          case 'with_helper':
            this.with = true;
            withConnections.push(clauseBlock.statementConnection_);
            break;

          case 'else':
            this.else = true;
            elseConnections.push(clauseBlock.statementConnection_);
            break;
        }
        clauseBlock = clauseBlock.nextConnection &&
          clauseBlock.nextConnection.targetBlock();
      }


      this.updateShape_();
      this.reconnectChildBlocks_(withConnections,
        ifConnections,
        thenConnections,
        elseConnections);
    }
    ,
    updateShape_: function () {
      var i = 1;
      //remove all inputs
      if (this.getInput('WHEN')) {
        this.removeInput('WHEN');
      }
      if (this.getInput('WHILE')) {
        this.removeInput('WHILE');
      }
      if (this.getInput('WITH')) {
        this.removeInput('WITH');
      }
      if (this.getInput('IF')) {
        this.removeInput('IF');
      }
      if (this.getInput('THEN')) {
        this.removeInput('THEN');
      }
      if (this.getInput('ELSE')) {
        this.removeInput('ELSE');
      }

      //add new inputs
      if (this.when == true) {
        var when_states = new Blockly.FieldDropdown(amdModeler.whenStateOptions(amdModeler));
        var when_transactions = new Blockly.FieldDropdown(amdModeler.whenTransOptions(amdModeler));
        this.appendDummyInput('WHEN')
          .appendField('When')
          .appendField(when_transactions, 'whenTrans')
          .appendField(when_states, 'whenState');
      }
      if (this.while == true) {
        var while_states = new Blockly.FieldDropdown(amdModeler.whileStateOptions(amdModeler));
        var while_transactions = new Blockly.FieldDropdown(amdModeler.whileTransOptions(amdModeler));
        this.appendDummyInput('WHILE')
          .appendField('While')
          .appendField(while_transactions, 'whileTrans')
          .appendField(while_states, 'whileState');
      }
      if (this.with == true) {
        this.appendStatementInput('WITH').setCheck(['with']).appendField('With');
      }
      if (this.if == true) {
        this.appendStatementInput('IF').setCheck('if').appendField('If');
      }
      if (this.then == true) {
        this.appendStatementInput('THEN').setCheck(['action_assign', 'action_trans']).appendField('Then');
      }
      if (this.else == true) {
        this.appendStatementInput('ELSE').setCheck(['action_assign', 'action_trans']).appendField('Else');
      }


    },

    reconnectChildBlocks_: function (withConnections,
      ifConnections,
      thenConnections,
      elseConnections) {

      if (this.with == true) {
        Blockly.Mutator.reconnect(withConnections[1], this, 'WITH');
      }

      if (this.if == true) {
        Blockly.Mutator.reconnect(ifConnections[1], this, 'IF');
      }

      if (this.then == true) {
        Blockly.Mutator.reconnect(thenConnections[1], this, 'THEN');
      }

      if (this.else == true) {
        Blockly.Mutator.reconnect(elseConnections[1], this, 'ELSE');
      }

    },

    rebuildShape_: function () {

      var withConnections: any = [null];
      var ifConnections: any = [null];
      var thenConnections: any = [null];
      var elseConnections: any = [null];

      var statementConnections: any = [null];

      if (this.getInput('WITH')) {
        var inputWith = this.getInput('WITH');
        withConnections.push(inputWith.connection.targetConnection);
      }
      if (this.getInput('IF')) {
        var inputIf = this.getInput('IF');
        ifConnections.push(inputIf.connection.targetConnection);
      }
      if (this.getInput('THEN')) {
        var inputThen = this.getInput('THEN');
        thenConnections.push(inputThen.connection.targetConnection);
      }
      if (this.getInput('ELSE')) {
        var inputElse = this.getInput('Else');
        elseConnections.push(inputElse.connection.targetConnection);
      }
      this.updateShape_();
      this.reconnectChildBlocks_(withConnections,
        ifConnections,
        thenConnections,
        elseConnections);
    },

    saveConnections: function (containerBlock) {
      var clauseBlock = containerBlock.nextConnection.targetBlock();
      var i = 1;
      while (clauseBlock) {
        var input;
        switch (clauseBlock.type) {
          case 'with_helper':
            input = this.getInput('WITH');

            break;

          case 'else':
            input = this.getInput('ELSE');
            break;

        }
        clauseBlock.statementConnection_ =
          input && input.connection.targetConnection;
        clauseBlock = clauseBlock.nextConnection &&
          clauseBlock.nextConnection.targetBlock();
      }
    }

  };


  Blockly.Blocks['rule_helper'] = {
    init: function () {
      this.setColour(60);
      /*this.appendValueInput("JOIN")
        .setCheck("join")
        .appendField("CONTAINER");      */
      this.appendDummyInput().appendField("RULE");
      this.setNextStatement(true);
    }
  };

  Blockly.Blocks['when_helper'] = {
    init: function () {
      this.setColour(90);
      this.appendDummyInput()
        .appendField('WHEN');
      this.setPreviousStatement(true);
      this.setNextStatement(true);
    }
  };
  Blockly.Blocks['with_helper'] = {
    init: function () {
      this.setColour(120);
      this.appendDummyInput()
        .appendField('WITH');
      this.setPreviousStatement(true);
      this.setNextStatement(true);
    }
  };
  Blockly.Blocks['while'] = {
    init: function () {
      this.setColour(150);
      this.appendDummyInput()
        .appendField('WHILE');
      this.setPreviousStatement(true);
      this.setNextStatement(true);
    }
  };

  Blockly.Blocks['if_helper'] = {
    init: function () {
      this.setColour(180);
      this.appendDummyInput()
        .appendField('IF');
      this.setPreviousStatement(true);
      this.setNextStatement(true);
    }
  };
  Blockly.Blocks['then'] = {
    init: function () {
      this.setColour(210);
      this.appendDummyInput()
        .appendField('THEN');
      this.setPreviousStatement(true);
      this.setNextStatement(true);
    }
  };
  Blockly.Blocks['else'] = {
    init: function () {
      this.setColour(230);
      this.appendDummyInput()
        .appendField('ELSE');
      this.setPreviousStatement(true);
      this.setNextStatement(true);
    }
  };


  /*Blockly.Blocks['rule'] = {
    init: function () {
      var dropdown_states = new Blockly.FieldDropdown(stateOptions);
      var dropdown_transactions = new Blockly.FieldDropdown(transOptions);
      var dropdown_states2 = new Blockly.FieldDropdown(stateOptions);
      var dropdown_transactions2 = new Blockly.FieldDropdown(transOptions);
      this.appendDummyInput().appendField("Rule: ")
        .appendField(new Blockly.FieldTextInput('default text'),'RuleName');
      this.appendDummyInput().appendField('When ')
        .appendField(dropdown_transactions, 'Trans')        
        .appendField(dropdown_states, 'State');      
      this.appendDummyInput()
        .appendField('While')
        .appendField(dropdown_transactions2, 'Trans2')
        .appendField(dropdown_states2, 'State2');
      this.appendStatementInput('With')
        .appendField('With');
      this.appendStatementInput('If')
        .appendField('If');
      this.appendStatementInput('Then')
        .appendField('Then');
        
      this.setColour(250); 
     
    }
  }*/
}
