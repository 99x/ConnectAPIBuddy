// rxjs
import { Observable, throwError, of } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
// angular
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
// services
import { AlertToastService } from '../../../shared/services/alert-toast.service';
// models
import { TestConfiguration } from '../../models/TestConfiguration';

@Injectable()
export class TestConfigService {

  constructor(
    private httpClient: HttpClient,
    public alertToastservice: AlertToastService
  ) { }

  httpHeaders = new HttpHeaders({
    'Content-Type': 'application/json'
  });

  // Handle API errors
  handleError(error: HttpErrorResponse) {
    this.alertToastservice.showError(error.message);
    return of(null);
  }

  // Get Testconfigs
  getTestConfigs(url: string): Observable<TestConfiguration[]> {
    return this.httpClient
      .get<TestConfiguration[]>(url, { headers: this.httpHeaders })
      .pipe(
        retry(2),
        catchError(this.handleError)
      );
  }

  // Post TestConfigs
  postTestConfig(url: string, data: TestConfiguration): Observable<TestConfiguration> {
    return this.httpClient
      .post<TestConfiguration>(url, data, { headers: this.httpHeaders })
      .pipe(
        catchError(this.handleError)
      );
  }
}
