import { Component, TemplateRef } from '@angular/core';
import { AlertToastService } from '../../services/alert-toast.service';

@Component({
  selector: 'app-alert-toast',
  templateUrl: './alert-toast.component.html',
  styleUrls: ['./alert-toast.component.css'],
  // tslint:disable-next-line: no-host-metadata-property
  host: { '[class.ngb-toasts]': 'true' }
})
export class AlertToastComponent {

  constructor(public toastService: AlertToastService) { }

  isTemplate(toast) { return toast.textOrTpl instanceof TemplateRef; }

}
