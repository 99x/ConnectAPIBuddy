import { Injectable } from '@angular/core';
import { Observable, throwError, of, Observer, TimeoutError } from 'rxjs';
import { retry, catchError, delay, mergeMap, retryWhen, timeout } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { HeaderVal } from '../models/Header';
import { TestSettings } from '../models/TestSettings';
import { ApiRequest } from '../models/Request';
import { ApiResult } from '../models/Result';

@Injectable()
export class ApiService {

  private httpHeaders: HttpHeaders;
  private testSettings = new TestSettings();
  BASE_URL = 'https://localhost:5001/api/TestTrigger';

  constructor(
    private httpClient: HttpClient
  ) { }

  // Handle API errors
  private handleError(error: HttpErrorResponse) {
    let errorMessage;
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred
      errorMessage = {
        body: {
          body: error,
          status: error.error.message
        }
      };

    } else if (error instanceof TimeoutError) {
      // Timeout error occured
      errorMessage = {
        body: {
          body: [],
          status: 'Could not get any response. ' + error.message

        }

      };

    } else {
      // The backend returned an unsuccessful response code
      if (error.status === 0) {
        errorMessage = {
          body: {
            body: [],
            status: 'Could not get any response. There was an error connecting to ' + error.url
          }

        };
      } else {
        errorMessage = {
          body: {
            body: error.error,
            status: error.status + '\n' + error.statusText
          }

        };
      }

    }
    return of(errorMessage);
  }


  // Post data
  postData(req: ApiRequest): Observable<any> {
    this.httpHeaders = new HttpHeaders();
    return this.httpClient
      .post<ApiResult>(this.BASE_URL, req, { observe: 'response', headers: this.httpHeaders })
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

