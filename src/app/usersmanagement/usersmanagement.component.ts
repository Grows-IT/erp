import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { UserdialogComponent } from './userdialog/userdialog.component';
import { AuthService } from 'src/app/signin/auth.service';
import { UserService } from './user.service';
import { Subscription } from 'rxjs';
import { User } from './user.model';
import { switchMap } from 'rxjs/operators';
import { ConfirmDialogComponent } from '../shared/confirm-dialog/confirm-dialog.component';
import { DepartmentService } from '../departmentmanagement/departmentmanagement.service';
import { Department } from '../departmentmanagement/departmentmanagement.model';


@Component({
  selector: 'app-usersmanagement',
  templateUrl: './usersmanagement.component.html',
  styleUrls: ['./usersmanagement.component.scss']
})
export class UsersmanagementComponent implements OnInit {

  userCol: string[] = ['email', 'role' , 'status' , 'edit', 'delete'];
  userSubscription: Subscription;
  departmentSubscription: Subscription;
  users: User[];
  departments: Department[];

  constructor(private authService: AuthService, public dialog: MatDialog, private uService: UserService, private dService: DepartmentService) { }

  ngOnInit() {

    this.userSubscription = this.uService.users.subscribe(users => {
      this.users = users;
    });
    this.uService.getUser().subscribe();

    this.departmentSubscription = this.dService.department.subscribe(departments => {
      this.departments = departments;
    });
    this.dService.getAllDepartments().subscribe();

  }

  openUser() {
    const dialogRef = this.dialog.open(UserdialogComponent, {
      panelClass: 'nopadding-dialog',
      width: '35vw',
      height: '85vh',
      disableClose: false,
      autoFocus: false,
    });

    dialogRef.afterClosed().pipe(
      switchMap(() => {
        return this.uService.getUser();
      })
    ).subscribe();
  }

  editUser(user) {
    const depart = this.departments.find(d => d.departmentId === user.departmentId);
    const departmentName = depart.department;

    const dialogRef = this.dialog.open(UserdialogComponent, {
      panelClass: 'nopadding-dialog',
      width: '35vw',
      height: '85vh',
      disableClose: false,
      autoFocus: false,
      data: {user, departmentName},
    });

    dialogRef.afterClosed().pipe(
      switchMap(() => {
        return this.uService.getUser();
      })
    ).subscribe();
  }


  delete(id: string, token: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      panelClass: 'nopadding-dialog',
      width: '400px',
      height: '200px',
      disableClose: true,
      autoFocus: false,
      data: { id, token, 'from': 'user' }
    });
    dialogRef.afterClosed().pipe(
      switchMap(() => {
        return this.uService.getUser();
      })
    ).subscribe();
    // this.uService.deleteUser(id).pipe(
    //   switchMap(() => this.uService.getUser()),
    //   // switchMap(() => this.authService.delete(token))
    // ).subscribe();
    // console.log(id);

  }

}
