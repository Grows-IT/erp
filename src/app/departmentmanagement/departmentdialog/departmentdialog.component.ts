import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DepartmentService } from "src/app/departmentmanagement/departmentmanagement.service";
import { Department } from "src/app/departmentmanagement/departmentmanagement.model";
import { Subscription } from 'rxjs';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-departmentdialog',
  templateUrl: './departmentdialog.component.html',
  styleUrls: ['./departmentdialog.component.scss']
})
export class DepartmentdialogComponent implements OnInit {
  departments: Department[];
  departmentSubscription: Subscription;
  department: FormGroup;

  // tslint:disable-next-line: max-line-length
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder, public dialogRef: MatDialogRef<DepartmentdialogComponent>, private dService: DepartmentService) { }

  ngOnInit() {
    this.departmentSubscription = this.dService.department.subscribe(departments => {
      this.departments = departments;
    });
    this.dService.getAllDepartments().subscribe();

    if (this.data !== null && this.data !== undefined) {
      this.department = this.fb.group({
        department: [this.data.department, [Validators.required]],
        position: [this.data.position, [Validators.required]],
      });
    } else {
      this.department = this.fb.group({
        department: ['', [Validators.required]],
        position: ['', [Validators.required]],
      });
    }
  }

  close(): void {
    this.dialogRef.close();
  }

  onConfirmClick(status) {
    if (status === 0) {
      console.log(this.departments.values);
      this.dService.addDepartment(this.department.value).pipe(
        switchMap(() => this.dService.getAllDepartments())
      ).subscribe();
    } else if (status === 1) {
      this.dService.updateDepartment(this.department.value, this.data.departmentId).pipe(
        switchMap(() => this.dService.getAllDepartments())
      ).subscribe();
      console.log(this.department.value);
      console.log(this.data.departmentId);


      // }
    }
    this.dialogRef.close();
  }

}
