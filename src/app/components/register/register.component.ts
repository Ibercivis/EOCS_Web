import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UsersService } from '../../services/users.service';
import { Router } from '@angular/router';
import { LoginComponent } from '../login/login.component';

@Component({
  providers: [LoginComponent],
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm;
  submitted = false;
  registerError = false;
  msgError = "Username has already been taken";

  constructor(private usersService: UsersService, private router: Router, private logComp: LoginComponent) {
    this.registerForm = new FormGroup({
      username: new FormControl('', Validators.required)
    });
  }

  ngOnInit() { }

  get f() { return this.registerForm.controls; }

  onSubmit() {
    this.submitted = true;
    if (this.registerForm.invalid) {
      console.log("It's invalid form");
      return;
    }
    let username = this.registerForm.controls['username'].value;
    this.usersService.register(username).subscribe(
      data => {
        console.log(data);
        this.logComp.doLogin(username);
      }, error => {
        if (error) {
          if (error.status == 400) {
            this.registerError = true;
          }
        }
        console.log(error);
      }
    );
  }

}
