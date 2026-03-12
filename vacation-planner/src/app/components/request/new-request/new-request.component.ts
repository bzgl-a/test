import { Component, inject, OnDestroy, ViewChild } from '@angular/core';
import { LabelService } from '../../../services/label/label.service';
import {
  NgbDate,
  NgbDatepickerI18n,
  NgbDatepickerModule,
  NgbDropdownModule,
  NgbInputDatepicker,
} from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../../services/toast/toast.service';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { VacationRequestService } from '../../../services/vacation-request/vacation-request.service';
import { Subscription } from 'rxjs';
import { NgbDatepickerI18nRu } from '../../../i18n/datepicker-i18n-ru';
import { VacationRequestBody, VacationType } from '../../../models/model';

@Component({
  selector: 'app-new-request',
  imports: [
    NgbDatepickerModule,
    NgbDropdownModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './new-request.component.html',
  styleUrl: './new-request.component.scss',
  providers: [{ provide: NgbDatepickerI18n, useClass: NgbDatepickerI18nRu }],
})
export class NewRequestComponent implements OnDestroy {
  protected labelService = inject(LabelService);
  private toastService = inject(ToastService);
  private fb = inject(FormBuilder);
  private vacationRequestService = inject(VacationRequestService);

  public readonly minDate: NgbDate = new NgbDate(
    new Date().getFullYear(),
    new Date().getMonth() + 1,
    new Date().getDate(),
  );

  @ViewChild('datepicker') datepicker!: NgbInputDatepicker;

  private sendRequestSubscription: Subscription | undefined;

  public hoveredDate: NgbDate | null = null;

  public fromDate: NgbDate | null = null;
  public toDate: NgbDate | null = null;

  public vacationRequestForm = this.fb.group({
    startDate: [null as NgbDate | null, Validators.required],
    endDate: [null as NgbDate | null, Validators.required],
    vacationType: [null as VacationType | null, Validators.required],
    comment: [''],
  });

  ngOnDestroy(): void {
    this.sendRequestSubscription?.unsubscribe();
  }

  protected formatDateToInput(date: NgbDate | null): string {
    if (!date) return '';
    return `${date.day.toString().padStart(2, '0')}.${date.month.toString().padStart(2, '0')}.${date.year}`;
  }

  public onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
      this.vacationRequestForm.patchValue({ startDate: date });
    } else if (
      this.fromDate &&
      !this.toDate &&
      date &&
      (date.equals(this.fromDate) || date.after(this.fromDate))
    ) {
      this.toDate = date;
      this.vacationRequestForm.patchValue({ endDate: date });
      this.datepicker.close();
    } else {
      this.toDate = null;
      this.fromDate = date;
      this.vacationRequestForm.patchValue({
        startDate: date,
        endDate: null,
      });
    }
  }

  public isHovered(date: NgbDate) {
    return (
      this.fromDate &&
      !this.toDate &&
      this.hoveredDate &&
      date.after(this.fromDate) &&
      date.before(this.hoveredDate)
    );
  }

  public isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }

  public isRange(date: NgbDate) {
    return (
      date.equals(this.fromDate) ||
      (this.toDate && date.equals(this.toDate)) ||
      this.isInside(date) ||
      this.isHovered(date)
    );
  }

  public selectVacationType(value: VacationType): void {
    this.vacationRequestForm.patchValue({ vacationType: value });
  }

  public onSubmit(): void {
    if (this.vacationRequestForm.invalid) {
      this.toastService.danger('Заполните все поля');
      return;
    }

    const { startDate, endDate, vacationType, comment } =
      this.vacationRequestForm.value;

    const formatDate = (date: NgbDate): string  => {
      return `${date.year}-${date.month.toString().padStart(2, '0')}-${date.day.toString().padStart(2, '0')}`;
    };

    if (!startDate || !endDate || !vacationType) {
      return;
    }

    const requestData: VacationRequestBody = {
      start_date: formatDate(startDate),
      end_date: formatDate(endDate),
      type: vacationType,
      comment: comment || '',
    };

    this.sendRequestSubscription = this.vacationRequestService
      .setVacationRequest(requestData)
      .subscribe({
        next: () => {
          this.toastService.success('Заявка успешно создана');
          this.resetForm();
        },
        error: (err) => {
          if (err.error.error === 'Not enough vacation days') {
            this.toastService.danger(
              `Доступное количество дней - ${err.error.details.available}, запрашиваемое - ${err.error.details.requested}`,
            );
          } else {
            this.toastService.danger('Ошибка при создании заявки');
          }
        },
      });
  }

  private resetForm() {
    this.vacationRequestForm.reset();
    this.fromDate = null;
    this.toDate = null;
  }
}
