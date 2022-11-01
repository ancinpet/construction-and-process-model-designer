import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfdModelerComponent } from './ofd-modeler.component';

describe('OfdModelerComponent', () => {
  let component: OfdModelerComponent;
  let fixture: ComponentFixture<OfdModelerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfdModelerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfdModelerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
