import { Injectable } from '@angular/core';
import { PRODUCTION_CALENDAR } from '../../constants/production-calendar';

@Injectable({
  providedIn: 'root',
})
export class ProductionCalendarService {
  public isDayOff(date: Date): boolean {
    const dateKey = this.formatDate(date);
    const yearData = PRODUCTION_CALENDAR[date.getFullYear()];

    if (!yearData) {
      return this.isStandardWeekend(date);
    }

    const isHoliday = yearData.holidays.includes(dateKey);
    const isWorkingWeekend = yearData.workingWeekends.includes(dateKey);
    const isStandardWeekend = this.isStandardWeekend(date);

    return (isStandardWeekend && !isWorkingWeekend) || isHoliday;
  }

  public buildDayOffArray(
    year: number,
    month: number,
    daysInMonth: number,
  ): boolean[] {
    const result: boolean[] = [];
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      result.push(this.isDayOff(date));
    }
    return result;
  }

  private isStandardWeekend(date: Date): boolean {
    const day = date.getDay();
    return day === 0 || day === 6;
  }

  private formatDate(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
}
