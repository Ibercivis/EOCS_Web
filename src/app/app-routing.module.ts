import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RequirementsComponent } from './requirements/requirements.component';
import { NewProjectComponent } from './new-project/new-project.component';
import { InsertRequirementComponent } from './insert-requirement/insert-requirement.component';
import { NewEdemocracyProjectComponent } from './new-edemocracy-project/new-edemocracy-project.component';

const routes: Routes = [
  {path:'', component: RequirementsComponent},
  {path:'insert', component: InsertRequirementComponent},
  {path:'new_project', component: NewProjectComponent},
  {path:'new_voting/:project', component: NewEdemocracyProjectComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
