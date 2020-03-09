import { Injectable } from '@angular/core';
import { BehaviorSubject, observable } from 'rxjs';
import { User } from './user.model';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private _user = new BehaviorSubject<User[]>(null);

  get users() {
    return this._user.asObservable();
  }

  constructor(private http: HttpClient) {}

  addUser(user: any, companyName) {
    const users = {
      name: user.name,
      email: user.email,
      password: user.password,
      role: user.role,
      status: user.status,
      department: user.department,
      position: user.position,
      company: companyName
    };
    // console.log(companyName);

    return this.http.post(environment.erpUrl + '/user', users);
    // return this.http.post<User>(environment.siteUrl + '/users.json', user);
  }

  getUser() {
    return this.http.get(environment.erpUrl + '/user').pipe(
      map(res => {
        // console.log(Object.keys(res));
        const customers = Object.keys(res).map((id, i) => {
          return new User(
            res[Object.keys(res)[i]].userId,
            res[Object.keys(res)[i]].email,
            res[Object.keys(res)[i]].name,
            res[Object.keys(res)[i]].departmentId,
            res[Object.keys(res)[i]].companyId,
            res[Object.keys(res)[i]].role,
            res[Object.keys(res)[i]].userStatus,
            res[Object.keys(res)[i]].position,
            res[Object.keys(res)[i]].department,
          );
        });
        return customers;
      }),
      tap(users => {
        this._user.next(users);
      })
    );
  }

  updateUser(user: any, id: string) {
    const users = {
      name: user.name,
      email: user.email,
      department: user.department,
      position: user.position,
      role: user.role,
      status: user.status,
      userId: id
    };
    // console.log(user.role);

    return this.http.patch(environment.erpUrl + '/user', users);
  }

  deleteUser(id: string) {
    let data;
    data = {
      userId: id
    };
    return this.http.post(environment.erpUrl + '/deleteuser', data);
  }
}
