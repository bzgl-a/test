import { Component, inject } from '@angular/core';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { RequestsListComponent } from '../requests-list/requests-list.component';
import { VacationRequestService } from '../../../services/vacation-request/vacation-request.service';
import { ToastService } from '../../../services/toast/toast.service';
import { Subscription } from 'rxjs';
import { ArchiveRequestInfo, PendingRequestInfo } from '../../../models/model';

@Component({
  selector: 'app-requests-for-manager',
  imports: [NgbNavModule, RequestsListComponent],
  templateUrl: './requests-for-manager.component.html',
  styleUrl: './requests-for-manager.component.scss',
})
export class RequestsForManagerComponent {
  public active = 1;

  public currentYear: number = new Date().getFullYear();

  private vacationRequestService = inject(VacationRequestService);
  private toastService = inject(ToastService);

  private getManagingRequestsSubscription: Subscription | undefined;

  public pendingRequests: PendingRequestInfo[] = [];
  public archiveRequests: ArchiveRequestInfo[] = [];

  ngOnInit(): void {
    this.loadRequests();
  }

  ngOnDestroy(): void {
    this.getManagingRequestsSubscription?.unsubscribe();
  }

  loadRequests() {
    this.getManagingRequestsSubscription?.unsubscribe();
    this.getManagingRequestsSubscription = this.vacationRequestService
      .getVacationRequestsForManager(this.currentYear)
      .subscribe({
        next: (data) => {
          this.pendingRequests = data.pendingRequests;
          this.archiveRequests = data.archiveRequests;
        },
        error: () => {
          this.toastService.danger('Ошибка при обновлении данных');
        },
      });
  }

  onYearChange(delta: number) {
    this.currentYear += delta;
    this.loadRequests();
  }
}
