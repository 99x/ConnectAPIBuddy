import { Observable, throwError, of } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { TestConfiguration } from '../../models/TestConfiguration';

@Injectable()
export class TestConfigService {

  constructor(private httpClient: HttpClient) { }

  httpHeaders = new HttpHeaders({
    'Content-Type': 'application/json'
  });

  // Handle API errors
  handleError(error: HttpErrorResponse) {
    return of({
      status: error.status,
      statusText: error.message,
      body: error.error
    });
  }

  // Get data
  getTestConfigs(url: string): Observable<any> {
    return this.httpClient
      .get(url, { observe: 'response', headers: this.httpHeaders })
      .pipe(
        retry(2),
        catchError(this.handleError)
      );
  }

  // Post data
  postTestConfig(url: string, data: TestConfiguration): Observable<any> {
    return this.httpClient
      .post(url, data, { observe: 'response', headers: this.httpHeaders })
      .pipe(
        retry(2),
        catchError(this.handleError)
      );
  }
}
