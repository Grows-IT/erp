import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/signin/auth.service';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { User } from '../user.model';
import { Subscription, Observable } from 'rxjs';
import { switchMap, startWith, map } from 'rxjs/operators';


@Component({
  selector: 'app-userdialog',
  templateUrl: './userdialog.component.html',
  styleUrls: ['./userdialog.component.scss']
})
export class UserdialogComponent implements OnInit {
  err;
  user: FormGroup;
  users: User[];
  userSubscription: Subscription;

  roles = [
    'Admin',
    'Approval',
    'User'
  ];

  status = [
    'Active',
    'Inactive'
  ];

  filteredRole: Observable<string[]>;
  filteredStatus: Observable<string[]>;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private authService: AuthService, private router: Router , private fb: FormBuilder, public dialogRef: MatDialogRef<UserdialogComponent>, private uService: UserService) { }

  ngOnInit() {
    this.userSubscription = this.uService.users.subscribe(users => {
      this.users = users;
    });
    // this.uService.getUser().subscribe();

    if (this.data !== null && this.data !== undefined) {
    this.user = this.fb.group({
      email: [this.data.email, [Validators.required]],
      password: [this.data.password],
      role: [this.data.role, [Validators.required]],
      status: [this.data.status, [Validators.required]]
    });
  } else {
    this.user = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
      role: ['', [Validators.required]],
      status: ['', [Validators.required]]
  });
  }
    this.filteredRole = this.user.controls['role'].valueChanges
    .pipe(
      startWith(''),
      map(val => this.filter(val))
  );
    this.filteredStatus = this.user.controls['status'].valueChanges
    .pipe(
      startWith(''),
      map(val => this.filter1(val))
  );
}

  filter(val: string): string[] {
    return this.roles.filter(option =>
      option.toLowerCase().indexOf(val.toLowerCase()) === 0);
  }

  filter1(val: string): string[] {
    return this.status.filter(option =>
      option.toLowerCase().indexOf(val.toLowerCase()) === 0);
  }

  // signup(type) {
  //   if (type === 0) {
  //     this.authService.signup(this.user.value).pipe(
  //       switchMap(() => this.uService.getUser())
  //     ).subscribe();
  //     this.dialogRef.close();
  //   } else if (type === 1) {
  //     this.uService.updateUser(this.user.value, this.data.id).pipe(
  //       switchMap(() => this.uService.getUser())
  //     ).subscribe();
  //     this.dialogRef.close();
  //   }
  // }

  signup(type) {
    if (type === 0) {
      this.uService.addUser(this.user.value).pipe(
        switchMap(() => this.uService.getUser())
      ).subscribe();
      this.dialogRef.close();
    } else if (type === 1) {
      this.uService.updateUser(this.user.value, this.data.id).pipe(
        switchMap(() => this.uService.getUser())
      ).subscribe();
      this.dialogRef.close();
    }
  }



  close(): void {
    this.dialogRef.close();
  }

}
