import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingScreenService {

  // tslint:disable-next-line: variable-name
  private loadingVal: boolean = false;
  loadingStatus: Subject<boolean> = new Subject();

  get loading(): boolean {
    return this.loadingVal;
  }

  set loading(value) {
    this.loadingVal = value;
    this.loadingStatus.next(value);
  }

  startLoading() {
    this.loading = true;
  }

  stopLoading() {
    this.loading = false;
  }
}
