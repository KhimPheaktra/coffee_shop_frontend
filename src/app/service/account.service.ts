import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, pipe, tap, throwError } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { CookieService } from 'ngx-cookie-service';

import { User } from '../components/admin/user/user.component';
import { environment } from '../components/environments/environment.prod';
export interface RefreshTokenResponse {
  jwtToken: string;
  refreshToken: string;
}

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private jwtHelper = new JwtHelperService();
  private usernameSubject = new BehaviorSubject<string | null>(null);
  username$ = this.usernameSubject.asObservable();
  private jwtToken: string | null = null;
  private currentUser: User | null = null;
  private isLoginSource = new BehaviorSubject<boolean>(false);
  
  private tokenSubject = new BehaviorSubject<string | null>(null);
  token$ = this.tokenSubject.asObservable();
  constructor(private http: HttpClient, private cookieService: CookieService) {}

  isLoginStatus$ = this.isLoginSource.asObservable();
  setUser(user: User) {
    this.currentUser = user;
  }

  getUser(): User | null {
    return this.currentUser;
  }
  setIsLogin(isLogin: boolean) {
    this.isLoginSource.next(isLogin);
  }

  login(request: any): Observable<HttpResponse<any>> {
    return this.http.post(environment.apiEndPoint + 'api/GetToken', request, {
      observe: 'response',withCredentials: true
    }).pipe(
    catchError(err => {
      return throwError(() => new Error('Session expired. Please log in again.'));
    }));
  }


  setToken(token: string | null): void {
    this.tokenSubject.next(token);
  }

  getToken(): string | null {
    return this.tokenSubject.value;
  }
 


  refreshToken(): Observable<any> {
    return this.http.post<any>(
      environment.apiEndPoint + 'api/GetToken/refresh-token', 
      {}, 
      { withCredentials: true } 
    ).pipe(
    catchError(err => {
      return throwError(() => new Error('Session expired. Please log in again.'));
    }))
  }
  
//  refreshToken(): Observable<any> {
//     const ipAddress = '';
//     const userAgent = navigator.userAgent;

//     return this.http.post<any>(
//       environment.apiEndPoint + 'api/GetToken/refresh-token',
//       {ipAddress, userAgent },
//       { withCredentials: true },
      
//     );
//   }

  decodeToken(): any {
    try {
      // const token = sessionStorage.getItem('xSession');
       const token = this.getToken();
      if (!token) {
        return null;
      }
      
      const payload = token.split('.')[1];
      const decodedPayload = atob(payload);
      return JSON.parse(decodedPayload);
    } catch (error) {
      return null;
    }
  }

  logout(userId: number): Observable<any>{
    sessionStorage.clear();
    return this.http.post(environment.apiEndPoint + 'api/GetToken/logout', { userId })
    .pipe(
    catchError(err => {
      return throwError(() => new Error('Session expired. Please log in again.'));
    }));
  }

  // Utility method to check if user is logged in
  isLoggedIn(): boolean {
    // return !!sessionStorage.getItem('xSession');
     return !!this.jwtToken;
  }
  
}
