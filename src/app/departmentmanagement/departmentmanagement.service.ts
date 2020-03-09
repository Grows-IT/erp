import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Department } from './departmentmanagement.model';
import { environment } from 'src/environments/environment';
import { map, tap } from 'rxjs/operators';

interface DepartmentResData {
  id: string;
  name: string;
  address: string;
}

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
  private _department = new BehaviorSubject<Department[]>(null);

  get department() {
    return this._department.asObservable();
  }

  constructor(private http: HttpClient) {
  }

  addDepartment(department: any) {
    const departments = {
      position: JSON.stringify(department.position),
      department: department.department,
      // length: department.position.length
    };
    // console.log(departments);
    return this.http.post(environment.erpUrl + '/department', departments);
  }

  getAllDepartments() {
    return this.http.get(environment.erpUrl + '/department').pipe(
      map((resDepartment) => {
        // console.log(resDepartment);
        const departments: Department[] = [];

        for (const key in resDepartment) {
          if (resDepartment.hasOwnProperty(key)) {
            // tslint:disable-next-line: max-line-length
            const department = new Department(resDepartment[key].departmentId, resDepartment[key].position, resDepartment[key].department, resDepartment[key].companyId, resDepartment[key].companyName);
            departments.push(department);
          }
        }
        return departments;
      }),
      tap(departments => {
        this._department.next(departments);
      })
    );
  }

  updateDepartment(department: any, id: string) {
    let data;
    data = {
      departmentId: id,
      position: JSON.stringify(department.position),
      department: department.department,
      // position: department.position,
      // department: department.department,
    };
    // console.log(department.department);

    return this.http.patch(environment.erpUrl + '/department', data);
  }

  deleteDepartment(id: string) {
    let data;
    data = {
      departmentId: id
    };
    // console.log(data);
    return this.http.post(environment.erpUrl + '/deletedepartment/', data);
  }
}
