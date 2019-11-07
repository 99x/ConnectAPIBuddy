import { Observable, of, pipe, forkJoin } from 'rxjs';
import { retry, catchError, map, tap, delay } from 'rxjs/operators';

import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import { AlertToastService } from '../../shared/services/alert-toast.service';
import { User } from '../shared/models/user';


@Injectable({
  providedIn: 'root'
})
export class UserLoginService {

  private API_URL = 'https://connectapibuddy.azurewebsites.net/api/User/';     // https://localhost:44384/api/User';
  httpHeaders = new HttpHeaders({
    'Content-Type': 'application/json'
  });

  constructor(
    private httpClient: HttpClient,
    public alertToastService: AlertToastService
  ) { }

  // Handle API errors
  handleError(error: HttpErrorResponse) {
    this.alertToastService.showError('Error Occured. Try Again.');
    return of(null);
  }


  SaveUser(response: User): Observable<User | null> {
    return this.httpClient
      .post<User>(this.API_URL, response, { headers: this.httpHeaders })
      .pipe(
        catchError(this.handleError)
      );
  }

  UserExits(email: string): Observable<User> {
    return this.httpClient
      .get<User>(this.API_URL + '/exists/' + email, { headers: this.httpHeaders })
      .pipe(
        retry((2)),
        catchError(this.handleError)
      );
  }

  UserAthenticate(userIn: User): Observable<User> {
    return this.httpClient
      .post<User>(this.API_URL + '/athorized/', userIn, { headers: this.httpHeaders })
      .pipe(
        retry((2)),
        catchError(this.handleError)
      );
  }

}



