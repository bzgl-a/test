import { TestBed } from '@angular/core/testing';

import { ProductionCalendarService } from './production-calendar.service';

describe('ProductionCalendarService', () => {
  let service: ProductionCalendarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductionCalendarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
