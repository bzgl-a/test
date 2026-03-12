import { Injectable } from '@angular/core';
import {
  VacationStatus,
  VacationType,
  VacationTypeOption,
} from '../../models/model';

@Injectable({
  providedIn: 'root',
})
export class LabelService {
  public readonly vacationTypes: VacationTypeOption[] = [
    { value: 'vacation', label: 'Отпуск' },
    { value: 'day_off', label: 'Отгул' },
  ];

  private readonly vacationTypeLabels: Record<VacationType, string> = {
    vacation: 'Отпуск',
    day_off: 'Отгул',
  };

  private readonly vacationStatusLabels: Record<VacationStatus, string> = {
    approved: 'Одобрено',
    rejected: 'Отклонено',
    pending: 'На рассмотрении',
  };

  public getVacationTypeLabel(type: string): string {
    return this.vacationTypeLabels[type as VacationType] ?? '—';
  }

  public getVacationStatusLabel(status: string): string {
    return this.vacationStatusLabels[status as VacationStatus] ?? '—';
  }

  public readonly weekDayShortNames = [
    'Вс',
    'Пн',
    'Вт',
    'Ср',
    'Чт',
    'Пт',
    'Сб',
  ];

  public readonly monthNames = [
    'Январь',
    'Февраль',
    'Март',
    'Апрель',
    'Май',
    'Июнь',
    'Июль',
    'Август',
    'Сентябрь',
    'Октябрь',
    'Ноябрь',
    'Декабрь',
  ];
}
