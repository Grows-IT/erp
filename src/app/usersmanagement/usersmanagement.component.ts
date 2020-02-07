import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { UserdialogComponent } from './userdialog/userdialog.component';
import { AuthService } from 'src/app/signin/auth.service';
import { UserService } from './user.service';
import { Subscription } from 'rxjs';
import { User } from './user.model';
import { switchMap } from 'rxjs/operators';


@Component({
  selector: 'app-usersmanagement',
  templateUrl: './usersmanagement.component.html',
  styleUrls: ['./usersmanagement.component.scss']
})
export class UsersmanagementComponent implements OnInit {

  userCol: string[] = ['email', 'role' , 'status' , 'edit', 'delete'];
  userSubscription: Subscription;
  users: User[];

  constructor(private authService: AuthService, public dialog: MatDialog, private uService: UserService) { }

  ngOnInit() {

    this.userSubscription = this.uService.users.subscribe(users => {
      this.users = users;
    });
    this.uService.getUser().subscribe();
  }

  openUser() {
    const dialogRef = this.dialog.open(UserdialogComponent, {
      panelClass: 'nopadding-dialog',
      width: '30vw',
      height: '75vh',
      disableClose: false,
      autoFocus: false,
    });
  }

  editCustomer(user) {
    const dialogRef = this.dialog.open(UserdialogComponent, {
      panelClass: 'nopadding-dialog',
      width: '30vw',
      height: '75vh',
      disableClose: false,
      autoFocus: false,
      data: user,
    });

    dialogRef.afterClosed().pipe(
      switchMap(() => {
        return this.uService.getUser();
      })
    ).subscribe();
  }


  delete(id: string, token: string) {
    this.uService.deleteUser(id).pipe(
      switchMap(() => this.uService.getUser()),
      switchMap(() => this.authService.delete(token))
    ).subscribe();
  }

}
