import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoadingScreenService } from '../../shared/services/loading-screen.service';
import { finalize } from 'rxjs/operators';

@Injectable()
export class LoadingScreenInterceptor implements HttpInterceptor {
    activeRequests: number = 0;

    /**
     * URLs for which the loading screen should not be enabled
     */
    skippUrls = [];

    constructor(private loadingScreenService: LoadingScreenService) {
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let displayLoadingScreen = true;

        for (const skippUrl of this.skippUrls) {
            if (new RegExp(skippUrl).test(request.url)) {
                displayLoadingScreen = false;
                break;
            }
        }

        if (displayLoadingScreen) {
            if (this.activeRequests === 0) {
                this.loadingScreenService.startLoading();
            }
            this.activeRequests++;

            return next.handle(request).pipe(
                finalize(() => {
                    this.activeRequests--;
                    if (this.activeRequests === 0) {
                        this.loadingScreenService.stopLoading();
                    }
                })
            );
        } else {
            return next.handle(request);
        }
    }
}
