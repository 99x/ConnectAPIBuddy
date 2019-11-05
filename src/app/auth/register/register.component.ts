import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
// services
import { UserLoginService } from '../services/user-login.service';
import { AlertToastService } from '../../shared/services/alert-toast.service';
// models
import { User } from '../shared/models/user';
// shared
import { MustMatch } from '../../shared/must-match';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  private subscriptions: Subscription[] = [];

  private userRegistrationForm: FormGroup;
  private newUser: User;

  constructor(
    private userLoginService: UserLoginService,
    public toastService: AlertToastService,
    private router: Router
  ) { }

  ngOnInit() {
    this.userRegistrationForm = new FormGroup({
      name: new FormControl('', Validators.required),
      email: new FormControl('', Validators.required),
      password: new FormControl('', [Validators.required, Validators.minLength(8)]),
      confirmPassword: new FormControl('', [Validators.required, Validators.minLength(8)])
    });
  }

  // ngOnDestroy() {
  //   this.subscriptions.forEach(subscription => subscription.unsubscribe());
  // }

  // get form values
  get f() { return this.userRegistrationForm.controls; }

  // public onSubmit({ value, valid }: { value: User, valid: boolean }) {
  //   console.log(value, valid);
  // }

  public UserRegister() {
    if (this.userRegistrationForm.valid) {
      this.userLoginService.UserExits(this.f.email.value).subscribe(resp => {

        if (resp === null) {

          if (this.f.password.value === this.f.confirmPassword.value) {
            this.newUser = this.userRegistrationForm.value;
            this.userLoginService.SaveUser(this.newUser).subscribe(res => {

              if (res !== null) {
                this.showSuccess('Successfully Registered...');
                this.router.navigate([`/login`]);
              } else {
                this.showError('Something went wrong. Please try again...');
                this.userRegistrationForm.reset();
              }
            });

          } else {
            this.showError('Passwords isn\'t match.');
            this.f.password.reset();
            this.f.confirmPassword.reset();

          }
        } else {
          this.showError('Email address already registered. Please login or try again..');
          this.userRegistrationForm.reset();
        }

      });

    }
  }


  // Taost messages
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


}
