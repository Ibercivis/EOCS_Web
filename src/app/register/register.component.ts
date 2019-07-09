import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm;
  submitted = false;

  constructor(private usersService: UsersService) { 
    this.registerForm= new FormGroup({
      username: new FormControl('', Validators.required)
    });
  }

  ngOnInit() {
  }
  
  get f() { return this.registerForm.controls; }

  onSubmit(){
    this.submitted = true;
    if (this.registerForm.invalid) {
      console.log("It's invalid form");
      return;
    }
    this.usersService.register(this.registerForm.controls['username'].value).subscribe(
      data => {
        console.log(data);
      }
    );
  }

}
