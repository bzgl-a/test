import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CalendarService } from '../../../services/calendar/calendar.service';
import { DayInfoComponent } from '../day-info/day-info.component';
import { Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { LabelService } from '../../../services/label/label.service';
import { ProductionCalendarService } from '../../../services/production-calendar/production-calendar.service';

interface DayCell {
  day: number;
  load: number;
  isWeekend: boolean;
}

interface MonthData {
  days: DayCell[];
  blanks: number[];
}

@Component({
  selector: 'app-year-calendar',
  imports: [DayInfoComponent],
  templateUrl: './year-calendar.html',
  styleUrl: './year-calendar.scss',
})
export class YearCalendar implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();

  private router = inject(Router);
  private calendarService = inject(CalendarService);
  private productionCalendarService = inject(ProductionCalendarService);
  protected labelService = inject(LabelService);

  private yearSub: Subscription | undefined;

  public currentYear: number = new Date().getFullYear();

  public selectedDate: string | null = null;

  public monthData: MonthData[] = Array.from({ length: 12 }, () => ({
    days: [],
    blanks: [],
  }));

  ngOnInit(): void {
    this.loadYearData();
  }

  ngOnDestroy(): void {
    this.yearSub?.unsubscribe();
  }

  public loadYearData() {
    this.yearSub = this.calendarService
      .getYearLoad(this.currentYear)
      .subscribe({
        next: (data) => {
          this.prepareMonthData(data);
        },
        error: () => {
          this.prepareMonthData({});
        },
      });
  }

  private prepareMonthData(loadMap: Record<string, number>): void {
    this.monthData = Array.from({ length: 12 }, (_, monthIndex) => {
      const daysInMonth = new Date(
        this.currentYear,
        monthIndex + 1,
        0,
      ).getDate();
      const days: DayCell[] = [];

      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(this.currentYear, monthIndex, day);
        const dateKey = this.formatDate(monthIndex, day);
        const load = loadMap[dateKey] || 0;
        const isWeekend = this.productionCalendarService.isDayOff(date);

        days.push({ day, load, isWeekend });
      }

      const firstDayWeek = new Date(this.currentYear, monthIndex, 1).getDay();
      const blanksCount = firstDayWeek === 0 ? 6 : firstDayWeek - 1;
      const blanks = Array.from({ length: blanksCount }, (_, i) => i);

      return { days, blanks };
    });
  }

  public onDayClick(monthIndex: number, day: number) {
    this.selectedDate = this.formatDate(monthIndex, day);
  }

  private formatDate(monthIndex: number, day: number): string {
    const month = monthIndex + 1;
    return `${this.currentYear}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  }

  public onMonthClick(monthIndex: number): void {
    this.router.navigate([`/calendar/${this.currentYear}/${monthIndex + 1}`]);
  }

  public changeYear(delta: number): void {
    this.currentYear += delta;
    this.loadYearData();
    this.selectedDate = null;
  }
}
