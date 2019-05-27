import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UploadFileComponent } from './upload-file/upload-file.component';
import { RequirementsComponent } from './requirements/requirements.component';

const routes: Routes = [
  {path:'', component: RequirementsComponent},
  {path:'upload', component: UploadFileComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
