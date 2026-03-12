import { Component } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastService } from '../../services/toast/toast.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  public loginForm: FormGroup;
  public isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private toastService: ToastService,
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  get username() {
    return this.loginForm.get('username')!;
  }
  get password() {
    return this.loginForm.get('password')!;
  }

  onSubmit() {
    if (this.loginForm.invalid) return;

    this.isLoading = true;

    const { username, password } = this.loginForm.value;

    this.authService.logIn({ login: username, password }).subscribe({
      next: (res) => {
        localStorage.setItem('vacation-planner-access_token', res.token);

        const next = this.route.snapshot.queryParamMap.get('next');
        this.router.navigateByUrl(next || '/calendar');
      },
      error: (err: HttpErrorResponse) => {
        if (err.status === 401) {
          this.toastService.danger('Неверные данные');
        }
        this.isLoading = false;
      },
    });
  }
}
