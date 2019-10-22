import { Observable, of, pipe } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { User } from '../shared/models/user';


@Injectable({
  providedIn: 'root'
})
export class UserLoginService {

  private API_URL = 'https://localhost:44384/api/User';
  httpHeaders = new HttpHeaders({
    'Content-Type': 'application/json'
  });

  constructor(private httpClient: HttpClient) { }

  // Handle API errors
  handleError(error: HttpErrorResponse) {
    return of({
      status: error.status,
      statusText: error.message,
      body: error.error
    });
  }


  SaveUser(response: User): Observable<any> {
    return this.httpClient
      .post(this.API_URL, response, { observe: 'response', headers: this.httpHeaders })
      .pipe(
        retry(2),
        catchError(this.handleError)
      );
  }

  UserExits(email: string): Observable<any> {
    return this.httpClient
      .get(this.API_URL + '/exists/' + email, { observe: 'response', headers: this.httpHeaders });
  }
}



