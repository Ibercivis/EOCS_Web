import { Component, OnInit } from '@angular/core';
import { FormGroup,FormControl } from '@angular/forms';
import { RequirementsService } from '../requirements.service';


@Component({
  selector: 'app-new-project',
  templateUrl: './new-project.component.html',
  styleUrls: ['./new-project.component.css']
})
export class NewProjectComponent implements OnInit {

  form: FormGroup;

  constructor(private requirementService : RequirementsService) {
    this.form= new FormGroup({
      name: new FormControl(''),
      twitter_account: new FormControl('')
    });
   }

  ngOnInit() {
  }

  createProject(){
    this.requirementService.addObserveAccount(this.form.value.twitter_account).subscribe(
      data  => {
        console.log(data);
        if(data.message){
          console.log("Added");
        }
      },
      error => {
        console.log(error);
        alert('No added');
      }
      );
  }

}
