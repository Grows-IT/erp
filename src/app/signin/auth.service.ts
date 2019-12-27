import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, of } from 'rxjs';
import { tap, first, switchMap, catchError, map } from 'rxjs/operators';

export class Auth {
  constructor(
    public email: string,
    public token: string
  ) { }
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _user = new BehaviorSubject<Auth>(null);
  private _token = new BehaviorSubject<string>(null);

  get user() {
    return this._user.asObservable();
  }
  get token() {
    return this._token.asObservable();
  }

  constructor(private http: HttpClient) { }

  login(form) {
    const data = {
      email: form.email,
      password: form.password,
      returnSecureToken: true
    };

    return this.http.post<{ email: string, idToken: string }>(environment.authLoginUtl + environment.firebase.apiKey, data).pipe(
      tap(val => {
        console.log(val);
        const authen = new Auth(val.email, val.idToken);
        this.saveUserToStorage(authen);
        // console.log(this.getTokenFormStorage());
        this._token.next(authen.token);
        this._user.next(authen);
      })
    );
  }

  logout() {
    this._user.next(null);
    this._token.next(null);
    localStorage.clear();
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

  private saveUserToStorage(val: Auth) {
    localStorage.setItem('user', JSON.stringify(val));
    localStorage.setItem('token', JSON.stringify(val.token));
  }

  private getTokenFormStorage() {
    return of(localStorage.getItem('token'));
  }

  private getUserFormStorage() {
    return of(localStorage.getItem('user'));
  }
}
