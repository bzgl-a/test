import { Routes } from '@angular/router';
import { YearCalendar } from './components/calendar/year-calendar/year-calendar';
import { Login } from './components/login/login';
import { authGuard } from './guards/auth-guard';
import { MainLayout } from './layouts/main-layout/main-layout';
import { NewRequestComponent } from './components/request/new-request/new-request.component';
import { RequestsForEmployeeComponent } from './components/request/requests-for-employee/requests-for-employee.component';
import { RequestsForManagerComponent } from './components/request/requests-for-manager/requests-for-manager.component';
import { MonthCalendarComponent } from './components/calendar/month-calendar/month-calendar.component';
import { UsersListComponent } from './components/users-list/users-list.component';

export const routes: Routes = [
  {
    path: 'login',
    component: Login,
  },

  {
    path: '',
    component: MainLayout,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'calendar', pathMatch: 'full' },
      { path: 'new-request', component: NewRequestComponent },
      { path: 'calendar', component: YearCalendar },
      { path: 'calendar/:year/:month', component: MonthCalendarComponent },
      { path: 'requests', component: RequestsForEmployeeComponent },
      { path: 'managing', component: RequestsForManagerComponent },
      { path: 'users', component: UsersListComponent },
    ],
  },

  { path: '**', redirectTo: '/login' },
];
