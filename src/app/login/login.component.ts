import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm;
  submitted = false;

  constructor(private usersService: UsersService) { 
    this.loginForm= new FormGroup({
      username: new FormControl('', Validators.required)
    });
  }

  ngOnInit() {
  }

  get f() { return this.loginForm.controls; }

  onSubmit(){
    this.submitted = true;
    if (this.loginForm.invalid) {
      console.log("It's invalid form");
      return;
    }
    this.usersService.login(this.loginForm.controls['username'].value).subscribe(
      data => {
        console.log(data);
      }
    );
  }

}
