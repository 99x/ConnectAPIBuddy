// rxjs
import { Observable, throwError, of, Observer, TimeoutError, from } from 'rxjs';
import { retry, catchError, delay, mergeMap, retryWhen, timeout } from 'rxjs/operators';
// angular
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
// models
import { TestSettings } from '../models/TestSettings';
import { DeliveryRequest } from '../models/DeliveryRequest';
import { DeliveryResponse } from '../models/DeliveryResponse';
// services
import { AlertToastService } from '../../shared/services/alert-toast.service';

@Injectable()
export class ApiService {

  private httpHeaders: HttpHeaders;
  private testSettings = new TestSettings();
  BASE_URL = 'https://localhost:5001/api/TestTrigger';

  constructor(
    private httpClient: HttpClient,
    public toastService: AlertToastService
  ) { }

  // Handle backend errors
  private handleError(error: HttpErrorResponse): Observable<DeliveryResponse> {

    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred
      this.toastService.showError(error.error.message);

    } else if (error instanceof TimeoutError) {
      // Timeout error occured
      this.toastService.showError('Could not get any response. ' + error.message);

    } else {
      // The backend returned an unsuccessful response code
      if (error.status === 0) {
        this.toastService.showError('Could not get any response. There was an error connecting to ' + error.url);

      } else {
        this.toastService.showError(error.statusText);
      }
    }
    return of(null);
  }


  // Post data
  postData(req: DeliveryRequest): Observable<DeliveryResponse | null> {
    this.httpHeaders = new HttpHeaders();
    return this.httpClient
      .post<DeliveryResponse>(this.BASE_URL, req, { headers: this.httpHeaders })
      .pipe(
        timeout(this.testSettings.timeOutMs + 2000),
        retry(this.testSettings.maxRetry),
        catchError((err) => (this.handleError(err)))
      );
  }

}


