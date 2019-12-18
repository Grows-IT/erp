import { Component, OnInit } from '@angular/core';


import {Router} from '@angular/router';
// import {MatDialog} from '@angular/material';

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

  login(): void {

  }

}
