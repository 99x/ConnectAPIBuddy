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

  showSuccessMessage(message: string): void {
    let options = {
      classname: 'bg-success text-light',
      delay: 5000,
      autohide: true,
      headertext: 'Toast Header'
    };
    this.toasts.push({ message, options });
  }
}
