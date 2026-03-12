import { Component, inject, input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserService } from '../../../services/user/user.service';
import { AuthService } from '../../../services/auth/auth.service';
import { User } from '../../../models/model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-top-bar',
  imports: [],
  standalone: true,
  templateUrl: './top-bar.html',
  styleUrl: './top-bar.scss',
})
export class TopBar implements OnInit, OnDestroy {
  private router = inject(Router);

  private getSelfSubscription: Subscription | undefined;

  public user: User | null = null;

  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.getSelfSubscription = this.userService.getSelf().subscribe((user) => {
      this.user = user;
    });
  }

  ngOnDestroy(): void {
    this.getSelfSubscription?.unsubscribe();
  }

  public onClickLogout() {
    this.authService.logOut();
  }

  public onLogoClick(): void {
    this.router.navigate(['/']);
  }
}
