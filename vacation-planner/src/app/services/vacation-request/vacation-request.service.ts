import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  EmployeeRequests,
  ManagerRequests,
  VacationRequestBody,
} from '../../models/model';

@Injectable({
  providedIn: 'root',
})
export class VacationRequestService {
  private readonly API_URL: string = environment.apiUrl;

  constructor(private http: HttpClient) {}

  setVacationRequest(body: VacationRequestBody): Observable<void> {
    return this.http.post<void>(`${this.API_URL}/vacations`, body);
  }

  getAllVacationRequests(
    year: number = new Date().getFullYear(),
  ): Observable<EmployeeRequests> {
    const params = new HttpParams().set('year', year.toString());
    return this.http.get<EmployeeRequests>(
      `${this.API_URL}/vacations/requests`,
      { params },
    );
  }

  getVacationRequestsForManager(
    year: number = new Date().getFullYear(),
  ): Observable<ManagerRequests> {
    const params = new HttpParams().set('year', year.toString());
    return this.http.get<ManagerRequests>(
      `${this.API_URL}/vacations/manager-requests`,
      {
        params,
      },
    );
  }

  approveVacationRequest(requestId: number): Observable<void> {
    return this.http.post<void>(
      `${this.API_URL}/vacations/${requestId}/approve`,
      {},
    );
  }

  rejectVacationRequest(
    requestId: number,
    rejectReason: string = '',
  ): Observable<void> {
    return this.http.post<void>(
      `${this.API_URL}/vacations/${requestId}/reject`,
      { rejectReason },
    );
  }
}
