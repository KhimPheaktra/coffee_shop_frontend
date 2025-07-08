import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AccountService } from '../../../service/account.service';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { ToastService } from '../../../service/toast.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private accountService: AccountService, private router: Router, private toastService: ToastService) {}
canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
  const isLogin = sessionStorage.getItem('isLogin');
  if (isLogin !== 'true') {
    this.toastService.doToastInfo('Please login to continue', 'Unauthorized', 'Error');
    this.router.navigate(['/login']);
    return of(false);
  }

  const expectedRoles = route.data['expectedRole'] as string[];
  const token = this.accountService.getToken();

  if (token && !this.isTokenExpired(token)) {
    const userRole = this.accountService.decodeToken()?.Role;
    if (expectedRoles.includes(userRole)) {
      return of(true);
    } else {
      this.toastService.doToastInfo('You are not allowed to access this page', 'Access Denied', 'Error');
      this.router.navigate(['/home']);
      return of(false);
    }
  }

  return this.accountService.refreshToken().pipe(
    switchMap((res: any) => {
      if (res?.jwtToken) {
        this.accountService.setToken(res.jwtToken);
        this.accountService.setIsLogin(true);

        const refreshedRole = this.accountService.decodeToken()?.Role;
        if (expectedRoles.includes(refreshedRole)) {
          return of(true);
        } else {
          this.toastService.doToastInfo('You are not allowed to access this page', 'Access Denied', 'Error');
          this.router.navigate(['/home']);
          return of(false);
        }
      } else {
        this.handleLogout();
        return of(false);
      }
    }),
    catchError(() => {
      this.handleLogout();
      return of(false);
    })
  );
}

  private handleLogout() {
    this.accountService.setToken(null);
    this.accountService.setIsLogin(false);
    this.router.navigate(['/login']);
  }

  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return Date.now() > payload.exp * 1000;
    } catch {
      return true;
    }
  }
}
