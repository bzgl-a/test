export interface ProductionCalendar {
  holidays: string[];
  workingWeekends: string[];
}

export const PRODUCTION_CALENDAR: Record<string, ProductionCalendar> = {
  '2026': {
    holidays: [
      '2026-01-01',
      '2026-01-02',
      '2026-01-05',
      '2026-01-06',
      '2026-01-07',
      '2026-01-08',
      '2026-01-09',
      '2026-02-23',
      '2026-03-09',
      '2026-05-01',
      '2026-05-11',
      '2026-06-12',
      '2026-11-04',
      '2026-12-31',
    ],
    workingWeekends: [],
  },
};
