import { Injectable } from '@angular/core';
import { Observable, throwError, of, Observer, TimeoutError } from 'rxjs';
import { retry, catchError, delay, mergeMap, retryWhen, timeout } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { HeaderVal } from '../models/Header';
import { TestSettings } from '../models/TestSettings';

@Injectable()
export class ApiService {

  private httpHeaders: HttpHeaders;
  private testSettings = new TestSettings();

  constructor(
    private httpClient: HttpClient
  ) { }

  // Handle API errors
  private handleError(error: HttpErrorResponse) {
    let errorMessage;
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred
      errorMessage = {
        body: error,
        status: error.error.message
      };

    } else if (error instanceof TimeoutError) {
      // Timeout error occured
      errorMessage = {
        body: [],
        status: 'Could not get any response. ' + error.message
      };

    } else {
      // The backend returned an unsuccessful response code
      if (error.status === 0) {
        errorMessage = {
          body: [],
          status: 'Could not get any response. There was an error connecting to ' + error.url
        };
      } else {
        errorMessage = {
          body: error.error,
          status: error.status + '\n' + error.statusText
        };
      }

    }
    return of(errorMessage);
  }


  // Get data
  getData(url: string, headers: HeaderVal[], testSettings: TestSettings): Observable<any> {
    this.httpHeaders = new HttpHeaders();
    if (headers.length > 0) {
      headers.forEach(element => {
        this.httpHeaders.append(element.header, element.value);
      });
    }
    if (testSettings !== null) {
      this.testSettings = testSettings;
    }

    return this.httpClient
      .get(url, { observe: 'response', headers: this.httpHeaders })
      .pipe(
        timeout(this.testSettings.timeOutMs),
        retry(this.testSettings.maxRetry),
        catchError(this.handleError)
      );
  }

  // Post data
  postData(url: string, body: any, headers: HeaderVal[], testSettings: TestSettings): Observable<any> {
    this.httpHeaders = new HttpHeaders();
    if (headers.length > 0) {
      headers.forEach(element => {
        this.httpHeaders.append(element.header, element.value);
      });
    }
    if (testSettings !== null) {
      this.testSettings = testSettings;
    }
    return this.httpClient
      .post(url, body, { observe: 'response', headers: this.httpHeaders })
      .pipe(
        timeout(this.testSettings.timeOutMs),
        retry(this.testSettings.maxRetry),
        catchError(this.handleError)
      );
  }

  // Update data
  updateData(url: string, data: object, headers: HeaderVal[], testSettings: TestSettings): Observable<any> {
    this.httpHeaders = new HttpHeaders();
    if (headers.length > 0) {
      headers.forEach(element => {
        this.httpHeaders.append(element.header, element.value);
      });
    }
    if (testSettings !== null) {
      this.testSettings = testSettings;
    }
    return this.httpClient
      .put(url, data, { observe: 'response', headers: this.httpHeaders })
      .pipe(
        timeout(this.testSettings.timeOutMs),
        retry(this.testSettings.maxRetry),
        catchError(this.handleError)
      );
  }

  // Delete data
  deleteData(url: string, headers: HeaderVal[], testSettings: TestSettings): Observable<any> {
    this.httpHeaders = new HttpHeaders();
    if (headers.length > 0) {
      headers.forEach(element => {
        this.httpHeaders.append(element.header, element.value);
      });
    }
    if (testSettings !== null) {
      this.testSettings = testSettings;
    }
    return this.httpClient
      .delete(url, { observe: 'response', headers: this.httpHeaders })
      .pipe(
        timeout(this.testSettings.timeOutMs),
        retry(this.testSettings.maxRetry),
        catchError(this.handleError)
      );
  }

}















































  // getErrorMessage() {
  //   return 'Tried to Load Resource over XHR for {{this.maxRetries}} times without success. Giving up.';
  // }

  // delayedRetry() {
  //   return (src: Observable<any>) =>
  //     src.pipe(
  //       timeout(this.timeOut),
  //       retryWhen((errors: Observable<any>) => errors.pipe(
  //         delay(this.delayMs),
  //         mergeMap(error => this.maxRetries-- > 0 ? of(error) : throwError(this.getErrorMessage())
  //         ))
  //       )
  //     );
  // }

