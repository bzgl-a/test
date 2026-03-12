// src/app/datepicker-i18n-ru.ts
import { Injectable } from '@angular/core';
import { NgbDatepickerI18n } from '@ng-bootstrap/ng-bootstrap';

const I18N_VALUES = {
  ru: {
    weekdays: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
    months: [
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
    ],
  },
};

@Injectable()
export class NgbDatepickerI18nRu extends NgbDatepickerI18n {
  getWeekdayLabel(weekday: number): string {
    return I18N_VALUES.ru.weekdays[weekday - 1];
  }

  getWeekdayShortName(weekday: number): string {
    return I18N_VALUES.ru.weekdays[weekday - 1];
  }

  getMonthShortName(month: number): string {
    return I18N_VALUES.ru.months[month - 1];
  }

  getMonthFullName(month: number): string {
    return this.getMonthShortName(month);
  }

  getDayAriaLabel(date: { year: number; month: number; day: number }): string {
    return `${date.day}.${date.month}.${date.year}`;
  }
}
