import { ChangeDetectorRef, Component, Inject, NgZone, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

import { CommonModule, DOCUMENT } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { DataTablesModule } from 'angular-datatables';
import { SidebarComponent } from './components/admin/sidebar/sidebar.component';
import { BodyComponent } from './components/body/body.component';
import { environment } from './components/environments/environment';
import { LoginComponent } from './components/landing/login/login.component';
import { AccountService } from './service/account.service';
import { ClockInSaleInfoComponent } from "./components/features/clock-in-sale-info/clock-in-sale-info.component";
import { catchError, throwError } from 'rxjs';


@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [
    CommonModule,
    HttpClientModule,
    DataTablesModule,
    SidebarComponent,
    LoginComponent,
    BodyComponent,
    ClockInSaleInfoComponent
],
})
export class AppComponent implements OnInit {
  title = 'food_order_system_frontend';
  isLoging: boolean = false;
  isLoading = true;
  role = '';
  isSideNavCollapsed = false;
  screenWidth = 0;
  apiurl = environment.apiEndPoint;
  constructor(
    private accountService: AccountService,
    private router: Router,
    private cdr: ChangeDetectorRef,  // Add this
    private ngZone: NgZone) {
    // console.log('API URL:', this.apiurl);
  }

  ngOnInit(): void {
     if (environment.production) {
    console.log = () => {};
    console.warn = () => {};
    console.error = () => {};
  }

  // Subscribe to login status observable
  this.accountService.isLoginStatus$.subscribe((status) => {
    this.isLoging = status;
    this.role = status ? this.accountService.decodeToken()?.Role || '' : '';
    this.cdr.detectChanges();
  });

  // Try to get token from memory
  const currentToken = this.accountService.getToken();

  if (currentToken && !this.isTokenExpired(currentToken)) {
    // Token in memory and valid, just set login and role
    this.accountService.setIsLogin(true);
    this.role = this.accountService.decodeToken()?.Role || '';
    this.isLoading = false;
    return;
  }

  // Check if refresh token exists in cookie before calling API
  if (this.hasRefreshTokenCookie()) {
    // Only call refresh token if we have a refresh token cookie
    this.accountService.refreshToken().subscribe({
      next: (res) => {
        if (res?.jwtToken) {
          this.accountService.setToken(res.jwtToken);
          this.accountService.setIsLogin(true);
          this.role = this.accountService.decodeToken()?.Role || '';
        } else {
          this.handleLogout();
        }
        this.isLoading = false;
      },
      error: (error) => {
        // Only log in development or if it's not a 400/401 error
        if (!environment.production || (error.status !== 400 && error.status !== 401)) {
          console.error('Token refresh failed:', error.status || 'Unknown error');
        }
        
        this.handleLogout();
        this.isLoading = false;
      },
    });
  } else {
    // No refresh token cookie available, user is not logged in
    this.isLoading = false;
    this.handleLogout();
  }
}

private hasRefreshTokenCookie(): boolean {
  // Check if refresh token cookie exists
  // Replace 'refreshToken' with your actual cookie name
  const cookieName = 'refreshToken'; // or whatever your cookie name is
  return this.getCookie(cookieName) !== null;
}

private getCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null;
  }
  return null;
}

private handleLogout() {
  this.accountService.setToken(null);
  this.accountService.setIsLogin(false);
  this.role = '';
  sessionStorage.clear();
  
  // Clear refresh token cookie
  this.clearRefreshTokenCookie();
  
  if (!this.router.url.includes('/login')) {
    this.router.navigate(['/login']);
  }
}

private clearRefreshTokenCookie() {
  // Replace 'refreshToken' with your actual cookie name
  const cookieName = 'refreshToken';
  document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

private isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return Date.now() > (payload.exp * 1000) - 30000; // 30 seconds buffer
  } catch {
    return true;
  }
    // const decodedToken = this.accountService.decodeToken();
    // this.role = decodedToken?.Role || '';

    // if (sessionStorage.getItem('isLogin') !== 'true') {
    //   this.accountService.isLoginStatus$.subscribe((status) => {
    //     this.isLoging = status;
    //   });
    // } else {
    //   this.isLoging = true;
    // }
  }
  
}
