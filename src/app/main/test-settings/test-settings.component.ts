import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbModal, NgbModalOptions, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, FormBuilder, FormGroup, AbstractControl, Validators } from '@angular/forms';
// Modals
import { TestSettings } from '../models/TestSettings';

@Component({
  selector: 'app-test-settings',
  templateUrl: './test-settings.component.html',
  styleUrls: ['./test-settings.component.css']
})
export class TestSettingsComponent implements OnInit {
  @Input() modalTitle;
  // @Output() passEntry: EventEmitter<any> = new EventEmitter();
  @Input() testSettings: TestSettings;
  // public testSettings: TestSettings;
  settingsForm: FormGroup;

  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder
  ) {
  }

  ngOnInit() {
    this.settingsForm = this.fb.group(this.testSettings);
  }

  onSubmit() {
    const result: TestSettings = Object.assign({}, this.settingsForm.value);
    this.activeModal.close(result);
  }
}






// passBack() {
//   this.passEntry.emit(this.user);
//   }
