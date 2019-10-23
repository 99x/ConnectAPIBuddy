import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, MinLengthValidator } from '@angular/forms';
import { Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { GoogleLoginProvider, FacebookLoginProvider, AuthService } from 'angular-6-social-login';
import { SocialLoginModule, AuthServiceConfig } from 'angular-6-social-login';
// services
import { UserLoginService } from '../services/user-login.service';
import { AlertToastService } from '../../shared/services/alert-toast.service';
// models
import { User } from '../shared/models/user';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  private subscriptions: Subscription[] = [];
  private currentUser: User;

  private loginForm: FormGroup;

  constructor(
    public OAuth: AuthService,
    private userLoginService: UserLoginService,
    public toastService: AlertToastService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loginForm = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', [Validators.required, Validators.minLength(8)])
    });
  }


  public UserSignIn(socialProvider: string) {
    let socialPlatformProvider = '';

    if (socialProvider === 'facebook') {
      socialPlatformProvider = FacebookLoginProvider.PROVIDER_ID;
    } else if (socialProvider === 'google') {
      socialPlatformProvider = GoogleLoginProvider.PROVIDER_ID;
    }

    this.OAuth.signIn(socialPlatformProvider).then(user => {
      this.currentUser = user;
      console.log(socialProvider, this.currentUser);

      this.userLoginService.UserExits(user.email).subscribe(res => {
        if (res.body === true) {
          this.showSuccess('Successfully Logged in');
          localStorage.setItem('socialusers', JSON.stringify(this.currentUser));
          this.router.navigate([`/Mainpage`]);
        } else {
          this.Savesresponse(this.currentUser);
        }
      });
    });
  }

  // save the user in the database is the user not registred previously
  private Savesresponse(user: User): void {
    this.userLoginService.SaveUser(user).subscribe(res => {
      if (res.status === 200) {
        this.showSuccess('Successfully Registered');
        this.showSuccess('Successfully Logged in');
        localStorage.setItem('socialusers', JSON.stringify(user));
        this.router.navigate([`/Mainpage`]);
      } else {
        this.showError('Someting went wrong. Please try again...');
        this.router.navigate([`/login`]);
      }

    });
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





  // this.subscriptions.push(this.userService.getUsers().subscribe((data: any[]) => {
  //   console.log(data);
  //   this.users = data;
  // }));
  //   }



  //   public onSubmit(): void {
  //   console.log(this.loginForm.value);

  //   this.activatedRoute.url
  //     .subscribe(url => console.log('The URL changed to: ' + url));
  // }

  //   public logNameChange(): void {
  //   const nameControl = this.loginForm.get('username');
  //   nameControl.valueChanges.forEach(
  //     (value: string) => this.nameChangeLog.push(value)
  //   );
  // }

}
