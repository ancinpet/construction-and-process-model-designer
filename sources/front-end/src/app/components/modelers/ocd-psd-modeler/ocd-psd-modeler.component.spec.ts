import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OcdPsdModelerComponent } from './ocd-psd-modeler.component';
import { Workplace } from './modelerClasses/workplace-initializator';
import { StateManagerService } from 'src/app/services/state-management/state-manager.service';
import { OCDCommunicationService, ModelProperties } from 'src/app/services/ocd-communication/ocd-communication.service';

describe('OcdPsdModelerComponent', () => {
  let component: OcdPsdModelerComponent;
  let fixture: ComponentFixture<OcdPsdModelerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OcdPsdModelerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OcdPsdModelerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


});

describe('Graph initialization', () => {
  let documentElement = document.createElement("div");
  let stateManager = new StateManagerService(null);
  let interactionManager = new OCDCommunicationService();
  let workplace = new Workplace(documentElement, stateManager, interactionManager);
  workplace.start();

  it('modeler should have DOM element', () => {
    expect(workplace.container).not.toEqual(null);
  });

  it('modeler should have graph initialized', () => {
    expect(workplace.modeler.graph).not.toEqual(null);
  });

  it('modeler should use html labels', () => {
    expect(workplace.modeler.graph.isHtmlLabels).toEqual(true);
  });

  it('modeler should not allow resizing cells by default', () => {
    expect(workplace.modeler.graph.isCellsResizable).toEqual(false);
  });

  let process = workplace.modeler.cellFactory.createProcessBox();
  it('modeler should be able to create cells', () => {
    expect(process).not.toEqual(null);
  });

  let vertex = workplace.modeler.insertRoleToGraph(process);
  it('modeler should be able to insert cells', () => {
    expect(vertex).not.toEqual(null);
  });

  it('all vertices should have single parent', () => {
    expect(vertex.parent).toEqual(workplace.modeler.parent);
  });

  let cells = workplace.modeler.graph.getChildCells(workplace.modeler.parent);
  let cellLength = cells.length;
  workplace.modeler.graph.removeCells([vertex]);
  let newCells = workplace.modeler.graph.getChildCells(workplace.modeler.parent);
  let newCellLength = newCells.length;

  it('removing vertices works properly', () => {
    expect(newCellLength).toBeLessThan(cellLength);
  });

  let ctr = 0;
  let sub = interactionManager.getModelProperties$().subscribe((properties: ModelProperties) => {++ctr});
  interactionManager.dispatchProperties(null);
  it('component communication works', () => {
    expect(ctr).toBeGreaterThan(0);
  });
  sub.unsubscribe();
});