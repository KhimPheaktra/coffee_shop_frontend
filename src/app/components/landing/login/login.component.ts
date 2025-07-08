import { ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { FormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { DataTablesModule } from 'angular-datatables';

import Swal from 'sweetalert2';
import { AccountService } from '../../../service/account.service';
import { ToastService } from '../../../service/toast.service';
import { HashService } from '../../../service/hash.service';
import { User } from '../../admin/user/user.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule, DataTablesModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  LoginData: any = {
    Username: '',
    Password: '',
  };

  isLoging: boolean = false;
  username: string = '';
  password: string = '';
  expirationTime: string = '';
  hash: string = '';

  constructor(
    private router: Router,
    public accountService: AccountService,
    private toastService: ToastService,
    private datepipe: DatePipe,
    private hashService: HashService,
    private cdr: ChangeDetectorRef,  // Add this
    private ngZone: NgZone      
  ) {}
  ngOnInit(): void {
    
  }


  
//   OnLogin() {
//     const now = new Date();
//     now.setSeconds(now.getSeconds() + 15);
//     const expirationTime = this.datepipe.transform(
//       now,
//       'MM/dd/yyyy hh:mm:ss a'
//     )!;

//     const text = this.username + this.password + expirationTime;

//     const hash = this.hashService.generate_hash_with_key(text);

//     const data = {
//       username: this.username,
//       password: this.password,
//       expirationTime: expirationTime,
//       hash: hash,
//     };

//     let statusCode: number | null = null;
//     let statusMessage: string | null = null;

//     this.accountService.login(data).subscribe({
//       next: (res) => {
//         const statusCode = res.status;

//         // Check if response body status is "Error"
//         if (res.body?.status === 'Error') {
//           this.toastService.doToastInfo(
//             'Unauthorized',
//             'Information',
//             'Error'
//           );
//           return;
//         }

//         // Check if username is provided in the response
//         else if (res.body.username != null) {
//           sessionStorage.setItem('username', res.body.username);
//           sessionStorage.setItem('userId', res.body.userId);
//           sessionStorage.setItem('Role', res.body.roleName);
//           sessionStorage.setItem('userProfile', res.body.userProfile);
//           sessionStorage.setItem('isLogin', 'true');
//           // sessionStorage.setItem('xSession', res.body.jwtToken);
//           this.accountService.setToken(res.body.jwtToken);

//           // sessionStorage.setItem('refreshToken', res.body.refreshToken);
//           // console.log('Login response:', res.body);

//           // Decode the token and retrieve the role
//           const decodedToken = this.accountService.decodeToken();
//           const role = decodedToken?.Role;

//           if (role === 'Admin') {
//             this.toastService.doToastInfo(
//               'Authorized',
//               'Information',
//               'Succeed'
//             );
//             window.location.href = '/dashboard';
//           } else if (role === 'User') {
//             this.toastService.doToastInfo(
//               'Authorized',
//               'Information',
//               'Succeed'
//             );
//             window.location.href = '/home';
//           } else {
//             this.toastService.doToastInfo(
//               'Unauthorized',
//               'Information',
//               'Error'
//             );
//           }
//         } else {
//           this.toastService.doToastInfo(
//             'Unauthorized',
//             'Information',
//             'Error'
//           );
//         }
//       },
//       error: (err) => {
//         this.toastService.doToastInfo('Unauthorized', 'Information', 'Error');
//         // console.error('Error during login:', err);
//       },
//     });
//   }
// }


OnLogin() {
  const now = new Date();
  now.setSeconds(now.getSeconds() + 15);
  const expirationTime = this.datepipe.transform(now, 'MM/dd/yyyy hh:mm:ss a')!;

  const data = {
    username: this.username,
    password: this.password,
    expirationTime: expirationTime
  };

  this.accountService.login(data).subscribe({
    next: (res) => {
      this.ngZone.run(() => {
        if (res.body?.status === 'Error' || !res.body?.jwtToken) {
          this.toastService.doToastInfo('Unauthorized', 'Information', 'Error');
          return;
        }
        this.accountService.setToken(res.body.jwtToken);
        this.accountService.setIsLogin(true);
        sessionStorage.setItem('isLogin', 'true');
        console.log(res.body)

        const role = this.decodeTokenFromString(res.body.jwtToken)?.Role;

        this.toastService.doToastInfo('Authorized', 'Information', 'Succeed');
        this.cdr.detectChanges();

        let navigateTo = '';
        if (role === 'Admin') navigateTo = '/dashboard';
        else if (role === 'User') navigateTo = '/home';
        else {
          this.toastService.doToastInfo('Unauthorized role', 'Information', 'Error');
          return;
        }

        this.router.navigate([navigateTo]).catch((err) => {
          console.error('Navigation error:', err);
          window.location.href = navigateTo;
        });
      });
    },
    error: (err) => {
      this.ngZone.run(() => {
        this.toastService.doToastInfo('Unauthorized', 'Information', 'Error');
      });
    },
  });
}


private decodeTokenFromString(token: string): any {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch {
    return null;
  }
}

}
