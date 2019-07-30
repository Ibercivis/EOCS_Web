import { Component, OnInit } from '@angular/core';
import { FormGroup,FormControl } from '@angular/forms';
import { RequirementsService } from '../../services/requirements.service';
import { StorageService } from 'src/app/services/storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-insert-requirement',
  templateUrl: './insert-requirement.component.html',
  styleUrls: ['./insert-requirement.component.css']
})
export class InsertRequirementComponent implements OnInit {

  form: FormGroup;
  from = "MANUAL";
  projectSelected;
  account = "";

  constructor(private requirementService : RequirementsService, private storageService: StorageService, private router: Router) {
    this.form= new FormGroup({
      new_requirement: new FormControl('')
    });
   }

  ngOnInit() {
    this.projectSelected = this.storageService.getSelectedProject();
    if(this.projectSelected == null){
      this.router.navigateByUrl('');
    }
    this.account = this.projectSelected.account_name;
  }

  insertRequirement(){
    this.requirementService.insertAndClassifyRequirement(this.account, this.form.value.new_requirement, this.from).subscribe(
      data => {
        this.form.controls['new_requirement'].setValue("");
        alert('Requirement added');
    }, err => console.log("Error " + err));
  }

  accountChange(value){
    this.account = value.substring(value.indexOf(' ')+ 1,value.length);
  }

}
