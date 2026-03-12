import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserService } from '../../services/user/user.service';
import { ToastService } from '../../services/toast/toast.service';
import { User } from '../../models/model';

@Component({
  selector: 'app-users-list',
  imports: [],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.scss',
})
export class UsersListComponent implements OnInit, OnDestroy {
  private userService = inject(UserService);
  private toastService = inject(ToastService);

  private usersSub: Subscription | undefined;

  public users: User[] = [];

  ngOnInit(): void {
    this.usersSub = this.userService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
      },
      error: () => {
        this.toastService.danger('Не удалось загрузить пользователей');
      },
    });
  }

  ngOnDestroy(): void {
    this.usersSub?.unsubscribe();
  }
}
