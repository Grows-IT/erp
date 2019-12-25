import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

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
  private _auth = new BehaviorSubject<Auth>(null);

  get auth() {
    return this._auth.asObservable();
  }

  constructor(private http: HttpClient) { }

  login(form) {
    const data = {
      email: form.email,
      password: form.password,
      returnSecureToken: true
    };

    return this.http.post<{email: string, idToken: string}>(environment.authLoginUtl + environment.firebase.apiKey, data).pipe(
      tap(val => {
        const authen = new Auth(val.email, val.idToken);
        this.saveTokenToStorage(authen);
        this._auth.next(authen);
      })
    );
  }

  private saveTokenToStorage(val: Auth) {
    localStorage.setItem('auth', JSON.stringify(val));
  }

  private getTokenFormStorage() {
    return localStorage.getItem('auth');
  }
}
