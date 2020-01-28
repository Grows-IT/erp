import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/signin/auth.service';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { User } from '../user.model';
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';

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

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private authService: AuthService, private router: Router , private fb: FormBuilder, public dialogRef: MatDialogRef<UserdialogComponent>, private uService: UserService) { }

  ngOnInit() {
    this.userSubscription = this.uService.users.subscribe(users => {
      this.users = users;
    });
    // this.uService.getUser().subscribe();

    if (this.data !== null && this.data !== undefined) {
    this.user = this.fb.group({
      email: [this.data.email, [Validators.required]],
      password: [this.data.password, [Validators.required]],
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
}

  signup() {
    this.authService.signup(this.user.value).subscribe();
    this.dialogRef.close();
    this.uService.addUser(this.user.value).pipe(
      switchMap(() => this.uService.getUser())
    ).subscribe();
  }

  close(): void {
    this.dialogRef.close();
  }

}
