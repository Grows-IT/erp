import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { Validators, FormControl, FormGroup } from '@angular/forms';
import { tap } from 'rxjs/operators';
import { DepartmentService } from '../departmentmanagement/departmentmanagement.service';
import { Subscribable, Subscription } from 'rxjs';
import { Department } from '../departmentmanagement/departmentmanagement.model';
import { UserService } from '../usersmanagement/user.service';
import { User } from '../usersmanagement/user.model';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {
  err;
  departmentSubscription: Subscription;
  userSubscription: Subscription;
  departments: Department[];
  users: User[];

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  });

  constructor(private authService: AuthService, private router: Router, private dService: DepartmentService, private uService: UserService) { }

  ngOnInit() {
    this.departmentSubscription = this.dService.department.subscribe(departments => {
      this.departments = departments;
    });
    this.dService.getAllDepartments().subscribe();
    this.userSubscription = this.uService.users.subscribe(users => {
      this.users = users;
    });
    this.uService.getUser().subscribe();

    this.authService.isLoggedIn().subscribe(status => {
      if (status) {
        this.router.navigate(['']);
      }
    });
  }

  getCompany() {
    const email = this.loginForm.get('email').value;
    const com = this.users.find(u => u.email === email);
    const comId = com.companyId;
    const company = this.departments.find(d => d.companyId === comId);
    return company.companyName;
  }

  login() {
    this.authService.login(this.loginForm.value, this.getCompany()).subscribe(
      () => {
        this.router.navigate(['']);
      }, (err) => {
        this.err = err.error.text;
      });
  }

  logout() {
    this.authService.logout();
  }

}
