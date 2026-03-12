import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { UserService } from '../user/user.service';
import { AuthResponse, UserLogin } from '../../models/model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private userService = inject(UserService);

  private readonly API_URL: string = environment.apiUrl;

  logIn(user: UserLogin) {
    return this.http.post<AuthResponse>(`${this.API_URL}/auth`, user);
  }

  logOut() {
    localStorage.removeItem('vacation-planner-access_token');
    this.userService.clearUserCache();
    this.router.navigateByUrl('/login');
  }

  getToken(): string | null {
    return localStorage.getItem('vacation-planner-access_token');
  }

  getSelfLogin(): string | null {
    const token = this.getToken();
    if (!token) {
      return null;
    }

    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        return null;
      }

      const payloadBase64 = parts[1];

      const paddedBase64 = payloadBase64.replace(/-/g, '+').replace(/_/g, '/');

      const payloadJson = atob(paddedBase64);
      const payload = JSON.parse(payloadJson);
      return payload.sub;
    } catch (e) {
      return null;
    }
  }
}
