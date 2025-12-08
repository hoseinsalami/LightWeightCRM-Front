import {Injectable} from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import {Observable} from 'rxjs';
import {AuthenticationService} from "../_services/authentication.service";


@Injectable({
  providedIn: 'root'
})
export class AuthGuard  {
  constructor(private authService: AuthenticationService, private router: Router) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    if (this.authService.hasRoutePermission(route.data['permission']))
      return true;
    else {
        return this.router.parseUrl('/');
      //   if (state.url == '/admin')
      // else
      //   return this.router.parseUrl('/admin');
    }
  }

}
