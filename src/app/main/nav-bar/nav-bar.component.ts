import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { TestSettingsComponent } from '../test-settings/test-settings.component';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup } from '@angular/forms';

import { TestDetailsComponent } from '../test-details/test-details.component';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {

  private modalOptions: NgbModalOptions;
  private form: FormGroup;
  t: TestDetailsComponent;
  selectedTenant = 'Localhost';


  constructor(private modalService: NgbModal) {
    this.modalOptions = {
      backdrop: 'static',
      backdropClass: 'customBackdrop',
      size: 'lg'
    };
  }

  ngOnInit() {
  }

  open() {
    const modalRef = this.modalService.open(TestSettingsComponent, this.modalOptions);
    modalRef.componentInstance.modalTitle = 'Settings';
    modalRef.componentInstance.modalContent = '';
  }

  newClick(): void {
    this.t.testDetailsForm.reset();
  }
}
