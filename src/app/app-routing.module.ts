import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UploadFileComponent } from './upload-file/upload-file.component';
import { RequirementsComponent } from './requirements/requirements.component';
import { NewProjectComponent } from './new-project/new-project.component';
import { InsertRequirementComponent } from './insert-requirement/insert-requirement.component';

const routes: Routes = [
  {path:'', component: RequirementsComponent},
  {path:'insert', component: InsertRequirementComponent},
  {path:'new_project', component: NewProjectComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
