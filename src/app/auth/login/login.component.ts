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
      email: new FormControl('', Validators.required),
      password: new FormControl('', [Validators.required, Validators.minLength(8)])
    });
  }

  public LocalUserLogin() {
    let temp: User;
    if (this.loginForm.valid) {
      temp = this.loginForm.value;
      this.userLoginService.UserExits(this.loginForm.get('email').value).subscribe(res => {
        if (res !== null) {
          this.userLoginService.UserAthenticate(temp).subscribe(resp => {
            if (resp !== null) {
              this.currentUser = resp;
              localStorage.setItem('socialusers', JSON.stringify(this.currentUser));
              this.toastService.showSuccess('Successfully Logged in');
              this.router.navigate([`/Mainpage`]);
            } else {
              this.toastService.showError('Incorrect password');
              this.loginForm.get('password').reset();
            }
          });
        } else {
          this.toastService.showError('You are not registered yet. Please Signup first...');
          this.loginForm.reset();
        }
      });
    }
  }

  public SocialUserSignIn(socialProvider: string) {
    let socialPlatformProvider = '';

    if (socialProvider === 'facebook') {
      socialPlatformProvider = FacebookLoginProvider.PROVIDER_ID;
    } else if (socialProvider === 'google') {
      socialPlatformProvider = GoogleLoginProvider.PROVIDER_ID;
    }

    this.OAuth.signIn(socialPlatformProvider).then(user => {

      let tempUser: User = {
        id: null,
        name: user.name,
        email: user.email,
        token: user.token,
        image: user.image,
        provider: user.provider
      };

      this.userLoginService.UserExits(user.email).subscribe(res => {
        if (res !== null) {
          this.currentUser = res;

          // this.showSuccess('Successfully Logged in');
          this.toastService.showSuccess('Successfully Logged in');
          localStorage.setItem('socialusers', JSON.stringify(this.currentUser));
          this.router.navigate([`/Mainpage`]);
        } else {
          this.Savesresponse(tempUser);
        }
      });
    });
  }

  // save the user in the database is the user not registred previously
  private Savesresponse(user: User): void {
    this.userLoginService.SaveUser(user).subscribe(res => {
      if (res !== null) {
        this.currentUser = res;
        this.toastService.showSuccess('Successfully Registered');
        this.toastService.showSuccess('Successfully Logged in');
        localStorage.setItem('socialusers', JSON.stringify(this.currentUser));
        this.router.navigate([`/Mainpage`]);
      } else {
        this.toastService.showError('Someting went wrong. Please try again...');
        this.router.navigate([`/login`]);
      }

    });
  }









  // this.subscriptions.push(this.userService.getUsers().subscribe((data: any[]) => {
  //   console.log(data);
  //   this.users = data;
  // }));

}
