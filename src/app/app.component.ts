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

  // No valid token in memory => call refresh token endpoint to get new JWT
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
      console.error('Token refresh failed on app init:', error);
      this.handleLogout();
      this.isLoading = false;
    },
  });
}

private handleLogout() {
  this.accountService.setToken(null);
  this.accountService.setIsLogin(false);
  this.role = '';
  sessionStorage.clear();
  if (!this.router.url.includes('/login')) {
    this.router.navigate(['/login']);
  }
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
