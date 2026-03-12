import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AbsenceInfo, EmployeeMonthAbsence } from '../../models/model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CalendarService {
  private readonly API_URL: string = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getYearLoad(year: number): Observable<Record<string, number>> {
    return this.http.get<Record<string, number>>(
      `${this.API_URL}/absences/calendar/${year}`,
    );
  }

  getAbsencesOnDay(date: string): Observable<AbsenceInfo[]> {
    return this.http.get<AbsenceInfo[]>(`${this.API_URL}/absences/day/${date}`);
  }

  getAbsencesOnMonth(
    year: number,
    month: number,
  ): Observable<EmployeeMonthAbsence[]> {
    return this.http.get<EmployeeMonthAbsence[]>(
      `${this.API_URL}/absences/month/${year}/${month}`,
    );
  }
}
