import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserService } from '../../../services/user/user.service';

import { AccessControlService } from '../../../services/access-control/access-control.service';
import { SidebarItem, User } from '../../../models/model';

@Component({
  selector: 'app-side-menu',
  imports: [RouterLink, RouterLinkActive],
  standalone: true,
  templateUrl: './side-menu.html',
  styleUrl: './side-menu.scss',
})
export class SideMenu implements OnInit, OnDestroy {
  private userService = inject(UserService);
  private accessControlService = inject(AccessControlService);

  private getSelfSubscription: Subscription | undefined;

  public user: User | null = null;

  public sidebar: SidebarItem[] = [];

  ngOnInit(): void {
    this.getSelfSubscription = this.userService.getSelf().subscribe({
      next: (user) => {
        if (user) {
          this.sidebar = this.getSidebarItems(user);
        } else {
          this.sidebar = [];
        }
      },
      error: () => {
        this.user = null;
        this.sidebar = [];
      },
    });
  }

  ngOnDestroy(): void {
    this.getSelfSubscription?.unsubscribe();
  }

  private getSidebarItems(user: User) {
    return [
      {
        link: '/calendar',
        icon: 'bi-calendar2-date',
        label: 'Календарь',
        hasRights: this.accessControlService.canReadVacations(user),
      },
      {
        link: '/users',
        icon: 'bi bi-person',
        label: 'Список сотрудников',
        hasRights: this.accessControlService.canReadVacations(user),
      },
      {
        link: '/requests',
        icon: 'bi bi-card-list',
        label: 'Заявки отдела',
        hasRights: this.accessControlService.canReadVacations(user),
      },
      {
        link: '/managing',
        icon: 'bi bi-card-checklist',
        label: 'Рассмотрение заявок',
        hasRights: this.accessControlService.canManageVacations(user),
      },
    ];
  }
}
