import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { DepartmentService } from "src/app/departmentmanagement/departmentmanagement.service";
import { Department } from "src/app/departmentmanagement/departmentmanagement.model";
import { Subscription } from "rxjs";
import { FormGroup, Validators, FormBuilder, FormArray } from "@angular/forms";
import { switchMap } from "rxjs/operators";
import { ChangeDetectorRef } from "@angular/core";

@Component({
  selector: "app-departmentdialog",
  templateUrl: "./departmentdialog.component.html",
  styleUrls: ["./departmentdialog.component.scss"]
})
export class DepartmentdialogComponent implements OnInit {
  departments: Department[];
  departmentSubscription: Subscription;
  department: FormGroup;

  // tslint:disable-next-line: max-line-length
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private cdRef: ChangeDetectorRef,
    public dialogRef: MatDialogRef<DepartmentdialogComponent>,
    private dService: DepartmentService
  ) {}

  ngOnInit() {
    this.departmentSubscription = this.dService.department.subscribe(
      departments => {
        this.departments = departments;
      }
    );
    this.dService.getAllDepartments().subscribe();

    if (this.data !== null && this.data !== undefined) {
      this.department = this.fb.group({
        department: [this.data.department, [Validators.required]],
        position: this.fb.array([])
        // position: [this.data.position, [Validators.required]],
      });
      for (let i = 0; i < this.getPosition(this.data.department).length; i++) {
        const control = this.department.controls["position"] as FormArray;
        control.push(this.viewDepartmentFormGroup(i));
        // console.log(control.push(this.viewDepartmentFormGroup(0)));
      }
    } else {
      this.department = this.fb.group({
        department: ["", [Validators.required]],
        position: this.fb.array([this.createDepartmentFormGroup()])
        // position: ['', [Validators.required]],
      });
    }
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  close(): void {
    this.dialogRef.close();
  }

  getPosition(department: string) {
    let departs = [];
    const depart = this.departments.find(dep => {
      if (dep.department === department) {
        let deppo = dep.position;
        departs.push(deppo);
      }
    });

    if (!departs) {
      return null;
    }
    const string = JSON.stringify(departs).replace('["', "");
    const string2 = string.replace('"]', "");

    const splitdata = string2.split(",");
    return splitdata;
  }

  private viewDepartmentFormGroup(i) {
    this.data = this.dialogRef.componentInstance.data;
    console.log(this.getPosition(this.data.department));

    return this.fb.group({
      position: [
        this.getPosition(this.data.department)[i],
        [Validators.required]
      ]
    });
  }

  private createDepartmentFormGroup() {
    return this.fb.group({
      position: ["", [Validators.required]]
    });
  }

  onAddRow() {
    const control = this.department.controls["position"] as FormArray;
    control.push(this.createDepartmentFormGroup());
  }

  removeUnit(i: number) {
    const control = this.department.controls["position"] as FormArray;
    control.removeAt(i);
  }

  onConfirmClick(status) {
    if (status === 0) {
      console.log(this.departments.values);
      this.dService
        .addDepartment(this.department.value)
        .pipe(switchMap(() => this.dService.getAllDepartments()))
        .subscribe();
    } else if (status === 1) {
      this.dService
        .updateDepartment(this.department.value, this.data.departmentId)
        .pipe(switchMap(() => this.dService.getAllDepartments()))
        .subscribe();

      console.log(this.data.departmentId);
      console.log(this.department.value);

      // }
    }
    console.log(this.department.value);
    this.dialogRef.close();
  }
}
