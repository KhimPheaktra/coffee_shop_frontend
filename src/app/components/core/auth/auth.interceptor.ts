import {
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
  HttpErrorResponse,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import {
  catchError,
  filter,
  switchMap,
  take,
  timeout,
  retry,
  finalize,
} from 'rxjs/operators';
import { AccountService } from '../../../service/account.service';
import { Router } from '@angular/router';

let isRefreshing = false;
const refreshTokenSubject = new BehaviorSubject<string | null>(null);

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  const isLoginEndpoint = req.url.endsWith('/api/GetToken');
  const isRefreshEndpoint = req.url.endsWith('/api/GetToken/refresh-token');

  if (isLoginEndpoint || isRefreshEndpoint) {
    return next(req);
  }

  const accountService = inject(AccountService);
  const router = inject(Router);

  const token = accountService.getToken();

  if (!token || isTokenExpired(token)) {
    return handleTokenRefresh(req, next, accountService, router);
  }

  const authReq = addAuthHeader(req, token);

  return next(authReq).pipe(
    catchError((error) => {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        // Unauthorized, try refresh token once
        return handleTokenRefresh(req, next, accountService, router);
      }
      return throwError(() => error);
    })
  );
};

function handleTokenRefresh(
  req: HttpRequest<any>,
  next: HttpHandlerFn,
  accountService: AccountService,
  router: Router
): Observable<HttpEvent<any>> {
  if (isRefreshing) {
    return waitForRefresh(req, next);
  }

  isRefreshing = true;
  refreshTokenSubject.next(null);

  return accountService.refreshToken().pipe(
    timeout(30000),
    retry(1),
    switchMap((response) => {
      const jwtToken = response.jwtToken;
      if (!jwtToken) throw new Error('Invalid refresh token response');

      accountService.setToken(jwtToken);
      refreshTokenSubject.next(jwtToken);

      return next(addAuthHeader(req, jwtToken));
    }),
    catchError((error) => {
      refreshTokenSubject.next(null);
      handleLogout(router, accountService);
      return throwError(() => error);
    }),
    finalize(() => {
      isRefreshing = false;
    })
  );
}

function waitForRefresh(req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> {
  return refreshTokenSubject.pipe(
    filter((token) => token !== null),
    take(1),
    switchMap((token) => next(addAuthHeader(req, token))),
    timeout(15000)
  );
}

function addAuthHeader(req: HttpRequest<any>, token: string | null): HttpRequest<any> {
  if (!token) return req;

  return req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
    withCredentials: true,
  });
}

function handleLogout(router: Router, accountService: AccountService): void {
  accountService.setToken(null);
  refreshTokenSubject.next(null);
  isRefreshing = false;
  sessionStorage.clear();
  router.navigate(['/login']);
}

function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return Date.now() > (payload.exp * 1000) - 30000;
  } catch {
    return true;
  }
}

