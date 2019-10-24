import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

import { Component, OnInit, Input } from '@angular/core';
import { NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, FormBuilder, FormGroup, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';


import { ApiService } from '../services/api.service';
import { TestConfigService } from '../shared/services/test-config.service';
import { AlertToastService } from '../../shared/services/alert-toast.service';

import { HeaderVal } from '../models/Header';
import { FormVal } from '../models/FormVal';
import { TestConfiguration } from '../models/TestConfiguration';
import { FileDetails } from '../models/FileDetails';
import { User } from '../../auth/shared/models/user';

import { MAX_SIZE } from '../../shared/constants';


@Component({
  selector: 'app-test-details',
  templateUrl: './test-details.component.html',
  styleUrls: ['./test-details.component.css'],
  providers: [ApiService]
})

export class TestDetailsComponent implements OnInit {

  // @Input() currentUser: User;

  backendUrl = 'https://localhost:44384/api/TestConfig';

  // form variables
  methods = ['GET', 'POST', 'UPDATE', 'DELETE'];
  selectedMethod = 'GET';
  baseurls = ['http://fakerestapi.azurewebsites.net', 'https://localhost:44384'
    , 'https://ccfilesapi-dev.compello.com'];
  basepaths = ['/api/Authors', '/api/TestConfig', '/api/files/UploadFile'];
  headerVals: HeaderVal[] = [
    { header: 'Content-Type', value: 'application/json' },
    { header: 'ConnectFilesApiKey', value: '	ZaY0tBwbuB' }
  ];
  formVals: FormVal[] = [
    { key: 'Name', value: 'Rajith' },
    { key: 'age', value: '24' }
  ];

  modalOptions: NgbModalOptions;
  testDetailsForm: FormGroup;
  testName: AbstractControl;
  fileUploaded: FileDetails;   // Uploaded file details
  responseJsonView: object = {};  // Response view in JSON format
  isFileAdded = false; // Whether file attached or not
  dataType: string = 'raw';
  currentUser: User;
  testConfigurations: TestConfiguration[];


  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private testConfigService: TestConfigService,
    public toastService: AlertToastService,
    private router: Router
  ) { }

  ngOnInit() {

    this.currentUser = JSON.parse(localStorage.getItem('socialusers'));
    this.formInitialize();

    this.testConfigService.getTestConfigs(this.backendUrl + '/user/' + this.currentUser.id).subscribe(tconfig => {
      this.testConfigurations = tconfig.body;
      console.log(this.testConfigurations);
    });

  }

  private formInitialize(): void {
    this.testDetailsForm = this.fb.group({
      endpointAction: [''],
      baseUrl: [''],
      basePath: [''],
      testName: [''],
      testDescription: [''],
      payloadHeaders: this.fb.group({
        header: [''],
        value: ['']
      }),
      formContent: this.fb.group({
        key: [''],
        value: ['']
      }),
      payloadBody: [''],
      fileKey: [''],
      response: [''],
      status: ['']
    });
  }
  get f() { return this.testDetailsForm.controls; } // get form controls

  OnClickExecute(isSave: boolean): void {
    const url = this.f.baseUrl.value + this.f.basePath.value;

    if (isSave) {
      let testConfig = new TestConfiguration(this.testDetailsForm.value);
      testConfig.payloadHeaders = this.headerVals;
      testConfig.formContent = this.formVals;
      testConfig.response = JSON.stringify(this.responseJsonView, undefined, 4);
      testConfig.file = this.fileUploaded;
      testConfig.userId = this.currentUser.id;
      this.testConfigService.postTestConfig(this.backendUrl, testConfig)
        .subscribe(res => {
        });

    } else {

      if (this.f.endpointAction.value === 'GET') {
        this.apiService.getData(url, this.headerVals).subscribe(res => {
          if (res.status === 200) {
            this.showSuccess('Request Successful');
          } else {
            this.showError('Request Unsuccessful');
          }
          this.responseJsonView = res.body;
          this.testDetailsForm.patchValue({
            status: res.status + '\r\n' + res.statusText
          });
        });

      } else if (this.f.endpointAction.value === 'POST') {
        let data: any = null;
        console.log(this.dataType);
        if (this.dataType === 'raw') {
          data = JSON.parse(this.f.payloadBody.value);

          if (this.isFileAdded) {
            data[this.f.fileKey.value] = this.fileUploaded.fileAsBase64;
          }

        } else if (this.dataType === 'form') {
          const formData = new FormData();
          this.formVals.forEach(f => {
            formData.append(f.key, f.value);
          });

          if (this.isFileAdded) {
            formData.append(this.f.fileKey.value, this.fileUploaded.fileAsBase64);
          }

          data = formData;
        }

        this.apiService.postData(url, data, this.headerVals).subscribe(res => {
          this.responseJsonView = res.body;
          this.testDetailsForm.patchValue({
            status: res.status + '\r\n' + res.statusText
          });
        });

      } else if (this.f.endpointAction.value === 'UPDATE') {
        let data = JSON.parse(this.f.payloadBody.value);
        this.apiService.updateData(url, data, this.headerVals).subscribe(res => {
          this.responseJsonView = res.body;
          this.testDetailsForm.patchValue({
            status: res.status + '\r\n' + res.statusText
          });
        });

      } else if (this.f.endpointAction.value === 'DELETE') {
        this.apiService.deleteData(url, this.headerVals).subscribe(res => {
          this.responseJsonView = res.body;
          this.testDetailsForm.patchValue({
            status: res.status + '\r\n' + res.statusText
          });
        });
      }
    }

  }


  OnClickAddHeader(): void {
    let h = this.f.payloadHeaders.get('header').value;
    let v = this.f.payloadHeaders.get('value').value;
    if (h != null && v != null) {
      this.headerVals.push({ header: h, value: v });
      this.testDetailsForm.get('payloadHeaders').patchValue({
        header: null,
        value: null
      });
    }
    console.log(this.headerVals);
  }

  OnClickRemoveHeader(): void {
    this.headerVals.pop();
  }

  OnClickAddFormVal(): void {
    let k = this.f.formContent.get('key').value;
    let v = this.f.formContent.get('value').value;
    if (k != null && v != null) {
      this.formVals.push({ key: k, value: v });
      this.testDetailsForm.get('formContent').patchValue({
        key: null,
        value: null
      });
    }
    console.log(this.formVals);
  }

  OnClickRemoveFormVal(): void {
    this.formVals.pop();
  }

  handleFileInput(files: FileList): void {
    let file: File = null;
    console.log(files);
    if (files && files.length > 0) {
      if (files[0].size < MAX_SIZE) {
        file = files[0];
        this.readFile(file);
      }
    }
  }

  private readFile(file: File): void {
    this.fileUploaded = new FileDetails();

    this.fileUploaded.name = file.name;
    this.fileUploaded.size = file.size;
    this.fileUploaded.type = file.type;

    const reader = new FileReader();

    reader.onload = () => {
      this.fileUploaded.fileAsBase64 = reader.result.toString();
      if (this.fileUploaded.fileAsBase64.includes(',')) {
        this.fileUploaded.fileAsBase64 = this.fileUploaded.fileAsBase64
          .substring(this.fileUploaded.fileAsBase64
            .indexOf(',') + 1);
      }
    };

    // Read the file
    reader.readAsDataURL(file);
    console.log(this.fileUploaded);
  }

  // File toggle switch changed
  toggleChange(): void {
    this.isFileAdded = !this.isFileAdded;
    console.log(this.isFileAdded);
  }

  // Type radio buttons changed
  dataTypeChanged(value: string): void {
    this.dataType = value;
    console.log(this.dataType);
  }

  showSuccess(message: string): void {
    this.toastService.show(message, {
      classname: 'bg-success text-light',
      delay: 5000,
      autohide: true,
      headertext: 'Toast Header'
    });
  }
  showError(message: string): void {
    this.toastService.show(message, {
      classname: 'bg-danger text-light',
      delay: 2000,
      autohide: true,
      headertext: 'Error!!!'
    });
  }

  showCustomToast(message: string): void {
    this.toastService.show(message, {
      classname: 'bg-info text-light',
      delay: 3000,
      autohide: true
    });
  }

}
