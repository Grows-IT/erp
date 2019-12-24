import { Component, OnInit } from '@angular/core';

import {Router} from '@angular/router';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {

  constructor(private router: Router) { }

username: string;
password: string;

  ngOnInit() {
  }

  login() {
    if (this.username === 'admin' && this.password === 'password') {
      this.router.navigate([""]);
    } else {
      alert('incorrect username or password');
    }
  }

}
