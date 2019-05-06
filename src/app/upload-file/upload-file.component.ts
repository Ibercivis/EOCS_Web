import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.css']
})
export class UploadFileComponent implements OnInit {
  
  uploadFileForm;
  requirements;
  contentFile;
  filename;

  constructor() {
    this.uploadFileForm= new FormGroup({
      file: new FormControl('')
    });
   }

  ngOnInit() {

  }

  onSubmit() {
    this.requirements = this.contentFile.filter(function (el) {
      return el != null && el.length > 1;
    });
    console.log(this.requirements);
  }

  onFileChange(event) {
    let reader = new FileReader();
    if(event.target.files && event.target.files.length > 0) {
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
