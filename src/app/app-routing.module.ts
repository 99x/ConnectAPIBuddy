import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { TestDetailsComponent } from './main/test-details/test-details.component';
import { TestSettingsComponent } from './main/test-settings/test-settings.component';
import { PageNotFoundComponent } from './shared/pages/page-not-found/page-not-found.component';
import { combineAll } from 'rxjs/operators';


const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login'
  },

  {
    path: 'login/register',
    pathMatch: 'full',
    redirectTo: 'register'
  },

  {
    path: 'register/login',
    pathMatch: 'full',
    redirectTo: 'login'
  },

  {
    path: 'login',
    component: LoginComponent,
    data: {
      title: 'Login Page'
    }
  },
  {
    path: 'register',
    component: RegisterComponent,
    data: {
      title: 'Register Page'
    }
  },

  {
    path: 'Mainpage',
    component: TestDetailsComponent,
    data: {
      title: 'Main Page'
    }
  },

  {
    path: 'modal',
    component: TestSettingsComponent
  },

  {
    path: '**',
    component: PageNotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
