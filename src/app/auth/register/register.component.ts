import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';
// models
import { User } from '../models/user';
// shared
import { MustMatch } from '../../shared/must-match';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit, OnDestroy {

  private subscriptions: Subscription[] = [];

  private userForm: FormGroup;

  constructor() { }

  ngOnInit() {
    this.userForm = new FormGroup({
      username: new FormControl('', Validators.required),
      email: new FormControl('', Validators.required),
      password: new FormControl('', [Validators.required, Validators.minLength(8)]),
      confirmPassword: new FormControl('', [Validators.required, Validators.minLength(8)])
    }, {
      // validator: new FormControl(MustMatch('password', 'confirmPassword'))
    });
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  // get form values
  get f() { return this.userForm.controls; }

  public onSubmit({ value, valid }: { value: User, valid: boolean }) {
    console.log(value, valid);
  }



}
