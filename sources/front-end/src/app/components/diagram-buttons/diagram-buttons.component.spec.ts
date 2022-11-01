import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiagramButtonsComponent } from './diagram-buttons.component';

describe('DiagramButtonsComponentComponent', () => {
	let component: DiagramButtonsComponent;
	let fixture: ComponentFixture<DiagramButtonsComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [DiagramButtonsComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(DiagramButtonsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
