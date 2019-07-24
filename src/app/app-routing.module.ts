import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RequirementsComponent } from './components/requirements/requirements.component';
import { NewProjectComponent } from './components/new-project/new-project.component';
import { InsertRequirementComponent } from './components/insert-requirement/insert-requirement.component';
import { NewEdemocracyProjectComponent } from './components/new-edemocracy-project/new-edemocracy-project.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';

const routes: Routes = [
  {path:'', component: RequirementsComponent},
  {path:'insert', component: InsertRequirementComponent},
  {path:'new_project', component: NewProjectComponent},
  {path:'new_voting/:project', component: NewEdemocracyProjectComponent},
  {path:'register', component: RegisterComponent},
  {path:'login', component: LoginComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
