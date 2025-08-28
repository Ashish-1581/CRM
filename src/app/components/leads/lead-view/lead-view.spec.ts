import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadView } from './lead-view';

describe('LeadView', () => {
  let component: LeadView;
  let fixture: ComponentFixture<LeadView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeadView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeadView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
