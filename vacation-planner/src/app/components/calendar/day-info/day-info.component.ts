import {
  Component,
  inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { CalendarService } from '../../../services/calendar/calendar.service';
import { LabelService } from '../../../services/label/label.service';
import { AbsenceInfo } from '../../../models/model';

@Component({
  selector: 'app-day-info',
  imports: [],
  templateUrl: './day-info.component.html',
  styleUrl: './day-info.component.scss',
})
export class DayInfoComponent implements OnInit, OnChanges, OnDestroy {
  @Input() chosenDay: string = '';

  public currentData: Date = new Date();

  public dayInfo: AbsenceInfo[] = [];

  private dayAbsencesSub: Subscription | undefined;

  private calendarService = inject(CalendarService);
  protected labelService = inject(LabelService);

  ngOnInit(): void {
    if (this.chosenDay) {
      this.loadDayInfo();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['chosenDay'] && this.chosenDay) {
      this.loadDayInfo();
    }
  }

  private loadDayInfo(): void {
    this.dayAbsencesSub?.unsubscribe();
    this.dayAbsencesSub = this.calendarService
      .getAbsencesOnDay(this.chosenDay)
      .subscribe({
        next: (data) => {
          this.dayInfo = data;
        },
        error: () => {},
      });
  }

  ngOnDestroy(): void {
    this.dayAbsencesSub?.unsubscribe();
  }

  public formatDate(dateString: string): string {
    if (!dateString) return '';

    const date = new Date(dateString);

    const months = [
      'января',
      'февраля',
      'марта',
      'апреля',
      'мая',
      'июня',
      'июля',
      'августа',
      'сентября',
      'октября',
      'ноября',
      'декабря',
    ];

    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return `${day} ${month} ${year}`;
  }

  public convertDate(start_date: Date, end_date: Date) {
    const start = new Date(start_date);
    const end = new Date(end_date);

    const format = (date: Date): string => {
      const day = date.getDate();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      return `${day}.${month}`;
    };

    if (start.toDateString() === end.toDateString()) {
      return format(start);
    }

    return `${format(start)} — ${format(end)}`;
  }

  public getInitials(lastName: string, firstName: string): string {
    if (!lastName && !firstName) {
      return '';
    }

    return (lastName[0] || '') + (firstName[0] || '');
  }
}
