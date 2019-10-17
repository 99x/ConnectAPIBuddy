import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, MinLengthValidator } from '@angular/forms';
import { Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
// services
import { UserService } from '../services/user.service';
// models
import { User } from '../models/user';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  private subscriptions: Subscription[] = [];

  private loginForm: FormGroup;
  private nameChangeLog: string[] = [];
  private users: User[] = [];

  constructor(private userService: UserService, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.loginForm = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', [Validators.required, Validators.minLength(8)])
    });

    this.logNameChange();

    this.subscriptions.push(this.userService.getUsers().subscribe((data: any[]) => {
      console.log(data);
      this.users = data;
    }));
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  public onSubmit(): void {
    console.log(this.loginForm.value);

    this.activatedRoute.url
      .subscribe(url => console.log('The URL changed to: ' + url));
  }

  public logNameChange(): void {
    const nameControl = this.loginForm.get('username');
    nameControl.valueChanges.forEach(
      (value: string) => this.nameChangeLog.push(value)
    );
  }

}
