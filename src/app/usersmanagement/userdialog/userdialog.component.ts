import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { AuthService } from "src/app/signin/auth.service";
import { Router } from "@angular/router";
import { UserService } from "../user.service";
import { User } from "../user.model";
import { Subscription, Observable } from "rxjs";
import { switchMap, startWith, map } from "rxjs/operators";
import { DepartmentService } from "src/app/departmentmanagement/departmentmanagement.service";
import { Department } from "src/app/departmentmanagement/departmentmanagement.model";
import { TOUCH_BUFFER_MS } from "@angular/cdk/a11y";

@Component({
  selector: "app-userdialog",
  templateUrl: "./userdialog.component.html",
  styleUrls: ["./userdialog.component.scss"]
})
export class UserdialogComponent implements OnInit {
  err;
  user: FormGroup;
  users: User[];
  department: Department[];
  userSubscription: Subscription;
  departmentSubscription: Subscription;

  roles = ["admin", "approval", "user"];

  status = ["active", "inactive"];

  filteredRole: Observable<string[]>;
  filteredStatus: Observable<string[]>;
  filteredDepartment: Observable<string[]>;
  // filteredPosition: Observable<string[]>;

  allposition: any;
  companyName: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<UserdialogComponent>,
    private uService: UserService,
    private dService: DepartmentService
  ) {}

  ngOnInit() {
    this.departmentSubscription = this.dService.department.subscribe(
      departments => {
        this.department = departments;
      }
    );
    this.dService.getAllDepartments().subscribe();
    this.userSubscription = this.uService.users.subscribe(users => {
      this.users = users;
    });
    this.uService.getUser().subscribe();

    if (this.data !== null && this.data !== undefined) {
      this.user = this.fb.group({
        name: [this.data.user.name, [Validators.required]],
        email: [this.data.user.email, [Validators.required]],
        department: [this.data.departmentName, [Validators.required]],
        position: [this.data.user.position, [Validators.required]],
        // password: [this.data.password],
        role: [this.data.user.role, [Validators.required]],
        status: [this.data.user.status, [Validators.required]]
      });
    } else {
      this.user = this.fb.group({
        name: ["", [Validators.required]],
        email: ["", [Validators.required]],
        password: ["", [Validators.required]],
        department: ["", [Validators.required]],
        position: ["", [Validators.required]],
        role: ["", [Validators.required]],
        status: ["", [Validators.required]]
      });
    }
    this.filteredRole = this.user.controls["role"].valueChanges.pipe(
      startWith(""),
      map(val => this.filterRole(val))
    );
    this.filteredStatus = this.user.controls["status"].valueChanges.pipe(
      startWith(""),
      map(val => this.filterStatus(val))
    );
    this.filteredDepartment = this.user.controls[
      "department"
    ].valueChanges.pipe(
      startWith(""),
      map(val => this.filterDepartment(val))
    );
    // this.filteredPosition = this.user.controls["position"].valueChanges.pipe(
    //   startWith(""),
    //   map(val => this.filterPosition(val))
    // );
  }

  filterRole(val: string): string[] {
    return this.roles.filter(
      option => option.toLowerCase().indexOf(val.toLowerCase()) === 0
    );
  }

  filterStatus(val: string): string[] {
    return this.status.filter(
      option => option.toLowerCase().indexOf(val.toLowerCase()) === 0
    );
  }

  filterDepartment(val: string): string[] {
    const department = this.department.map(de => de.department);

    return department.filter(
      option => option.toLowerCase().indexOf(val.toLowerCase()) === 0
    );
  }

  allPosition() {
    const departName = this.user.get("department").value;
    const dep = this.department.find(d => d.department === departName);
    if (!dep) {
      return null;
    }
    const position = dep.position;
    const split = position.split(",");

    // this.allposition = split;

    return split;
  }

  // filterPosition(val: string): string[] {
  //   //   const position = this.allPosition();
  //   //   const cusST = position.split(",");
  //   //   console.log(position);

  //   //   // const departName = this.user.get("department").value;
  //   //   // const dep = this.department.find(d => d.department === departName);
  //   //   // // const cusST = dep.position.split(",")
  //   //   // const position = this.department.map(de => de.position);
  //   //   // console.log(position);

  //   return this.allposition.filter(
  //     de => de.toLowerCase().indexOf(val.toLowerCase()) === 0
  //   );
  // }

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

  getCompany() {
    this.authService.getCurrentCompany().subscribe(res => {
      this.companyName = res;
    });
    return this.companyName;
    // );
  }

  signup(type) {
    if (type === 0) {
      this.uService
        .addUser(this.user.value, this.getCompany())
        .pipe(switchMap(() => this.uService.getUser()))
        .subscribe();
      this.dialogRef.close();
    } else if (type === 1) {
      this.uService
        .updateUser(this.user.value, this.data.id)
        .pipe(switchMap(() => this.uService.getUser()))
        .subscribe();
      console.log(this.user.value);

      this.dialogRef.close();
    }
  }

  close(): void {
    this.dialogRef.close();
  }
}
