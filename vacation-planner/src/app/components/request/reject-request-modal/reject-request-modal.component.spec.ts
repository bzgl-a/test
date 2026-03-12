import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectRequestModalComponent } from './reject-request-modal.component';

describe('RejectRequestModalComponent', () => {
  let component: RejectRequestModalComponent;
  let fixture: ComponentFixture<RejectRequestModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RejectRequestModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RejectRequestModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
