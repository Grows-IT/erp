import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SigninGuard implements CanActivate {

  constructor(private router: Router, private authService: AuthService) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot)
    : Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

<<<<<<< HEAD
    return this.authService.isLoggedIn().pipe(
      tap(isLoggedIn => {
        if (!isLoggedIn) {
          this.router.navigate(['/signin']);
          return false;
        }
      })
    );
=======
      // this.router.navigate(['/signin']);
      // return false;
      return true;
>>>>>>> c1add4e519a3188fcc0f04fe140a2b80ee1a36b5
  }
}
