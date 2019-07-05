import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Requirement } from '../Requirement';
import { RequirementsService } from '../requirements.service';
import { Phase } from '../phase.enum';

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
  projectSelected;
  phase;
  phase_candidates_at;
  phase_end_at;

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
          this.filterRequirements();
        }
      );
  }

  getProjects() {
    this.requirementService.getProjects().subscribe(apiData => {
      this.accounts = apiData;
      this.requirementService.getProjectsEdemocracy().subscribe(data => {
        let projectsEdemocracy = data;
        if (this.accounts !== null && this.accounts.length > 0) {
          this.projectSelected = this.accounts[0];
          var account_name = this.accounts[0].account_name;
          this.getRequirementsByProject(account_name);
          this.selectProjectForm.controls['selectedAccount'].setValue(account_name, { onlySelf: true });
          this.associateProjectWithEdemocracy(projectsEdemocracy);
        }
      });
    });
  }

  associateProjectWithEdemocracy(projectsEdemocracy) {
    for (let account of this.accounts) {
      for (let projectEde of projectsEdemocracy) {
        if (account.account_name == projectEde.title) {
          account.idEde = projectEde.id;
          break;
        }
      }
    }
  }

  hasDates() : boolean {
    if(this.projectSelected && this.projectSelected.idEde){
      return true;
    }
    return false;
  }

  accountChange(value) {
    this.searchRequirementForm.controls['searchRequirement'].setValue(null, { onlySelf: true });
    var account = value.substring(value.indexOf(' ') + 1, value.length);
    for (let acc of this.accounts) {
      if (acc.account_name == account) {
        this.projectSelected = acc;
      }
    }
    console.log(account);
    this.getRequirementsByProject(account);
  }

  getRequirementsByProject(project) {
    this.requirementService.getRequirementsByProject(project).subscribe(
      apiData => {
        this.filteredOptions = this.requirements = apiData;
        console.log("idEde=" + this.projectSelected.idEde);
        if (this.projectSelected.idEde) {        //call Edemocracy and get more info
          this.requirementService.getProjectEdemocracy(this.projectSelected.idEde).subscribe(
            data => {
              this.phase_candidates_at = data.phase_candidates_at;
              this.phase_end_at = data.phase_end_at;
              this.phase = this.getProjectPhase();
              console.log("Phase = " + this.phase);
            });
        } else {
          this.phase = Phase.PHASE_0;
        }
      });
  }

  private getProjectPhase() : String {
    var phase; 
    var a = new Date().getTime() - new Date(this.phase_candidates_at).getTime();
    var b = new Date().getTime() - new Date(this.phase_end_at).getTime();
    if (a > 0) {
      if (b > 0) {
        phase = Phase.PHASE_3;
      } else {
        phase = Phase.PHASE_2;
      }
    } else {
      phase = Phase.PHASE_1;
    }
    return phase;
  }

  filterRequirements() {
    if (this.searchRequirementForm.controls['searchRequirement'].value == null) {
      this.searchRequirementForm.controls['searchRequirement'].value = '';
    }
    if (this.requirements != null) {
      this.filteredOptions = this.requirements.filter(requirement =>
        requirement.text.toLowerCase().indexOf(
          this.searchRequirementForm.controls['searchRequirement'].value.toLowerCase()) !== -1);
    }
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
            break;
          }
          index++;
        }
      }, error => {
        console.log('Error deleting requirement');
      });
  }

  deleteProject() {
    let selectedAccount = this.selectProjectForm.controls['selectedAccount'].value;
    console.log('Delete project: ' + selectedAccount);
    this.requirementService.deleteProject(selectedAccount)
      .subscribe(data => {
        alert('Project account deleted');
        //Delete all Project's requirements
        this.deleteAllRequirements(selectedAccount);
        this.getProjects();
      }, error => {
        console.log('Error deleting project');
      });
  }

  deleteAllRequirements(selectedAccount) {
    console.log('Delete requirements from: ' + selectedAccount);
    this.requirementService.deleteProjectRequirements(selectedAccount)
      .subscribe(data => {
        console.log('Success deleting project requirements');
      }, error => {
        console.log('Error deleting project requirements');
      });
  }

  createProjectEdemocracy() {
    let project = this.selectProjectForm.controls['selectedAccount'].value;
    this.requirementService.createProjectEdemocracy(project, this.requirements).subscribe(
      data => {
        console.log(data);
        if (data) {
          console.log("Added in edemocracy");
          alert('Vote created');
        }
      },
      error => {
        alert('No vote created');
      }
    );
  }
}
