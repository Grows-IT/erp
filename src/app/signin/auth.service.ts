import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, of } from 'rxjs';
import { tap, first, switchMap, catchError, map, withLatestFrom } from 'rxjs/operators';
import { stringify } from 'querystring';
import { UserService } from '../usersmanagement/user.service';
import { User } from '../usersmanagement/user.model';
import CryptoJS from 'crypto-js';

export class Auth {
  constructor(
    public email: string,
    public token: string,
  ) { }
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _user = new BehaviorSubject<Auth>(null);
  private _token = new BehaviorSubject<string>(null);
  private sessionLogin;

  get user() {
    return this._user.asObservable();
  }
  get token() {
    return this._token.asObservable();
  }

  constructor(private http: HttpClient, private userService: UserService) { }

  login(form) {
    const data = {
      email: form.email,
      password: form.password,
      returnSecureToken: true
    };

    // return this.http.post<{ email: string, idToken: string }>(environment.authLoginUtl + environment.firebase.apiKey, data).pipe(
    //   tap(val => {
    //     console.log(val);
    //     const authen = new Auth(val.email, val.idToken, null);
    //     this.saveUserToStorage(authen);
    //     // console.log(this.getTokenFormStorage());
    //     this._token.next(authen.token);
    //     this._user.next(authen);
    //   })
    // );

    return this.http.post<{ email: string, idToken: string }>(environment.authLoginUtl + environment.firebase.apiKey, data).pipe(
      switchMap((val) => {
        this.sessionLogin = val;
        return this.userService.getUser();
      }),
      tap((users) => {
        const user = users.find(u => u.email === this.sessionLogin.email);
        const authen = new Auth(this.sessionLogin.email, this.sessionLogin.idToken);
        this.saveUserToStorage(authen, user.role);
        this._token.next(authen.token);
        this._user.next(user);
      })
    );

    // Password12!

    // return this.userService.getUser().pipe(
    //   map(users => {
    //     this.u = users.find(user => user.email === form.email);
    //     return this.http.post<{ email: string, idToken: string }>(environment.authLoginUtl + environment.firebase.apiKey, data).pipe(
    //       tap(val => {
    //         console.log(val);
    //         console.log(this.u);

    //         const authen = new Auth(val.email, val.idToken, this.u.role);
    //         this.saveUserToStorage(authen);
    //         // console.log(this.getTokenFormStorage());
    //         this._token.next(authen.token);
    //         this._user.next(this.u);
    //       })
    //     );
    //   }),
    // );
  }

  signup(form) {
    const data = {
      email: form.email,
      password: form.password,
      returnSecureToken: true
    };

    return this.http.post<{ email: string, idToken: string }>(environment.authSignUpUtl + environment.firebase.apiKey, data).pipe(
      switchMap(res => {
        const user = {
          email: form.email,
          token: res.idToken,
          role: form.role,
          status: form.status
        };
        return this.userService.addUser(user);
      })
      // tap(val => {
      //   console.log(val);
      //   const authen = new Auth(val.email, val.idToken);
      //   this.saveUserToStorage(authen);
      //   // console.log(this.getTokenFormStorage());
      //   this._token.next(authen.token);
      //   this._user.next(authen);
      // }),
    );
  }


  logout() {
    this._user.next(null);
    this._token.next(null);
    localStorage.clear();
  }


  delete(token) {
    const data = {
      idToken: token
    };
    return this.http.post(environment.deleteAccount + environment.firebase.apiKey, data);
  }

  isLoggedIn() {
    return this.token.pipe(
      first(),
      switchMap(token => {
        if (!token) {
          return this.getTokenFormStorage().pipe(
            catchError(() => of(null)),
            map(storedtoken => !!storedtoken)
          );
        }
        return of(!!token);
      })
    );
  }


  private saveUserToStorage(val: Auth, role: string) {
    localStorage.setItem('user', JSON.stringify(val));
    localStorage.setItem('token', val.token);
    localStorage.setItem('email', val.email);
    localStorage.setItem('role', CryptoJS.SHA1(role));
  }

  getTokenFormStorage() {
    return of(localStorage.getItem('token'));
  }

  getUserFormStorage() {
    // return of(localStorage.getItem('auth'));
    return of(JSON.parse(localStorage.getItem('auth')) as User);
  }

  getCurrentEmail() {
    return of(localStorage.getItem('email'));
  }

  getRoleFormStorage() {
    return of(localStorage.getItem('role'));
  }
}
