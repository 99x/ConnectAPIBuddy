// rxjs
import { Observable, of, pipe, forkJoin } from 'rxjs';
import { retry, catchError, map, tap, delay } from 'rxjs/operators';
// angular
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
// services
import { AlertToastService } from '../../shared/services/alert-toast.service';
// models
import { User } from '../shared/models/user';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class UserLoginService {

  private BASE_URL: string;

  httpHeaders = new HttpHeaders({
    'Content-Type': 'application/json'
  });

  constructor(
    private httpClient: HttpClient,
    public alertToastService: AlertToastService
  ) {
    this.BASE_URL = environment.apiUrls.backend_url;
  }

  // Handle API errors
  handleError(error: HttpErrorResponse) {
    this.alertToastService.showError('Error Occured. Try Again.');
    return of(null);
  }


  SaveUser(response: User): Observable<User | null> {
    return this.httpClient
      .post<User>(`${this.BASE_URL}/User`, response, { headers: this.httpHeaders })
      .pipe(
        catchError((err) => this.handleError(err))
      );
  }

  UserExits(email: string): Observable<User | null> {
    return this.httpClient
      .get<User>(`${this.BASE_URL}/User/exists/${email}`, { headers: this.httpHeaders })
      .pipe(
        retry((2)),
        catchError((err) => this.handleError(err))
      );
  }

  UserAthenticate(userIn: User): Observable<User | null> {
    return this.httpClient
      .post<User>(`${this.BASE_URL}/User/athorized`, userIn, { headers: this.httpHeaders })
      .pipe(
        retry((2)),
        catchError((err) => this.handleError(err))
      );
  }

}



