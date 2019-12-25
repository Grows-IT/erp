import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { Validators, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router) { }
  // formLogin: FormControl;
  // username: string;
  // password: string;
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  });

  ngOnInit() {

  }
  // developer@grows-it.com
  // Password12!
  login() {
    // if (this.username === 'admin' && this.password === 'password') {
    //   this.router.navigate([""]);
    // } else {
    //   alert('incorrect username or password');
    // }
    console.log(this.loginForm.value);

    this.authService.login(this.loginForm.value).subscribe();

  }

}
