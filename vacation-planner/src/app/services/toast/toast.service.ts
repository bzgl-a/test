import { Injectable } from '@angular/core';
import { Toast } from '../../models/model';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private nextId = 1;
  toasts: Toast[] = [];

  success(message: string) {
    this.add(message, 'success');
  }

  danger(message: string) {
    this.add(message, 'danger');
  }

  info(message: string) {
    this.add(message, 'info');
  }

  private add(message: string, type: Toast['type']) {
    const id = this.nextId++;
    this.toasts = [...this.toasts, { id, message, type }];

    setTimeout(() => {
      this.remove(id);
    }, 3000);
  }

  remove(id: number) {
    this.toasts = this.toasts.filter((t) => t.id !== id);
  }
}
