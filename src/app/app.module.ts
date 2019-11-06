import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthModule } from './auth/auth.module';
import { MainModule } from './main/main.module';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AlertModalComponent } from './shared/components/alert-modal/alert-modal.component';
import { AlertToastComponent } from './shared/components/alert-toast/alert-toast.component';
import { PageNotFoundComponent } from './shared/pages/page-not-found/page-not-found.component';
import { LodingScreenComponent } from './shared/components/loding-screen/loding-screen.component';
import { LoadingScreenInterceptor } from './shared/interseptors/loading-screen-interceptor';

@NgModule({
  declarations: [
    AppComponent,
    AlertModalComponent,
    AlertToastComponent,
    PageNotFoundComponent,
    LodingScreenComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AuthModule,
    MainModule,
    MDBBootstrapModule.forRoot(),
    NgbModule,
    HttpClientModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoadingScreenInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
