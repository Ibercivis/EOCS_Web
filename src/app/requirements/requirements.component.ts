import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Requirement } from '../Requirement';
import { RequirementsService } from '../requirements.service';

@Component({
  selector: 'app-requirements',
  templateUrl: './requirements.component.html',
  styleUrls: ['./requirements.component.css']
})
export class RequirementsComponent implements OnInit {

  requirements: Requirement[];
  filteredOptions: Requirement[] = [];
  searchRequirementForm;
  selectProjectForm;
  sortType = 'text';
  sortReverse = false;
  accounts;
  selectedAccount;


  constructor(private requirementService: RequirementsService) {
    this.selectProjectForm = new FormGroup({
      selectedAccount: new FormControl('')
    });
    this.searchRequirementForm = new FormGroup({
      searchRequirement: new FormControl('')
    });
  }

  ngOnInit() {
    this.getProjects();
    this.searchRequirementForm.controls['searchRequirement'].valueChanges
      .subscribe(
        value => {
          console.log('Filter value changed:' + value);
          this.filterRequirements();
        }
      );
  }

  getProjects() {
    this.requirementService.getProjects().subscribe(apiData => {
      this.accounts = apiData;
      if(this.accounts !== null && this.accounts.length > 0){
        var account_name = this.accounts[0].account_name;
        this.getRequirementsByProject(account_name);
        this.selectProjectForm.controls['selectedAccount'].setValue(account_name, { onlySelf: true });
      }
    });
  }

  accountChange(value) {
    this.searchRequirementForm.controls['searchRequirement'].setValue(null, { onlySelf: true });
    var account = value.substring(value.indexOf(' ') + 1, value.length);
    console.log(account);
    this.getRequirementsByProject(account);
  }

  getRequirements() {
    this.requirementService.getRequirements().subscribe(apiData => (this.requirements = apiData));
  }
  getRequirementsByProject(project) {
    this.requirementService.getRequirementsByProject(project).subscribe(apiData => (this.filteredOptions = this.requirements = apiData));
  }

  filterRequirements() {
    if (this.searchRequirementForm.controls['searchRequirement'].value == null) {
      this.searchRequirementForm.controls['searchRequirement'].value = '';
    }
    this.filteredOptions = this.requirements.filter(requirement =>
      requirement.text.toLowerCase().indexOf(this.searchRequirementForm.controls['searchRequirement'].value.toLowerCase()) !== -1);
  }

  editRequirement(req) {
    alert('Not implemented yet');
    console.log('Edit requirement: ' + req);
  }

  deleteRequirement(req) {
    console.log('Delete requirement: ' + req);
    this.requirementService.deleteRequirement(req)
      .subscribe(data => {
        let index = 0;
        for (let obj of this.filteredOptions) {
          if (obj['status_id'] == req) {
            console.log("Deleting " + obj['status_id']);
            this.filteredOptions.splice(index, 1);
          }
          index++;
        }
      }, error => {
        console.log('error');
      });
  }

}
