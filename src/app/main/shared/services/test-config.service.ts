// rxjs
import { Observable, throwError, of } from 'rxjs';
import { retry, catchError, tap } from 'rxjs/operators';
// angular
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
// services
import { AlertToastService } from '../../../shared/services/alert-toast.service';
// models
import { TestConfiguration } from '../../models/TestConfiguration';
import { environment } from '../../../../environments/environment';

@Injectable()
export class TestConfigService {

  private BASE_URL: string;
  constructor(
    private httpClient: HttpClient,
    public alertToastservice: AlertToastService
  ) {
    this.BASE_URL = environment.apiUrls.backend_url;
  }

  httpHeaders = new HttpHeaders({
    'Content-Type': 'application/json'
  });

  // Handle API errors
  handleError(error: HttpErrorResponse) {
    this.alertToastservice.showError(error.message);
    return of(null);
  }

  // Get Testconfigs for a particular user
  getTestConfigs(id: string): Observable<TestConfiguration[] | null> {
    return this.httpClient
      .get<TestConfiguration[]>(`${this.BASE_URL}/TestConfig/user/${id}`, { headers: this.httpHeaders })
      .pipe(
        retry(2),
        catchError((err) => this.handleError(err))
      );
  }

  // Post TestConfigs
  postTestConfig(data: TestConfiguration): Observable<TestConfiguration | null> {
    return this.httpClient
      .post<TestConfiguration>(`${this.BASE_URL}/TestConfig`, data, { headers: this.httpHeaders })
      .pipe(
        catchError((err) => this.handleError(err))
      );
  }

  // Delete a TestConfig
  deleteTestConfig(id: string): Observable<any> {
    return this.httpClient
      .delete(`${this.BASE_URL}/TestConfig/${id}`,{ headers: this.httpHeaders })
      .pipe(
        catchError((err) => this.handleError(err))
      );
  }

  // Delete TestConfigs
  deleteTestConfigs(ids: string[]): Observable<any> {
    return this.httpClient
      .post(`${this.BASE_URL}/TestConfig/deleteMany`, ids, { headers: this.httpHeaders })
      .pipe(
        catchError((err) => this.handleError(err))
      );
  }

  // Update a TestConfig
  updateTestConfig(data: TestConfiguration): Observable<any> {
    return this.httpClient
      .put(`${this.BASE_URL}/TestConfig/${data.id}`, data, {headers: this.httpHeaders})
      .pipe(
        catchError((err) => this.handleError(err))
      )
  }
}
