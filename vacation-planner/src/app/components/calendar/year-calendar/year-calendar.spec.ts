import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YearCalendar } from './year-calendar';

describe('YearCalendar', () => {
  let component: YearCalendar;
  let fixture: ComponentFixture<YearCalendar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [YearCalendar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YearCalendar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
