import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestDetailsComponent } from './test-details/test-details.component';
import { AngularMaterialModule } from '../angular-material.module';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { TestSettingsComponent } from './test-settings/test-settings.component';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { TestConfigService } from './shared/services/test-config.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgOptionHighlightModule } from '@ng-select/ng-option-highlight';

@NgModule({
  declarations: [
    TestDetailsComponent,
    NavBarComponent,
    TestSettingsComponent
  ],
  imports: [
    CommonModule,
    AngularMaterialModule,
    MDBBootstrapModule.forRoot(),
    NgbModule,
    ReactiveFormsModule,
    NgxJsonViewerModule,
    FormsModule,
    NgSelectModule,
    NgOptionHighlightModule
  ],
  entryComponents: [
    TestSettingsComponent
  ],
  providers: [TestConfigService],
  bootstrap: [TestSettingsComponent]
})
export class MainModule { }
