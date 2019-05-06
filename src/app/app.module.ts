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


@NgModule({
  declarations: [
    AppComponent,
    UploadFileComponent,
    RequirementsComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    NgbModule,
    MatProgressSpinnerModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
