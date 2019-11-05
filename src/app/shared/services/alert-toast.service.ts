import { Injectable, TemplateRef } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AlertToastService {

  toasts: any[] = [];

  // Push new Toasts to array with content and options
  show(textOrTpl: string | TemplateRef<any>, options: any = {}) {
    this.toasts.push({ textOrTpl, ...options });
  }

  // Callback method to remove Toast DOM element from view
  remove(toast) {
    this.toasts = this.toasts.filter(t => t !== toast);
  }

  showSuccess(message: string): void {
    this.show(message, {
      classname: 'bg-success text-light',
      delay: 3000,
      autohide: true,
      headertext: 'Toast Header'
    });
  }
  showError(message: string): void {
    this.show(message, {
      classname: 'bg-danger text-light',
      delay: 5000,
      autohide: true,
      headertext: 'Error!!!'
    });
  }

  showCustomToast(message: string): void {
    this.show(message, {
      classname: 'bg-info text-light',
      delay: 3000,
      autohide: true
    });
  }
}
