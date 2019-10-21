import { Observable, of, pipe } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class UserLoginService {

  private API_URL = 'https://localhost:5000/api/Login';
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


  SaveResponse(response): Observable<any> {
    return this.httpClient
      .post(this.API_URL, response, { observe: 'response', headers: this.httpHeaders })
      .pipe(
        retry(2),
        catchError(this.handleError)
      );
  }
}



