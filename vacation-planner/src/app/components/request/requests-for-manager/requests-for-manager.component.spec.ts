import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestsForManagerComponent } from './requests-for-manager.component';

describe('RequestsForManagerComponent', () => {
  let component: RequestsForManagerComponent;
  let fixture: ComponentFixture<RequestsForManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestsForManagerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestsForManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
