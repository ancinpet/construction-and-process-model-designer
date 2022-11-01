declare var Blockly: any;

function stateOptions() {
  var options = [['Requested', 'RQ'], ['Promised', 'PR'], ['Stated', 'ST']];
  return options;
}
function transOptions() {
  var options = [['T1', 'T1'], ['T2', 'T2'], ['T3', 'T3']];
  return options;
}

export function registerWhen() {
  Blockly.Blocks['when'] = {
    init: function () {
      /*this.jsonInit({

        "type": "when",
        "message0": "When %1",
        "args0": [
          {
            "type": "field_input",
            "name": "when_value",
            "text": "default when text"

          }
        ],
        "previousStatement": null,
        "nextStatement": "Action",
        "colour": 355,
        "tooltip": "",
        "helpUrl": ""
      });*/
      var dropdown_states = new Blockly.FieldDropdown(stateOptions);
      var dropdown_transactions = new Blockly.FieldDropdown(transOptions);
      this.appendDummyInput()
        .appendField(dropdown_transactions, 'Trans')
        .appendField(dropdown_states, 'State');
      this.setPreviousStatement(true);
    }
  }
}
