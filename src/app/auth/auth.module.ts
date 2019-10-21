import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { HttpClientModule } from '@angular/common/http';
import { AngularMaterialModule } from '../angular-material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AppRoutingModule } from '../app-routing.module';
import { GoogleLoginProvider, FacebookLoginProvider, AuthService } from 'angular-6-social-login';
import { SocialLoginModule, AuthServiceConfig } from 'angular-6-social-login';

export function socialConfigs() {
  const config = new AuthServiceConfig(
    [
      {
        id: FacebookLoginProvider.PROVIDER_ID,
        provider: new FacebookLoginProvider(
          '1268098000038340'
        )
      },
      {
        id: GoogleLoginProvider.PROVIDER_ID,
        provider: new GoogleLoginProvider(
          '909626211296-7iuo183lqmsm6kjuou0esn6g8o6ftdvt.apps.googleusercontent.com'
        )
      }
    ]
  );
  return config;
}

@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    ChangePasswordComponent
  ],

  imports: [
    CommonModule,
    AngularMaterialModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    SocialLoginModule
  ],
  providers: [
    AuthService,
    {
      provide: AuthServiceConfig,
      useFactory: socialConfigs
    }
  ]
})
export class AuthModule { }
