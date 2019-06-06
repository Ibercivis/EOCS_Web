import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UploadFileComponent } from './upload-file/upload-file.component';
import { RequirementsComponent } from './requirements/requirements.component';
import { NewProjectComponent } from './new-project/new-project.component';

const routes: Routes = [
  {path:'', component: RequirementsComponent},
  {path:'upload', component: UploadFileComponent},
  {path:'new_project', component: NewProjectComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
