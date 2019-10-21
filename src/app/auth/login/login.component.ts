import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, MinLengthValidator } from '@angular/forms';
import { Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { GoogleLoginProvider, FacebookLoginProvider, AuthService } from 'angular-6-social-login';
import { SocialLoginModule, AuthServiceConfig } from 'angular-6-social-login';
// services
import { UserLoginService } from '../services/user-login.service';
// models
import { User } from '../shared/models/user';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  private subscriptions: Subscription[] = [];
  response;
  users: User;

  private loginForm: FormGroup;

  constructor(
    public OAuth: AuthService,
    private userLoginService: UserLoginService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loginForm = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', [Validators.required, Validators.minLength(8)])
    });
  }


  public UserSignIn(socialProvider: string) {
    let socialPlatformProvider;
    if (socialProvider === 'facebook') {
      socialPlatformProvider = FacebookLoginProvider.PROVIDER_ID;
    } else if (socialProvider === 'google') {
      socialPlatformProvider = GoogleLoginProvider.PROVIDER_ID;
    }
    this.OAuth.signIn(socialPlatformProvider).then(users => {
      console.log(socialProvider, users);
      console.log(users);
      this.Savesresponse(users);
    });
  }

  Savesresponse(socialusers: User) {
    this.userLoginService.SaveResponse(socialusers).subscribe((res: any) => {
      console.log(res);
      this.users = res;
      this.response = res.userDetail;
      localStorage.setItem('socialusers', JSON.stringify(this.users));
      console.log(localStorage.setItem('socialusers', JSON.stringify(this.users)));
      this.router.navigate([`/Mainpage`]);
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
