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
  private contentFile;

  constructor() {
    this.uploadFileForm= new FormGroup({
      file: new FormControl('')
    });
   }

  ngOnInit() {

  }

  onSubmit() {
    // TODO: Use EventEmitter with form value
    this.requirements = this.contentFile;
    console.log(this.requirements);
  }

  onFileChange(event) {
    let reader = new FileReader();
    if(event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];
      reader.readAsText(file);
      reader.onloadend = (e) => {
        //console.log(reader.contentFile);
        this.contentFile = reader.result;
        this.contentFile = this.contentFile.split(/\n/);
     };
    }
  }

  clearFile() {
    this.contentFile = "";
    this.requirements = ""; 
    this.uploadFileForm.reset();
  }

}
