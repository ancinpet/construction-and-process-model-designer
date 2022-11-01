import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AmdModelerComponent } from './amd-modeler.component';

describe('AmdModelerComponent', () => {
  let component: AmdModelerComponent;
  let fixture: ComponentFixture<AmdModelerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AmdModelerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AmdModelerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
