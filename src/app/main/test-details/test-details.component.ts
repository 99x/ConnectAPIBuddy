// rxjs
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
// angular
import { Component, OnInit, Input, DoCheck } from '@angular/core';
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
import { DeliveryRequest } from '../models/DeliveryRequest';
import { ThrowStmt } from '@angular/compiler';
import { tick } from '@angular/core/testing';



@Component({
  selector: 'app-test-details',
  templateUrl: './test-details.component.html',
  styleUrls: ['./test-details.component.css'],
  providers: [ApiService]
})

export class TestDetailsComponent implements OnInit, DoCheck {


  testDetailsForm: FormGroup;
  currentUser: User = null;
  testConfigurations: TestConfiguration[] = [];
  currentTestConfig: TestConfiguration = null;
  testSettings = new TestSettings();
  selectedTestConfigs: string[] = [];
  req: DeliveryRequest;

  urls: object[] = [];
  baseurls: string[] = [];
  basepaths: string[] = [];
  headerVals: HeaderVal[] = [];
  formVals: FormVal[] = [];
  modalOptions: NgbModalOptions;
  fileUploaded: FileDetails;   // Uploaded file details

  methods = ['GET', 'POST', 'UPDATE', 'DELETE'];
  urlStatus: boolean = false;
  selectedTabIndex = 0;
  dataType: string = 'raw';  // defult seleted tab
  responseJsonView: object = {};  // Response view in JSON format
  isFileAdded = false; // Whether file attached or not
  multiple = false;
  isPanelExapnded = false;
  newTestCase = true;

  rawInputPattern = /^\{(.*\s)*\}$/;
  urlPattern = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/


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
        this.testConfigurations.forEach(x => {
          this.urls.push({ url: x.url, method: x.endpointAction });
          if (this.baseurls.findIndex(s => s === x.baseUrl) === -1) {
            this.baseurls.push(x.baseUrl);
          }
          if (this.basepaths.findIndex(l => l === x.basePath) === -1) {
            this.basepaths.push(x.basePath);
          }

        });
      } else {
        this.toastService.showError('Couldn\'t retrive Test configurations.');
      }

    });

    this.formInitialize();
  }

  ngDoCheck() {
    if (this.currentTestConfig === null) {
      this.newTestCase = true;
    } else {
      this.newTestCase = false;
    }
  }

  /***************************************** Test Details form ****************************************/
  private formInitialize(): void {
    this.testDetailsForm = this.fb.group({
      url: [null, [Validators.required, Validators.pattern(this.urlPattern)]],
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
      payloadBody: ['', Validators.pattern(this.rawInputPattern)],
      fileKey: [''],
      response: [''],
      status: ['']
    });
  }

  get f() { return this.testDetailsForm.controls; } // get form controls

  getDataFromUI(update: boolean): TestConfiguration {
    let testConfig = new TestConfiguration(this.testDetailsForm.value);
    testConfig.payloadHeaders = this.headerVals;
    testConfig.formContent = this.formVals;
    testConfig.response = JSON.stringify(this.responseJsonView, undefined, 4);
    testConfig.file = this.fileUploaded;
    testConfig.userId = this.currentUser.id;
    if (update) {
      testConfig.id = this.currentTestConfig.id;
    }
    return testConfig;
  }

  onClickExecute(isSave: boolean, isUpdate: boolean): void {
    const url = this.f.url.value;

    /***************************************** Save current Test  ****************************************/

    if (isSave) {
      if (!this.testDetailsForm.valid) {
        this.toastService.showError('Enter all required fileds');
      } else {
        let testConfigOut = this.getDataFromUI(false);

        this.testConfigService.postTestConfig(testConfigOut)
          .subscribe(res => {
            if (res === null) {
              this.toastService.showError('failed');
            } else {
              this.toastService.showSuccess('Successfully Saved');
              this.testConfigurations = [...this.testConfigurations, res];
              this.currentTestConfig = res;
              this.urls.push({ url: res.url, method: res.endpointAction });
              this.baseurls.push(res.baseUrl);
              this.basepaths.push(res.basePath);

            }
          });
      }

    } else if (isUpdate) {
      if (!this.testDetailsForm.valid) {
        this.toastService.showError('Enter all required fileds');
      } else {
        let testConfigOut = this.getDataFromUI(true);
        this.testConfigService.updateTestConfig(testConfigOut).subscribe(res => {
          if (res === null) {
            this.toastService.showError('Update Unsuccessful');
          } else {
            this.toastService.showSuccess('Update Successful');
            this.testConfigurations[this.testConfigurations.findIndex(x => x.id === this.currentTestConfig.id)] = testConfigOut;
            this.testConfigurations = [...this.testConfigurations]
            this.currentTestConfig = testConfigOut;
          }
        })
      }

    } else {
      this.responseJsonView = {};
      this.f.status.reset();
      this.isPanelExapnded = true;

      this.req = new DeliveryRequest();
      this.req.method = this.f.endpointAction.value;
      this.req.payloadHeaders = this.headerVals;
      this.req.url = url;
      this.req.testSettings = this.testSettings;

      if (url === null) {
        this.toastService.showError('Enter a URL...');
      } else if (this.f.endpointAction.value === null) {
        this.toastService.showError('Select a Http Method');
      } else {
        if (this.headerVals.length === 0) {
          this.headerVals.push({ header: 'Content-Type', value: 'application/json' });
        }

        /***************************************** HTTP default mehods  ****************************************/

        if (this.f.endpointAction.value === 'GET') {

          this.apiService.postData(this.req).subscribe(res => {
            if (res.isSuccess === true) {
              this.toastService.showSuccess('Request Successful');

              if (res.content === '') {
                this.responseJsonView = JSON.parse('{"content": "No content"}');
              } else {
                this.responseJsonView = JSON.parse(res.content);
              }
              this.testDetailsForm.patchValue({
                status: res.status
              });
            } else if (res.isSuccess === false) {
              this.toastService.showError('Request Unsuccessful');

              this.responseJsonView = {};
              this.testDetailsForm.patchValue({
                status: res.status + '\n' + res.statusText
              });
            } else {
              this.responseJsonView = {};
              this.testDetailsForm.patchValue({
                status: ''
              });
            }

          });

        } else if (this.f.endpointAction.value === 'POST') {
          let data: any = null;

          if (this.selectedTabIndex === 0) {
            data = JSON.parse(this.f.payloadBody.value);

            if (this.isFileAdded) {
              data[this.f.fileKey.value] = this.fileUploaded.fileAsBase64;
            }
            this.req.payloadBody = JSON.stringify(data);
            this.req.bodyTabSelectedIndex = this.selectedTabIndex;

          } else if (this.selectedTabIndex === 1) {
            const formData = new FormData();
            if (this.isFileAdded) {
              this.formVals.push({ key: this.f.fileKey.value, value: this.fileUploaded.fileAsBase64 });
            }
            this.formVals.forEach(f => {
              formData.append(f.key, f.value);
            });
            data = formData;
            this.req.formContent = this.formVals;
            this.req.bodyTabSelectedIndex = this.selectedTabIndex;
          }

          this.apiService.postData(this.req).subscribe(res => {
            if (res.isSuccess === true) {
              this.toastService.showSuccess('Request Successful');

              if (res.content === '') {
                this.responseJsonView = JSON.parse('{"content": "No content"}');
              } else {
                this.responseJsonView = JSON.parse(res.content);
              }
              this.testDetailsForm.patchValue({
                status: res.status
              });
            } else if (res.isSuccess === false) {
              this.toastService.showError('Request Unsuccessful');

              this.responseJsonView = {};
              this.testDetailsForm.patchValue({
                status: res.status + '\n' + res.statusText
              });
            } else {
              this.responseJsonView = {};
              this.testDetailsForm.patchValue({
                status: ''
              });
            }
          });

        } else if (this.f.endpointAction.value === 'UPDATE') {
          this.req.payloadBody = this.f.payloadBody.value;

          this.apiService.postData(this.req).subscribe(res => {
            if (res.isSuccess === true) {
              this.toastService.showSuccess('Request Successful');

              if (res.content === '') {
                this.responseJsonView = JSON.parse('{"content": "No content"}');
              } else {
                this.responseJsonView = JSON.parse(res.content);
              }
              this.testDetailsForm.patchValue({
                status: res.status
              });
            } else if (res.isSuccess === false) {
              this.toastService.showError('Request Unsuccessful');

              this.responseJsonView = {};
              this.testDetailsForm.patchValue({
                status: res.status + '\n' + res.statusText
              });
            } else {
              this.responseJsonView = {};
              this.testDetailsForm.patchValue({
                status: ''
              });
            }
          });

        } else if (this.f.endpointAction.value === 'DELETE') {
          this.apiService.postData(this.req).subscribe(res => {
            if (res.isSuccess === true) {
              this.toastService.showSuccess('Request Successful');
              if (res.content === '') {
                this.responseJsonView = JSON.parse('{"content": "No content"}');
              } else {
                this.responseJsonView = JSON.parse(res.content);
              }

              this.testDetailsForm.patchValue({
                status: res.status
              });
            } else if (res.isSuccess === false) {
              this.toastService.showError('Request Unsuccessful');

              this.responseJsonView = {};
              this.testDetailsForm.patchValue({
                status: res.status + '\n' + res.statusText
              });
            } else {
              this.responseJsonView = {};
              this.testDetailsForm.patchValue({
                status: ''
              });
            }
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
        } else {
          this.toastService.showError("No Test Case found");
        }
        break;

      case 2:
        if (this.selectedTestConfigs.length > 0) {
          this.selectedTestConfigs.forEach(t => {
            let tconfig = this.testConfigurations.find(s => s.id === t);
            serializedString = JSON.stringify(tconfig)
            blob = new Blob([serializedString], { type: 'application/json' });
            saveAs(blob, tconfig.testName + tconfig.id + '.json');
          });
        } else {
          this.toastService.showError("No selected Test Cases found");
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
  }

  OnClickRemoveFormVal(): void {
    this.formVals.pop();
  }

  /******************************************* Attach a file *********************************************/
  handleFileInput(files: FileList): void {
    let file: File = null;
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
    this.fileUploaded.key = this.f.fileKey.value;

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
  }

  // File toggle switch changed
  toggleChange(): void {
    this.isFileAdded = !this.isFileAdded;

  }

  // Type radio buttons changed
  dataTypeChanged(value: string): void {
    this.dataType = value;
  }

  OnClickOption(i) {
  }

  urlOnChanged(i: number, event?): void {

    if (i === 1) {
      if (this.f.url.valid) {
        let cUrl = event.target.value;
        this.responseJsonView = {};
        this.f.status.reset();
        let split = this.SplitedUrl(cUrl);
        this.testDetailsForm.patchValue({
          url: cUrl,
          baseUrl: split[0],
          basePath: split[1]
        });
      }


    } else if (i === 2) {
      if (this.selectedTestConfigs.length === 1) {
        let currentIndex = this.testConfigurations.findIndex(x => x.id === this.selectedTestConfigs[0])
        if (currentIndex !== -1) {
          this.currentTestConfig = this.testConfigurations[currentIndex];
        }
        if (this.currentTestConfig !== null) {
          this.resetFullForm();
          this.urlStatus = false;
          this.setDataUI(this.currentTestConfig);
        }
      } else {
        this.resetFullForm();
        this.currentTestConfig = null;
      }

    }
  }

  setDataUI(testConfigIn: TestConfiguration): void {
    this.isPanelExapnded = true;
    this.testDetailsForm.patchValue({
      url: testConfigIn.url,
      baseUrl: testConfigIn.baseUrl,
      basePath: testConfigIn.basePath,
      testName: testConfigIn.testName,
      testDescription: testConfigIn.testDescription,
      endpointAction: testConfigIn.endpointAction,
      payloadBody: testConfigIn.payloadBody,
      status: testConfigIn.status

    });
    this.responseJsonView = JSON.parse(testConfigIn.response);
    if (testConfigIn.file !== null) {
      this.isFileAdded = true;
      this.fileUploaded = testConfigIn.file;
      this.testDetailsForm.patchValue({
        fileKey: this.fileUploaded.key
      });
    } else {
      this.isFileAdded = false;
    }
    this.headerVals = testConfigIn.payloadHeaders;
    this.formVals = testConfigIn.formContent;
  }

  urlOnAdd(event): void {
    this.urlOnChanged(2);
  }

  urlOnClear(): void {
    this.resetFullForm();

  }

  urlOnRemove(value): void {
    //   this.selectedTestConfigs.splice(index, 1);
    this.urlOnChanged(2);
  }

  deleteTestConfig(item) {
    if (window.confirm("Are you sure to delete?")) {
      if (item.length > 0) {
        this.testConfigService.deleteTestConfig(item).subscribe(res => {
          if (res === true) {
            let index = 0;
            this.toastService.showSuccess('Successfully deleted.');
            index = this.testConfigurations.findIndex(x => x.id === item);
            this.testConfigurations.splice(index, 1);
            this.testConfigurations = [...this.testConfigurations];
            this.selectedTestConfigs = null;
            this.resetFullForm();
          } else {
            this.toastService.showError('Delete Unsuccessful.');
          }
        });
      } else {
        this.toastService.showError("Select a Test Case")
      }
    }

  }

  customSearchFn(term: string, item) {
    term = term.toLocaleLowerCase();
    return item.testName.toLocaleLowerCase().indexOf(term) > -1 || item.url.toLocaleLowerCase().indexOf(term) > -1;
  }

  // urlSelectOnClick(): void {
  //   if (!this.urlStatus) {
  //     this.urlStatus = true;
  //   }
  // }

  urlEditOnClick(): void {
    if (this.urlStatus) {
      this.urlStatus = false;
    } else {
      this.urlStatus = true;
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

  resetFullForm(newTest: boolean = false): void {
    if (newTest === true) {
      this.urlStatus = false;
      this.isPanelExapnded = false;
      this.selectedTestConfigs = null;
      this.currentTestConfig = null;
      this.testDetailsForm.reset();
      this.responseJsonView = {};
      this.formVals = [];
      this.headerVals = [];
    } else {
      this.urlStatus = true;
      this.isPanelExapnded = false;
      this.testDetailsForm.reset();
      this.responseJsonView = {};
      this.formVals = [];
      this.headerVals = [];
    }

  }

  receiveSettings($event): void {
    this.testSettings = $event;
  }

  bodyTabChanged(tabChangeEvent): void {
    this.selectedTabIndex = tabChangeEvent.index;
  }

  importTestConfig(importedFile): void {
    this.toastService.showSuccess('Import Successful');
    this.resetFullForm(true);
    this.currentTestConfig = importedFile;
    this.setDataUI(importedFile);
  }

}
