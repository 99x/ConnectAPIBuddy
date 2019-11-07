import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { LoadingScreenService } from '../../services/loading-screen.service';


@Component({
  selector: 'app-loding-screen',
  templateUrl: './loding-screen.component.html',
  styleUrls: ['./loding-screen.component.css']
})
export class LodingScreenComponent implements AfterViewInit, OnDestroy {
  debounceTime: number = 200;
  loading: boolean = false;
  loadingSubscription: Subscription;

  constructor(
    private loadingScreenService: LoadingScreenService,
    private elmRef: ElementRef,
    private changeDetectorRef: ChangeDetectorRef) {
  }

  ngAfterViewInit(): void {
    this.elmRef.nativeElement.style.display = 'none';
    this.loadingSubscription = this.loadingScreenService.loadingStatus.pipe(debounceTime(this.debounceTime)).subscribe(
      (status: boolean) => {
        this.elmRef.nativeElement.style.display = status ? 'block' : 'none';
        this.changeDetectorRef.detectChanges();
      }
    );
  }

  ngOnDestroy() {
    this.loadingSubscription.unsubscribe();
  }

}
