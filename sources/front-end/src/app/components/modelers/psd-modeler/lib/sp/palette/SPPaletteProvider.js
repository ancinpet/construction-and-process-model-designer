import SP from '../sp';


/**
 * A provider for quick service task production
 */
export default function SPPaletteProvider(palette, create, elementFactory) {

  this._create = create;
  this._elementFactory = elementFactory;

  palette.registerProvider(this);
}

SPPaletteProvider.$inject = [
  'palette',
  'create',
  'elementFactory'
];

SPPaletteProvider.prototype.getPaletteEntries = function() {

  var elementFactory = this._elementFactory,
      create = this._create;

  function startCreate(event) {
    var serviceTaskShape = elementFactory.create(
      'shape', { type: 'bpmn:ServiceTask' }
    );

    create.start(event, serviceTaskShape);
  }

  return {
    'BI-SP': {
      group: 'activity',
      title: 'Softvarový tymový projekt',
      imageUrl: SP.dataURL,
      action: {
        dragstart: startCreate,
        click: startCreate
      }
    }
  };
};
