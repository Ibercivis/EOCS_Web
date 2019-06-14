import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { RequirementsService } from '../requirements.service';
import { InsertRequirementComponent } from '../insert-requirement/insert-requirement.component';

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.css']
})
export class UploadFileComponent implements OnInit {

  from = "FILE";
  uploadFileForm;
  requirements;
  contentFile;
  filename;

  constructor(private requirementService: RequirementsService, private parent: InsertRequirementComponent) {
    this.uploadFileForm = new FormGroup({
      file: new FormControl('')
    });
  }

  ngOnInit() { }

  onSubmit() {
    this.requirements = this.contentFile.filter(function (el) {
      return el != null && el.length > 1;
    });
    console.log(this.requirements);

    for (let req of this.requirements) {
      console.log(req);
      let requirement = req.split(",");
      if(requirement.length > 1){
        this.requirementService.insertRequirement(this.parent.account, requirement[0], requirement[1].trim(), this.from).subscribe(
          data => console.log("Added"), err => console.log("Error " + err));
      }
    }
  }

  onFileChange(event) {
    let reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];
      this.filename = file.name;
      reader.readAsText(file);
      reader.onloadend = (e) => {
        this.contentFile = reader.result;
        this.contentFile = this.contentFile.split(/\n/);
      };
    }
  }

  clearFile() {
    this.filename = "";
    this.contentFile = "";
    this.requirements = "";
    this.uploadFileForm.reset();
  }

}
