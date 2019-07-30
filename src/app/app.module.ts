import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import {MatCardModule} from '@angular/material';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UploadFileComponent } from './components/upload-file/upload-file.component';
import { RequirementsComponent } from './components/requirements/requirements.component';
import { OrderModule } from 'ngx-order-pipe';
import { NewProjectComponent } from './components/new-project/new-project.component';
import { InsertRequirementComponent } from './components/insert-requirement/insert-requirement.component';
import { NewEdemocracyProjectComponent } from './components/new-edemocracy-project/new-edemocracy-project.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { FrontpageComponent } from './frontpage/frontpage.component';

@NgModule({
  declarations: [
    AppComponent,
    UploadFileComponent,
    RequirementsComponent,
    NewProjectComponent,
    InsertRequirementComponent,
    NewEdemocracyProjectComponent,
    RegisterComponent,
    LoginComponent,
    FrontpageComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    NgbModule,
    OrderModule,
    MatCardModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
