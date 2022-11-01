declare var Blockly: any;
function paramOptions(){
  return [['Mortage.ammount', 'MortageAmmount']
    , ['Mortage.Client', 'MortageClient']
    , ['Client.Age', 'ClientAge']
    , ['Property.Owner', 'PropertyOwner']]

}
function actStateOptions() {
  var options = [[]]; 
  if (!Blockly.selected) {
    return options;
  }
  var toto = Blockly.mainWorkspace.getBlockById(Blockly.selected.id);
  if (!toto) {
    return options;
  }
  var parent, tmp;
  tmp = toto;
  while (tmp.getParent() != null) {
    parent = tmp.getParent();    
    tmp = parent;
  }
  
  if (parent) {
    if (parent.getFieldValue('whenTrans') == toto.getFieldValue('Trans')) {
      switch (parent.getFieldValue('whenState')) {
        case 'RQ':
          return [['Promise', 'PM'], ['Decline', 'DE']];
        case 'PM':
          return [['State', 'ST']];
        case 'DE':
          return [['Quit', 'QT']];
        case 'ST':
          return [['Accept', 'AC'], ['Reject', 'RJ']];
      }
    }
    else return [['Request', 'RQ']];    
  }
  
  return options;
}
function actTransOptions() {
  //TODO: Get self and child transactions
  var options = [['T1', 'T1'], ['T2', 'T2'], ['T3', 'T3']];
  return options;
}

export function registerAction() {

  Blockly.Blocks['action_assign'] = {
    init: function () {
          
      this.setColour(210)
      this.appendDummyInput()
        .appendField("Assign:")
        .appendField(new Blockly.FieldTextInput(''),
        'data1')
        .appendField("=")
        .appendField(new Blockly.FieldTextInput(''),
        'data2');
      this.setPreviousStatement(true);
      this.setNextStatement(true);
        
        

    }
  }
  Blockly.Blocks['action_trans'] = {
    init: function () {
      var when_states = new Blockly.FieldDropdown(actStateOptions);
      var when_transactions = new Blockly.FieldDropdown(actTransOptions);

      this.setColour(300);
      this.appendDummyInput()
        .appendField(when_transactions, 'Trans')
        .appendField(when_states, 'State');
      this.appendStatementInput('Parameters');
      this.setPreviousStatement(true);
      this.setNextStatement(true);

    }
  }
  Blockly.Blocks['param_helper'] = {
    init: function () {
      var param_options = new Blockly.FieldDropdown(paramOptions);      

      this.setColour(60);
      this.appendDummyInput()
        .appendField(new Blockly.FieldTextInput(''),
        'param')
        .appendField(":")
        .appendField(param_options, 'Value');            
      this.setPreviousStatement(true);
      this.setNextStatement(true);

    }
  }
}
