import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { RequestsListComponent } from '../requests-list/requests-list.component';
import { VacationRequestService } from '../../../services/vacation-request/vacation-request.service';
import { Subscription } from 'rxjs';
import { UserRequestInfo, ArchiveRequestInfo } from '../../../models/model';

@Component({
  selector: 'app-requests-for-employee',
  imports: [NgbNavModule, RequestsListComponent],
  templateUrl: './requests-for-employee.component.html',
  styleUrl: './requests-for-employee.component.scss',
})
export class RequestsForEmployeeComponent implements OnInit, OnDestroy {
  private vacationRequestService = inject(VacationRequestService);

  private getSelfRequestsSubscription: Subscription | undefined;

  public active = 1;

  public currentYear: number = new Date().getFullYear();

  public myVacationRequests: UserRequestInfo[] = [];
  public teamVacationRequests: ArchiveRequestInfo[] = [];

  ngOnInit(): void {
    this.loadRequests();
  }

  ngOnDestroy(): void {
    this.getSelfRequestsSubscription?.unsubscribe();
  }

  private loadRequests() {
    this.getSelfRequestsSubscription = this.vacationRequestService
      .getAllVacationRequests(this.currentYear)
      .subscribe({
        next: (req) => {
          this.myVacationRequests = req.myRequests;
          this.teamVacationRequests = req.teamRequests;
        },
        error: () => {},
      });
  }

  onYearChange(delta: number) {
    this.currentYear += delta;
    this.loadRequests();
  }
}
