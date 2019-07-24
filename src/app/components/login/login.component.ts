import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UsersService } from '../../services/users.service';
import { Router } from '@angular/router';
import { StorageService } from '../../services/storage.service';
import { Session } from '../../model/Session';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm;
  submitted = false;
  loginError = false;
  msgError = "Username not found";

  constructor(private router: Router, private usersService: UsersService, private storageService: StorageService) { 
    this.loginForm= new FormGroup({
      username: new FormControl('', Validators.required)
    });
  }

  ngOnInit() {}

  get f() { return this.loginForm.controls; }

  onSubmit(){
    this.submitted = true;
    if (this.loginForm.invalid) {
      console.log("It's invalid form");
      return;
    }
    let username = this.loginForm.controls['username'].value;
    this.doLogin(username);
  }

  doLogin(username) {
    this.usersService.login(username).subscribe(
      data => {
        this.storageService.setCurrentSession(new Session(data.token, data.id, username));
        this.storageService.triggerEventSession.next(true);
        this.router.navigateByUrl('');
      }, error => {
        if (error) {
          if (error.status == 400) {
            this.loginError = true;
          }
        }
      }
    );
  }

}
