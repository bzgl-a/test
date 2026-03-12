import { Injectable } from '@angular/core';
import { Observable, shareReplay, catchError, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { User } from '../../models/model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly API_URL: string = environment.apiUrl;

  private self$: Observable<User | null> | null = null;

  constructor(private http: HttpClient) {}

  getSelf(): Observable<User | null> {
    if (this.self$) {
      return this.self$;
    }

    this.self$ = this.http.get<User>(`${this.API_URL}/users/self`).pipe(
      shareReplay(1),
      catchError(() => {
        this.self$ = null;
        return of(null);
      }),
    );

    return this.self$;
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.API_URL}/users`);
  }

  public clearUserCache(): void {
    this.self$ = null;
  }
}
