import { Component, OnInit } from '@angular/core';
import { RequirementsService } from '../requirements.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DateValidator } from '../utils/DateValidator';

@Component({
  selector: 'app-new-edemocracy-project',
  templateUrl: './new-edemocracy-project.component.html',
  styleUrls: ['./new-edemocracy-project.component.css']
})
export class NewEdemocracyProjectComponent implements OnInit {

  form: FormGroup;
  project;
  requirements;
  submitted = false;
  candidatesGreaterEndDate = false;

  constructor(private requirementService: RequirementsService, 
    private route: ActivatedRoute, private router: Router) { 
    this.form= new FormGroup({
      name: new FormControl('', Validators.required),
      candidatesDate: new FormControl('', [Validators.required, DateValidator()]),
      endDate: new FormControl('', [Validators.required, DateValidator()])
    });
  }

  ngOnInit() {
    this.project = this.route.snapshot.paramMap.get("project");
    this.form.controls['name'].setValue(this.project, { onlySelf: true });
    this.requirements = this.requirementService.getRequirements();
    console.log(this.requirements);
  }


  get f() { return this.form.controls; }

  createProjectEdemocracy() {

    //Validating ...
    this.submitted = true;
    // stop here if form is invalid
    if (!this.requirements || this.form.invalid) {
      console.log("It's invalid form");
      return;
    }

    console.log("##########");
    console.log(this.project);
    console.log(this.requirements);

    let timeOffset = new Date().getTimezoneOffset()/60;

    let candidatesDateJSON = this.form.controls['candidatesDate'].value;
    let candidatesDate = new Date(candidatesDateJSON.year, candidatesDateJSON.month -1,
       candidatesDateJSON.day + (timeOffset > 0 ? -1 : 1));

    let endDateJSON = this.form.controls['endDate'].value;
    let endDate = new Date(endDateJSON.year, endDateJSON.month -1, endDateJSON.day + (timeOffset > 0 ? -1 : 1));   

    if(candidatesDate > endDate){
      this.candidatesGreaterEndDate = true;
      console.log("candidatesDate can not be greater than endDate");
      return;
    }

    this.requirementService.createProjectEdemocracy(this.project, this.requirements, candidatesDate.toISOString(), endDate.toISOString()).subscribe(
      data => {
        console.log(data);
        if (data) {
          console.log("Added in edemocracy");
          alert('Vote created');
          this.router.navigateByUrl('');
        }
      },
      error => {
        alert('No vote created');
      }
    );
  }

}
