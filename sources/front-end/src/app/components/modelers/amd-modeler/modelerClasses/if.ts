declare var Blockly: any;



export function registerIf() {
  Blockly.Blocks['ifold'] = {
    init: function () {
      this.appendDummyInput()
        //.appendField('If')
        .appendField(new Blockly.FieldTextInput(''), 'left')
        .appendField(new Blockly.FieldDropdown([['>', '>'], ['==', '=='], ['<', '<']]), 'operator')
        .appendField(new Blockly.FieldTextInput(''), 'right');
      this.setPreviousStatement(true);

    }
  };
  Blockly.Blocks['boolold'] = {
    init: function () {
      this.appendDummyInput()
        //.appendField('If')
        .appendField(new Blockly.FieldDropdown([['true', 'true'], ['false', 'false']]), 'value');
      this.setPreviousStatement(true);

    }
  }

  Blockly.Blocks['bool1'] = {
    init: function () {
      this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([["variable1", "variable1"], ["variable2", "variable2"], ["variable3", "variable3"]]), "variables")
        .appendField(new Blockly.FieldDropdown([["==", "OPTIONNAME"], ["<=", "OPTIONNAME"], [">=", "OPTIONNAME"], ["<", "OPTIONNAME"], [">", "OPTIONNAME"]]), "comparator")
        .appendField(new Blockly.FieldTextInput("data value"), "data_value");
      this.setInputsInline(true);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(260);
    }
  };

  Blockly.Blocks['bool2'] = {
    init: function () {
      this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([["variable1", "variable1"], ["variable2", "variable2"], ["variable3", "variable3"]]), "variables")
        .appendField(new Blockly.FieldDropdown([["==", "OPTIONNAME"], ["<=", "OPTIONNAME"], [">=", "OPTIONNAME"], ["<", "OPTIONNAME"], [">", "OPTIONNAME"]]), "comparator")
        .appendField(new Blockly.FieldDropdown([["variable1", "variable1"], ["variable2", "variable2"], ["variable3", "variable3"]]), "variables");
      this.setInputsInline(true);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(260);
    }
  };

  Blockly.Blocks['parentheses'] = {
    init: function () {
      this.appendDummyInput()
        .appendField("(");
      this.appendStatementInput("bool statement")
        .setCheck(null);
      this.appendDummyInput()
        .appendField("  )");
      this.setInputsInline(true);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(20);
    }
  };

  Blockly.Blocks['not'] = {
    init: function () {
      this.appendDummyInput()
        .appendField("NOT");
      this.appendStatementInput("bool statement")
        .setCheck(null);
      this.setInputsInline(true);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(20);
    }
  };

  Blockly.Blocks['and'] = {
    init: function () {
      this.appendDummyInput()
        .appendField("AND");
      this.setInputsInline(true);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(20);
    }
  };

  Blockly.Blocks['or'] = {
    init: function () {
      this.appendDummyInput()
        .appendField("OR");
      this.setInputsInline(true);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(20);
    }
  };



}
