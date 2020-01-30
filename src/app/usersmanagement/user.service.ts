import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { User } from "./user.model";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { map, tap } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class UserService {
  private _user = new BehaviorSubject<User[]>(null);

  get users() {
    return this._user.asObservable();
  }

  constructor(private http: HttpClient) {}

  addUser(user: any) {
    // const users = {
    //   email: user.email,
    //   password: user.password,
    //   role: user.role,
    //   status: user.status
    // };
    return this.http.post<User>(environment.siteUrl + '/users.json', user);
  }

  getUser() {
    return this.http.get<User[]>(environment.siteUrl + '/users.json').pipe(
      map(res => {
        if (!res) {
          return;
        }
        // console.log(Object.keys(res));
        const users = Object.keys(res).map((id, i) => {
          return new User(
            id,
            res[Object.keys(res)[i]].email,
            res[Object.keys(res)[i]].token,
            res[Object.keys(res)[i]].role,
            res[Object.keys(res)[i]].status,
          );
        });
        return users;
      }),
      tap(users => {
        this._user.next(users);
      })
    );
  }

  updateUser(user: any, id: string) {
    let data;
    data = {
      role: user.role,
      status: user.status
    };
    return this.http.patch(environment.siteUrl + '/users/' + id + '.json', data);
  }

  deleteUser(id: string) {
    return this.http.delete(environment.siteUrl + '/users/' + id + '.json');
  }
}
