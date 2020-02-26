import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Department } from './departmentmanagement.model';
import { DepartmentService } from './departmentmanagement.service';
import { switchMap } from 'rxjs/operators';
import { MatDialog } from '@angular/material';
import { DepartmentdialogComponent } from '../departmentmanagement/departmentdialog/departmentdialog.component';
import { ConfirmDialogComponent } from '../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-departmentmanagement',
  templateUrl: './departmentmanagement.component.html',
  styleUrls: ['./departmentmanagement.component.scss']
})
export class DepartmentmanagementComponent implements OnInit {

  departmentCol: string[] = ['departmentId', 'department' , 'position' , 'edit', 'delete'];
  departmentSubscription: Subscription;
  departments: Department[];

  constructor(private dService: DepartmentService, public dialog: MatDialog) { }

  ngOnInit() {
    this.departmentSubscription = this.dService.department.subscribe(departments => {
      this.departments = departments;
    });
    this.dService.getAllDepartments().subscribe();
  }

  openDepartment() {
    const dialogRef = this.dialog.open(DepartmentdialogComponent, {
      panelClass: 'nopadding-dialog',
      width: '30vw',
      height: '60vh',
      disableClose: false,
      autoFocus: false,
    });
  }

  editDepartment(department) {
    const dialogRef = this.dialog.open(DepartmentdialogComponent, {
      panelClass: 'nopadding-dialog',
      width: '30vw',
      height: '60vh',
      disableClose: false,
      autoFocus: false,
      data: department,
    });

    dialogRef.afterClosed().pipe(
      switchMap(() => {
        return this.dService.getAllDepartments();
      })
    ).subscribe();
  }

  delete(id: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      panelClass: 'nopadding-dialog',
      width: '400px',
      height: '200px',
      disableClose: true,
      autoFocus: false,
      data: { id, 'from': 'department' }
    });
  }

}
