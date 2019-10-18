import { Injectable } from '@angular/core';
import { Observable, throwError, of } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { HeaderVal } from '../models/Header';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private httpHeaders: HttpHeaders;

  constructor(
    private httpClient: HttpClient
  ) { }

  // Handle API errors
  handleError(error: HttpErrorResponse) {
    return of({
      status: error.status,
      statusText: error.message,
      body: error.error
    });
  }

  // Get data
  getData(url: string, headers: HeaderVal[]): Observable<any> {
    this.httpHeaders = new HttpHeaders();
    if (headers.length > 0) {
      headers.forEach(element => {
        this.httpHeaders.append(element.header, element.value);
      });
    }
    console.log(this.httpHeaders);
    return this.httpClient
      .get(url, { observe: 'response', headers: this.httpHeaders })
      .pipe(
        retry(2),
        catchError(this.handleError)
      );
  }

  // Post data
  postData(url: string, body: any, headers: HeaderVal[]): Observable<any> {
    this.httpHeaders = new HttpHeaders();
    if (headers.length > 0) {
      headers.forEach(element => {
        this.httpHeaders.append(element.header, element.value);
      });
    }
    console.log(this.httpHeaders);
    return this.httpClient
      .post(url, body, { observe: 'response', headers: this.httpHeaders })
      .pipe(
        catchError(this.handleError)
      );
  }

  // Update data
  updateData(url: string, data: object, headers: HeaderVal[]): Observable<any> {
    this.httpHeaders = new HttpHeaders();
    if (headers.length > 0) {
      headers.forEach(element => {
        this.httpHeaders.append(element.header, element.value);
      });
    }
    console.log(this.httpHeaders);
    return this.httpClient
      .put(url, data, { observe: 'response', headers: this.httpHeaders })
      .pipe(
        retry(2),
        catchError(this.handleError)
      );
  }

  // Delete data
  deleteData(url: string, headers: HeaderVal[]): Observable<any> {
    this.httpHeaders = new HttpHeaders();
    if (headers.length > 0) {
      headers.forEach(element => {
        this.httpHeaders.append(element.header, element.value);
      });
    }
    return this.httpClient
      .delete(url, { observe: 'response', headers: this.httpHeaders })
      .pipe(
        retry(2),
        catchError(this.handleError)
      );
  }

}
