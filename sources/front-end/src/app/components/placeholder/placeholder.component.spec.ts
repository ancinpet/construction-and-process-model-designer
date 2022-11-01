import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { PlaceholderComponent } from './placeholder.component';

describe('AppRootComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [
        PlaceholderComponent
      ],
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(PlaceholderComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'EnterpriseDesigner'`, () => {
    const fixture = TestBed.createComponent(PlaceholderComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('EnterpriseDesigner');
  });

  it('should render title in a h1 tag', () => {
    const fixture = TestBed.createComponent(PlaceholderComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Welcome to EnterpriseDesigner!');
  });
});
