import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainScreenLayoutComponent } from './main-screen-layout.component';

describe('MainScreenLayoutComponent', () => {
  let component: MainScreenLayoutComponent;
  let fixture: ComponentFixture<MainScreenLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainScreenLayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainScreenLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
