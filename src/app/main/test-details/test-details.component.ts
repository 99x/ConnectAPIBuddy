// rxjs
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
// angular
import { Component, OnInit, Input } from '@angular/core';
import { NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, FormBuilder, FormGroup, AbstractControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { saveAs } from 'file-saver';
// components
import { NavBarComponent } from '../nav-bar/nav-bar.component';
// services
import { ApiService } from '../services/api.service';
import { TestConfigService } from '../shared/services/test-config.service';
import { AlertToastService } from '../../shared/services/alert-toast.service';
// models
import { HeaderVal } from '../models/Header';
import { FormVal } from '../models/FormVal';
import { TestConfiguration } from '../models/TestConfiguration';
import { FileDetails } from '../models/FileDetails';
import { User } from '../../auth/shared/models/user';
import { TestSettings } from '../models/TestSettings';
// constants
import { MAX_SIZE } from '../../shared/constants';



@Component({
  selector: 'app-test-details',
  templateUrl: './test-details.component.html',
  styleUrls: ['./test-details.component.css'],
  providers: [ApiService]
})

export class TestDetailsComponent implements OnInit {

  backendUrl = 'https://connectapibuddy.azurewebsites.net/api/TestConfig';   // 'https://localhost:44384/api/TestConfig';

  // form variables
  methods = ['GET', 'POST', 'UPDATE', 'DELETE'];
  urls: object[] = [];
  baseurls: string[] = [];
  basepaths: string[] = [];

  headerVals: HeaderVal[] = [];
  formVals: FormVal[] = [];

  modalOptions: NgbModalOptions;
  testDetailsForm: FormGroup;
  testName: AbstractControl;
  fileUploaded: FileDetails;   // Uploaded file details
  responseJsonView: object = {};  // Response view in JSON format
  isFileAdded = false; // Whether file attached or not
  dataType: string = 'raw';  // defult seleted tab
  currentUser: User;
  testConfigurations: TestConfiguration[];
  currentTestConfig: TestConfiguration;
  testSettings = new TestSettings();
  urlStatus: boolean = true;
  selectedTestConfigs: TestConfiguration[] = [];
  selectedTabIndex = 0;
  multiple = false;


  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private testConfigService: TestConfigService,
    public toastService: AlertToastService,
    private router: Router
  ) { }

  ngOnInit() {

    this.currentUser = JSON.parse(localStorage.getItem('socialusers'));

    this.testConfigService.getTestConfigs(this.currentUser.id).subscribe(tconfig => {
      if (tconfig !== null) {
        this.testConfigurations = tconfig;
        console.log(this.testConfigurations);
        this.testConfigurations.forEach(x => {
          this.urls.push({ url: x.url, method: x.endpointAction });
          this.baseurls.push(x.baseUrl);
          this.basepaths.push(x.basePath);
        });
      } else {
        this.toastService.showError('Couldn\'t retrive Test configurations.');
      }

    });

    this.formInitialize();
  }

  /***************************************** Test Details form ****************************************/
  private formInitialize(): void {
    this.testDetailsForm = this.fb.group({
      url: [null, Validators.required],
      endpointAction: [Validators.required],
      baseUrl: ['', Validators.required],
      basePath: ['', Validators.required],
      testName: ['', Validators.required],
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

  onClickExecute(isSave: boolean): void {
    const url = this.f.url.value;
    /***************************************** Save current Test  ****************************************/
    if (isSave) {
      if (!this.testDetailsForm.valid) {
        this.toastService.showError('Enter all required fileds');
      } else {
        let testConfig = new TestConfiguration(this.testDetailsForm.value);
        testConfig.payloadHeaders = this.headerVals;
        testConfig.formContent = this.formVals;
        testConfig.response = JSON.stringify(this.responseJsonView, undefined, 4);
        testConfig.file = this.fileUploaded;
        testConfig.userId = this.currentUser.id;
        this.testConfigService.postTestConfig(testConfig)
          .subscribe(res => {
            if (res !== null) {
              this.toastService.showSuccess('Successfully Saved');
              this.testConfigurations = [...this.testConfigurations, res];
              this.urls.push({ url: res.url, method: res.endpointAction });
              this.baseurls.push(res.baseUrl);
              this.basepaths.push(res.basePath);
            } else {
              this.toastService.showError('failed');
            }
          });
      }

    } else {
      /***************************************** HTTP default mehods  ****************************************/
      if (this.f.url.value === null) {
        this.toastService.showError('Enter a URL...');
      } else if (this.f.endpointAction.value === null) {
        this.toastService.showError('Select a Http Method');
      } else {
        if (this.headerVals.length === 0) {
          this.headerVals.push({ header: 'Content-Type', value: 'application/json' });
        }
        if (this.f.endpointAction.value === 'GET') {
          this.apiService.getData(url, this.headerVals, this.testSettings).subscribe(res => {
            if (res.status === 200) {
              this.toastService.showSuccess('Request Successful');
            } else {
              this.toastService.showError('Request Unsuccessful');
            }
            this.responseJsonView = res.body;
            this.testDetailsForm.patchValue({
              status: res.status
            });
          });

        } else if (this.f.endpointAction.value === 'POST') {
          let data: any = null;
          console.log(this.dataType);
          if (this.selectedTabIndex === 0) {
            data = JSON.parse(this.f.payloadBody.value);

            if (this.isFileAdded) {
              data[this.f.fileKey.value] = this.fileUploaded.fileAsBase64;
            }

          } else if (this.selectedTabIndex === 1) {
            const formData = new FormData();
            this.formVals.forEach(f => {
              formData.append(f.key, f.value);
            });

            if (this.isFileAdded) {
              formData.append(this.f.fileKey.value, this.fileUploaded.fileAsBase64);
            }

            data = formData;
          }

          this.apiService.postData(url, data, this.headerVals, this.testSettings).subscribe(res => {
            if (res.status === 200) {
              this.toastService.showSuccess('Request Successful');
            } else {
              this.toastService.showError('Request Unsuccessful');
            }
            this.responseJsonView = res.body;
            this.testDetailsForm.patchValue({
              status: res.status
            });
          });

        } else if (this.f.endpointAction.value === 'UPDATE') {
          let data = JSON.parse(this.f.payloadBody.value);
          this.apiService.updateData(url, data, this.headerVals, this.testSettings).subscribe(res => {
            if (res.status === 200) {
              this.toastService.showSuccess('Request Successful');
            } else {
              this.toastService.showError('Request Unsuccessful');
            }
            this.responseJsonView = res.body;
            this.testDetailsForm.patchValue({
              status: res.status
            });
          });

        } else if (this.f.endpointAction.value === 'DELETE') {
          this.apiService.deleteData(url, this.headerVals, this.testSettings).subscribe(res => {
            if (res.status === 200) {
              this.toastService.showSuccess('Request Successful');
            } else {
              this.toastService.showError('Request Unsuccessful');
            }
            this.responseJsonView = res.body;
            this.testDetailsForm.patchValue({
              status: res.status
            });
          });
        }
      }
    }


  }

  onClickExport(i: number): void {
    let serializedString;
    let blob;
    switch (i) {
      case 1:
        if (this.currentTestConfig !== null) {
          serializedString = JSON.stringify(this.currentTestConfig);
          blob = new Blob([serializedString], { type: 'application/json' });
          saveAs(blob, this.currentTestConfig.testName + this.currentTestConfig.id + '.json');
        }


        break;

      case 2:
        if (this.selectedTestConfigs.length > 0) {
          this.selectedTestConfigs.forEach(t => {
            serializedString = JSON.stringify(t);
            blob = new Blob([serializedString], { type: 'application/json' });
            saveAs(blob, t.testName + t.id + '.json');
          });
        }

        break;

      case 3:
        break;

      default:
        break;
    }
  }

  /***************************************** Input Headers  ****************************************/
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

  /***************************************** Input Form values  ****************************************/
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

  /******************************************* Attach a file *********************************************/
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
    this.toastService.showSuccess('File added');
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

  OnClickOption(i) {
    console.log('clicked' + i);
  }

  urlOnChanged(i: number, event?): void {

    if (i === 1) {
      let cUrl = event.target.value;
      this.testDetailsForm.reset();
      this.responseJsonView = null;
      let split = this.SplitedUrl(cUrl);
      this.testDetailsForm.patchValue({
        url: cUrl,
        baseUrl: split[0],
        basePath: split[1]
      });

    } else if (i === 2) {
      // console.log(event.target.selectedIndex);
      // let testIndex = event.target.selectedIndex;
      // this.currentTestConfig = event;
      // if (this.currentTestConfig !== null && event !== undefined) {
      //   this.testDetailsForm.reset();
      //   this.testDetailsForm.patchValue({
      //     url: this.currentTestConfig.url,
      //     baseUrl: this.currentTestConfig.baseUrl,
      //     basePath: this.currentTestConfig.basePath,
      //     testName: this.currentTestConfig.testName,
      //     testDescription: this.currentTestConfig.testDescription,
      //     endpointAction: this.currentTestConfig.endpointAction,
      //     payloadBody: this.currentTestConfig.payloadBody,
      //     status: this.currentTestConfig.status
      //   });
      //   this.responseJsonView = JSON.parse(this.currentTestConfig.response);
      //   if (this.currentTestConfig.file !== null) {
      //     this.isFileAdded = true;
      //     this.fileUploaded = this.currentTestConfig.file;
      //   } else {
      //     this.isFileAdded = false;
      //   }
      //   this.headerVals = this.currentTestConfig.payloadHeaders;
      //   this.formVals = this.currentTestConfig.formContent;
      // } else {
      //   this.ResetFullForm();
      // }

      if (this.selectedTestConfigs.length === 1) {
        this.currentTestConfig = this.selectedTestConfigs[0];
        if (this.currentTestConfig !== null) {
          this.testDetailsForm.reset();
          this.testDetailsForm.patchValue({
            url: this.currentTestConfig.url,
            baseUrl: this.currentTestConfig.baseUrl,
            basePath: this.currentTestConfig.basePath,
            testName: this.currentTestConfig.testName,
            testDescription: this.currentTestConfig.testDescription,
            endpointAction: this.currentTestConfig.endpointAction,
            payloadBody: this.currentTestConfig.payloadBody,
            status: this.currentTestConfig.status
          });
          this.responseJsonView = JSON.parse(this.currentTestConfig.response);
          if (this.currentTestConfig.file !== null) {
            this.isFileAdded = true;
            this.fileUploaded = this.currentTestConfig.file;
          } else {
            this.isFileAdded = false;
          }
          this.headerVals = this.currentTestConfig.payloadHeaders;
          this.formVals = this.currentTestConfig.formContent;
        }
      } else {
        this.ResetFullForm();
      }

    }
  }

  urlOnAdd(event): void {
    this.selectedTestConfigs.push(event);
    this.urlOnChanged(2);

  }

  urlOnClear(): void {
    console.log(this.selectedTestConfigs);
    let ids: string[] = [];
    if (this.selectedTestConfigs.length > 0) {
      for (let j: number = 0; j < this.selectedTestConfigs.length; j++) {
        ids[j] = this.selectedTestConfigs[j].id;
      }
      this.testConfigService.deleteTestConfigs(ids).subscribe(res => {
        if (res === true) {
          let index = 0;
          this.toastService.showSuccess('Successfully deleted.');
          this.selectedTestConfigs = [];
          ids.forEach(t => {
            index = this.testConfigurations.findIndex(x => x.id === t);
            this.testConfigurations.splice(index, 1);
            this.testConfigurations = [...this.testConfigurations];
          });
        } else {
          this.toastService.showError('Delete Unsuccessful.');
        }
      });
    }
    this.urlOnChanged(2);
  }

  urlOnRemove(value): void {
    const index = this.selectedTestConfigs.findIndex(x => x.id === value.id);
    if (index !== -1) {
      this.selectedTestConfigs.splice(index, 1);
      this.urlOnChanged(2);
    }

  }

  private SplitedUrl(urlIn: string): string[] {
    let url = new URL(urlIn);
    let splittedUrl = [url.origin, url.pathname];
    return splittedUrl;
  }

  baseUrlPathOnChanged(): void {
    let newUrl = this.f.baseUrl.value + this.f.basePath.value;
    this.testDetailsForm.patchValue({
      url: newUrl
    });

  }

  private ResetFullForm(): void {
    this.testDetailsForm.reset();
    this.responseJsonView = {};
    this.formVals = [];
    this.headerVals = [];

    this.urlSelectOnClick();
  }

  receiveSettings($event): void {
    this.testSettings = $event;
  }

  urlEditOnClick(): void {
    if (this.urlStatus) {
      this.urlStatus = false;
    }
  }
  urlSelectOnClick(): void {
    if (!this.urlStatus) {
      this.urlStatus = true;
    }
  }

  bodyTabChanged(tabChangeEvent): void {
    console.log('index => ', tabChangeEvent.index);
    this.selectedTabIndex = tabChangeEvent.index;
  }

}
