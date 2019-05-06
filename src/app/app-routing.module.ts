import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UploadFileComponent } from './upload-file/upload-file.component';
import { RequirementsComponent } from './requirements/requirements.component';

const routes: Routes = [
  {path:'', component: UploadFileComponent},
  {path:'requirements', component: RequirementsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
