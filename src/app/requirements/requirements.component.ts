import { Component, OnInit } from '@angular/core';
import { FormGroup,FormControl } from '@angular/forms';
import { Requirement } from '../Requirement';
import { RequirementsService } from '../requirements.service';

@Component({
  selector: 'app-requirements',
  templateUrl: './requirements.component.html',
  styleUrls: ['./requirements.component.css']
})
export class RequirementsComponent implements OnInit {

  requirements:Requirement[] = [];
  searchRequirementForm;
  selectProjectForm;
  sortType = 'text';
  sortReverse = false;
  accounts;
  selectedAccount;
  defaultAccount = 'ibercivis';

  constructor(private requirementService : RequirementsService) {
    this.searchRequirementForm= new FormGroup({
      searchRequirement: new FormControl('')
    });
    this.selectProjectForm= new FormGroup({
      selectedAccount: new FormControl('')
    });
    this.selectProjectForm.controls['selectedAccount'].setValue(this.defaultAccount, {onlySelf: true});

  }

  ngOnInit() {
    this.getRequirementsByProject(this.defaultAccount);
    this.getProjects();
  }

  getProjects(){
    this.requirementService.getProjects().subscribe(apiData => (this.accounts = apiData));
  }

  getRequirements() {
    this.requirementService.getRequirements().subscribe(apiData => (this.requirements = apiData));
  }
  getRequirementsByProject(project) {
    this.requirementService.getRequirementsByProject(project).subscribe(apiData => (this.requirements = apiData));
  }

  accountChange(value){
    var account = value.substring(value.indexOf(' ')+ 1,value.length);
    console.log(account);
    this.getRequirementsByProject(account);
  }
  
}
