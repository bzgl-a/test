import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CalendarService } from '../../../services/calendar/calendar.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LabelService } from '../../../services/label/label.service';
import { Subject, takeUntil } from 'rxjs';
import { ProductionCalendarService } from '../../../services/production-calendar/production-calendar.service';
import {
  EmployeeMonthAbsence,
  VacationRequestBody,
  VacationType,
} from '../../../models/model';

interface EmployeeMonthAbsenceVM {
  first_name: string;
  last_name: string;
  absenceColors: (string | null)[];
}

@Component({
  selector: 'app-month-calendar',
  imports: [],
  templateUrl: './month-calendar.component.html',
  styleUrl: './month-calendar.component.scss',
})
export class MonthCalendarComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();

  private labelService = inject(LabelService);
  private productionCalendarService = inject(ProductionCalendarService);

  public year = 0;
  public month = 0;
  public days: number[] = [];
  public employeesVM: EmployeeMonthAbsenceVM[] = [];
  public loading = false;
  public gridColumns = '';
  public isWeekend: boolean[] = [];

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private calendarService = inject(CalendarService);

  ngOnInit(): void {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.year = +params['year'];
      this.month = +params['month'] - 1;
      this.loadMonthData();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public loadMonthData(): void {
    this.loading = true;

    const daysInMonth = new Date(this.year, this.month + 1, 0).getDate();
    this.days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    this.isWeekend = this.productionCalendarService.buildDayOffArray(
      this.year,
      this.month,
      daysInMonth,
    );

    this.calendarService
      .getAbsencesOnMonth(this.year, this.month + 1)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.employeesVM = data.map((emp) =>
            this.mapEmployee(emp, daysInMonth),
          );
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        },
      });
  }

  public getDayOfWeek(day: number): string {
    const date = new Date(this.year, this.month, day);
    return this.labelService.weekDayShortNames[date.getDay()];
  }

  private mapEmployee(emp: EmployeeMonthAbsence, daysInMonth: number) {
    const absenceColors: (string | null)[] = new Array(daysInMonth).fill(null);

    emp.absences?.forEach((abs: VacationRequestBody) => {
      const start = new Date(abs.start_date);
      const end = new Date(abs.end_date);

      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        if (d.getMonth() === this.month && d.getFullYear() === this.year) {
          const dayIndex = d.getDate() - 1;
          absenceColors[dayIndex] = this.getAbsenceColor(abs.type);
        }
      }
    });

    return {
      first_name: emp.first_name,
      last_name: emp.last_name,
      absenceColors,
    };
  }

  public getAbsenceColor(absenceType: VacationType): string {
    switch (absenceType) {
      case 'vacation':
        return '#4caf50';
      case 'day_off':
        return '#ff9800';
    }
  }

  public onBack(): void {
    this.router.navigate(['/']);
  }

  public getMonthName(): string {
    return this.labelService.monthNames[this.month];
  }

  public navigateMonth(delta: number): void {
    const date = new Date(this.year, this.month, 1);
    date.setMonth(date.getMonth() + delta);
    this.router.navigate([
      `/calendar/${date.getFullYear()}/${date.getMonth() + 1}`,
    ]);
  }
}
