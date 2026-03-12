import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { LabelService } from '../../../services/label/label.service';
import { VacationRequestService } from '../../../services/vacation-request/vacation-request.service';
import { ToastService } from '../../../services/toast/toast.service';
import { Subscription } from 'rxjs';
import { NgbModal, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { RejectRequestModalComponent } from '../reject-request-modal/reject-request-modal.component';
import { ConfirmationService } from '../../../services/confirmation/confirmation.service';
import {
  ArchiveRequestInfo,
  PendingRequestInfo,
  UserRequestInfo,
} from '../../../models/model';

@Component({
  selector: 'app-requests-list',
  imports: [DatePipe, NgbTooltip],
  templateUrl: './requests-list.component.html',
  styleUrl: './requests-list.component.scss',
})
export class RequestsListComponent implements OnDestroy {
  protected labelService = inject(LabelService);
  private vacationRequestService = inject(VacationRequestService);
  private toastService = inject(ToastService);
  private modalService = inject(NgbModal);
  private confirmationService = inject(ConfirmationService);

  private approveSub?: Subscription;
  private rejectSub?: Subscription;

  @Input() vacationRequests: any = [];
  @Input() showUserNames: boolean = false;
  @Input() showActions: boolean = false;
  @Input() currentYear: number = new Date().getFullYear();

  @Output() requestProcessed = new EventEmitter<void>();
  @Output() yearChanged = new EventEmitter<number>();

  ngOnDestroy() {
    this.approveSub?.unsubscribe();
    this.rejectSub?.unsubscribe();
  }

  public onApprove(id: number) {
    this.confirmationService
      .confirmAction('Вы уверены, что хотите одобрить заявку?', 'approve')
      .then((confirmed) => {
        if (!confirmed) return;

        this.approveSub = this.vacationRequestService
          .approveVacationRequest(id)
          .subscribe({
            next: () => {
              this.toastService.success('Заявка одобрена');
              this.requestProcessed.emit();
            },
            error: () => {
              this.toastService.danger('Ошибка при одобрении');
            },
          });
      });
  }

  async onReject(id: number) {
    const modalRef = this.modalService.open(RejectRequestModalComponent);

    try {
      const reason = await modalRef.result;
      if (reason) {
        this.rejectSub = this.vacationRequestService
          .rejectVacationRequest(id, reason)
          .subscribe({
            next: () => {
              this.toastService.success('Заявка отклонена');
              this.requestProcessed.emit();
            },
            error: (err) => {
              const message =
                err?.error?.error || 'Ошибка при отклонении заявки';
              this.toastService.danger(message);
            },
          });
      }
    } catch (dismissed) {}
  }

  public changeYear(delta: number): void {
    this.yearChanged.emit(delta);
  }
}
