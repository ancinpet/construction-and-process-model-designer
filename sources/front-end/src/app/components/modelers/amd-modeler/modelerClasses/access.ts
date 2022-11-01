declare var Blockly: any;
export function registerAccess() {
  Blockly.Blocks['access'] = {
    init: function () {
      this.jsonInit({
        "message0": "%1",
        "args0": [
          {
            "type": "field_label",
            "text": "Access"
          }
        ],
        "message1": "justice %1",
        "args1": [
          {
            "type": "field_input",
            "name": "justice_value",
            "text": "default justice text"
          }
        ],
        "message2": "sincerity %1",
        "args2": [
          {
            "type": "field_input",
            "name": "sincerity_value",
            "text": "default sincerity text"
          }
        ],
        "message3": "truth %1",
        "args3": [
          {
            "type": "field_input",
            "name": "sincerity_value",
            "text": "default truth text"
          }
        ],

        "previousStatement": null,
        "nextStatement": "Action",
        "colour": 98,
        "tooltip": "",
        "helpUrl": ""
      });
    }
  };

 
}
