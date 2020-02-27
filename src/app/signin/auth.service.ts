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
    // public token: string,
  ) { }
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _user = new BehaviorSubject<Auth>(null);
  private _token = new BehaviorSubject<string>(null);
  private _email = new BehaviorSubject<string>(null);
  private sessionLogin;

  get email() {
    return this._user.asObservable();
  }
  get user() {
    return this._user.asObservable();
  }
  get token() {
    return this._token.asObservable();
  }

  constructor(private http: HttpClient, private userService: UserService) { }

  // login(form) {
  //   const data = {
  //     email: form.email,
  //     password: form.password,
  //     returnSecureToken: true
  //   };

  //   return this.http.post<{ email: string, idToken: string }>(environment.authLoginUtl + environment.firebase.apiKey, data).pipe(
  //     switchMap((val) => {
  //       this.sessionLogin = val;
  //       return this.userService.getUser();
  //     }),
  //     tap((users) => {
  //       const user = users.find(u => u.email === this.sessionLogin.email);
  //       const authen = new Auth(this.sessionLogin.email, this.sessionLogin.idToken);
  //       this.saveUserToStorage(authen, user.role);
  //       this._token.next(authen.token);
  //       this._user.next(user);
  //     })
  //   );
  // }
  login(form) {
    const data = {
      email: form.email,
      password: form.password,
    };
    return this.http.post<{ email: string, role: string }>('http://localhost:3333/login', data).pipe(
      tap((user) => {
        // console.log(user);
        // const authen = new Auth(user.email);
        this.saveUserToStorage(user.email);
        this._email.next(user.email);
      })
    );
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
    );
  }


  logout() {
    this._email.next(null);
    // this._user.next(null);
    // this._token.next(null);
    localStorage.clear();
  }


  delete(token) {
    const data = {
      idToken: token
    };
    return this.http.post(environment.deleteAccount + environment.firebase.apiKey, data);
  }

  isLoggedIn() {
    // return this.token.pipe(
    //   first(),
    //   switchMap(token => {
    //     if (!token) {
    //       return this.getTokenFormStorage().pipe(

    //         catchError(() => of(null)),
    //         map(storedtoken => !!storedtoken)
    //       );
    //     }
    //     return of(!!token);
    //   })
    // );

    return this.email.pipe(
      first(),
      switchMap(email => {
        if (!email) {
          return this.getCurrentEmail().pipe(
            catchError(() => of(null)),
            map(storedEmail => !!storedEmail)
          );
        }
        return of(!!email);
      })
    );
  }


  private saveUserToStorage(email) {
    // localStorage.setItem('user', JSON.stringify(val));
    // localStorage.setItem('token', val.token);
    localStorage.setItem('email', email);
    // localStorage.setItem('role', CryptoJS.SHA1(role));
  }

  // getTokenFormStorage() {
  //   return of(localStorage.getItem('token'));
  // }

  // getUserFormStorage() {
  //   // return of(localStorage.getItem('auth'));
  //   return of(JSON.parse(localStorage.getItem('auth')) as User);
  // }

  getCurrentEmail() {
    return of(localStorage.getItem('email'));
  }

  getRoleFormStorage() {
    return of(localStorage.getItem('role'));
  }
}
