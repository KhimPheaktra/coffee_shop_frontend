import { Injectable } from "@angular/core";
import { AccountService } from "../../../service/account.service";
import { CanActivate, Router } from "@angular/router";

@Injectable({ providedIn: 'root' })
export class LoginGuard implements CanActivate {
  constructor(private accountService: AccountService, private router: Router) {}

  canActivate(): boolean {
    const token = this.accountService.getToken();
    if (token && !this.isTokenExpired(token)) {
      this.router.navigate(['/dashboard']); // redirect logged-in users away from login page
      return false;
    }
    return true;
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
