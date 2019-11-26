// angular
import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { SocialLoginModule, AuthServiceConfig, AuthService } from 'angular-6-social-login';
// components
import { TestSettingsComponent } from '../test-settings/test-settings.component';
import { TestDetailsComponent } from '../test-details/test-details.component';
// models
import { User } from '../../auth/shared/models/user';
import { TestConfiguration } from '../models/TestConfiguration';
import { TestSettings } from '../models/TestSettings';
// services
import{ AlertToastService } from '../../shared/services/alert-toast.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {
  @Output() settingEvent = new EventEmitter<TestSettings>();
  @Output() newClickEvent = new EventEmitter();
  @Output() importClickEvent = new EventEmitter<TestConfiguration>()

  testSettings = new TestSettings();
  testConfigIn;
  private modalOptions: NgbModalOptions;
  private form: FormGroup;
  t: TestDetailsComponent;
  tenants = ['Localhost', 'www.Connect.com'];
  selectedTenant = 'Localhost';


  constructor(
    private modalService: NgbModal,
    public OAuth: AuthService,
    private router: Router,
    private toastService: AlertToastService
  ) {
    this.modalOptions = {
      backdrop: 'static',
      backdropClass: 'customBackdrop',
      size: 'lg'
    };
  }

  ngOnInit() {
  }

  logout(): void {
    alert('All unsaved data will be lost');
    localStorage.clear();
    if (this.OAuth.authState !== null) {
      this.OAuth.signOut();
    }
    this.router.navigate([`/login`]);
  }

  openModal(): void {
    const modalRef = this.modalService.open(TestSettingsComponent, this.modalOptions);
    modalRef.componentInstance.modalTitle = 'Settings';
    modalRef.componentInstance.testSettings = this.testSettings;

    modalRef.result.then((result) => {
      if (result) {
        this.testSettings = result;
        this.settingEvent.emit(this.testSettings);
      }
    });
  }

  newClick(): void {
    this.newClickEvent.emit();
  }

  handleFileImport(event) {
    try {
      let file = event[0];
      let fileReader = new FileReader();
      fileReader.onload = (e) => {
        this.testConfigIn = new TestConfiguration(JSON.parse(fileReader.result.toString()));
        this.importClickEvent.emit(this.testConfigIn);
      }
      fileReader.readAsText(file);

    } catch{
      this.toastService.showError('Import Unsuccssful');
    }

  }
}
