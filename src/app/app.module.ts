import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { HttpClientModule } from '@angular/common/http';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UploadFileComponent } from './upload-file/upload-file.component';
import { RequirementsComponent } from './requirements/requirements.component';
import { OrderModule } from 'ngx-order-pipe';
import { NewProjectComponent } from './new-project/new-project.component';
import { InsertRequirementComponent } from './insert-requirement/insert-requirement.component';

@NgModule({
  declarations: [
    AppComponent,
    UploadFileComponent,
    RequirementsComponent,
    NewProjectComponent,
    InsertRequirementComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    NgbModule,
    MatProgressSpinnerModule,
    OrderModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
