import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { Validators, FormControl, FormGroup } from '@angular/forms';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {
  err;

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  });

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {

    this.authService.isLoggedIn().subscribe(status => {
      if (status) {
        this.router.navigate(['']);
      }
    });
  }

  login() {
    this.authService.login(this.loginForm.value).subscribe(
      () => {
        this.router.navigate(['']);
      }, (err) => {
        this.err = err;
      });
  }

  logout() {
    this.authService.logout();
  }

}
