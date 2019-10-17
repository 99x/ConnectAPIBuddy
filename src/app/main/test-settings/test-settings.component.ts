import { Component, OnInit, Input } from '@angular/core';
import { NgbModal, NgbModalOptions, NgbActiveModal  } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-test-settings',
  templateUrl: './test-settings.component.html',
  styleUrls: ['./test-settings.component.css']
})
export class TestSettingsComponent implements OnInit {
  @Input() modalTitle;
  @Input() modalContent;

  constructor(public activeModal: NgbActiveModal) {
  }

  ngOnInit() {
  }

}
