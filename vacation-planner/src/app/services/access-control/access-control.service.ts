import { Injectable } from '@angular/core';
import { User } from '../../models/model';

@Injectable({
  providedIn: 'root',
})
export class AccessControlService {
  public canManageVacations(user: User): boolean {
    return user.role === 'manager';
  }

  public canReadVacations(user: User): boolean {
    return user.role === 'employee' || user.role === 'manager';
  }
}
