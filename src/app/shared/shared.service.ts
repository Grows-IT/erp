import { Injectable } from '@angular/core';
import { UserService } from '../usersmanagement/user.service';
import { AuthService } from '../signin/auth.service';
import { map, tap } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  email: string;
  private _role = new BehaviorSubject<string>(null);

  get role() {
    return this._role.asObservable();
  }

  constructor(private userService: UserService, private authService: AuthService) { }

  decode(id, key) {
    // const PUSH_CHARS = "-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz";
    // id = id.substring(0, 8);
    // let timestamp = 0;
    // for (let i = 0; i < id.length; i++) {
    //   const c = id.charAt(i);
    //   timestamp = timestamp * 64 + PUSH_CHARS.indexOf(c);
    // }
    const zeroPad = (num, places) => String(num).padStart(places, '0');
    // const date = new Date(timestamp);
    const no = key + zeroPad(id, 6);
    return no;
  }

  getRole() {
    this.getEmail().subscribe(email => this.email = email);
    return this.userService.getUser().pipe(
      map(users => {
        return users.find(user => {
          if (user.email === this.email) {
            return user;
          }
        });
      }),
      tap(user => {
        this._role.next(user.role);
      })
    );
  }

  getEmail() {
    return this.authService.getCurrentEmail();
  }

}
