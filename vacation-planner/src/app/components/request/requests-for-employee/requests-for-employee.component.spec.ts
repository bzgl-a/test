import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestsForEmployeeComponent } from './requests-for-employee.component';

describe('AllRequestsComponent', () => {
  let component: RequestsForEmployeeComponent;
  let fixture: ComponentFixture<RequestsForEmployeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestsForEmployeeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RequestsForEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
