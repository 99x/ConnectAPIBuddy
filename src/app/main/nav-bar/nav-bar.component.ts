import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { SocialLoginModule, AuthServiceConfig, AuthService } from 'angular-6-social-login';

import { TestSettingsComponent } from '../test-settings/test-settings.component';
import { TestDetailsComponent } from '../test-details/test-details.component';

import { User } from '../../auth/shared/models/user';

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


  constructor(
    private modalService: NgbModal,
    public OAuth: AuthService,
    private router: Router
  ) {
    this.modalOptions = {
      backdrop: 'static',
      backdropClass: 'customBackdrop',
      size: 'lg'
    };
  }

  ngOnInit() {
  }

  Logout() {
    alert('All unsaved data will be lost');
    localStorage.removeItem('socialusers');
    this.OAuth.signOut().then(data => {
      this.router.navigate([`/login`]);
    });
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
