import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { DataTablesModule } from 'angular-datatables';
import { NgxPaginationModule } from 'ngx-pagination';
import { AccountService } from '../../../service/account.service';
import { ExchangeRateService } from '../../../service/exchange-rate.service';
import { ShiftInfoService } from '../../../service/shift-info.service';
import { ToastService } from '../../../service/toast.service';
declare var bootstrap : any;
@Component({
  selector: 'app-clock-in-sale-info',
  standalone: true,
  imports: [HttpClientModule,
      CommonModule,
      DataTablesModule,
      RouterModule,
      FormsModule,
      ReactiveFormsModule,
      NgxPaginationModule],
  templateUrl: './clock-in-sale-info.component.html',
  styleUrl: './clock-in-sale-info.component.css'
})
export class ClockInSaleInfoComponent {
exchangeRate: any[] = [];
  amountInput:number = 0;
  totalAmount:number = 0;
  totalSale: number = 0;
  invalidAmount: boolean = false;
  isInputDisabled: boolean = false;
  isAmountSet: boolean = false;
  isHomePage: boolean = false;
  isSaveDisabled: boolean = false;
  constructor(private accountService: AccountService,
    private router: Router,
    private toastService:ToastService,
    private exchangeRateService: ExchangeRateService,
    private shiftInfoService: ShiftInfoService){}
  ngOnInit(): void {
    this.GetExchangeRate();
    this.checkActiveSession();
    this.isHomePage = this.router.url === '/home';
    
    // Subscribe to the router events to detect route changes
    this.router.events.subscribe(() => {
      this.isHomePage = this.router.url === '/home';
    });
    const modalElement = document.getElementById('inputamount');
    if (modalElement) {
      modalElement.addEventListener('show.bs.modal', () => {
        // Check if there's an active session right before showing the modal
      });
    }
  }
  ToHomePage() {
    this.router.navigate(['/home']);
  }
  GetExchangeRate() {
    this.exchangeRateService.getExchangeRate().subscribe((res: any) => {
      if (res.status === 'Succeed') {
        this.exchangeRate = res.exchangeRate;
      }
    })
  }

startWork() {
  const decodedToken = this.accountService.decodeToken();
  const userId = decodedToken?.userId || null;
  const amountInput = this.amountInput;
  const userName = decodedToken?.name || '';
  
  if (this.isSaveDisabled) {
      return;
    }
  if (!userId) {
    this.toastService.doToastInfo("Something went wrong", "Information", "Error");
    return;
  }

  if (!this.isValidAmount(amountInput)) {
    alert('Please enter a valid amount.');
    return;
  }

  const startTime = new Date().toISOString();

  const data = {
    startBy: userId,
    startAt: startTime,
    amountInput: amountInput
  };

  this.shiftInfoService.startWork(data).subscribe(
    (res: any) => {
      if (res.status === 'Succeed') {
        // Backend manages session state now — no localStorage usage
        this.isInputDisabled = true;
        this.toastService.doToastInfo("Work started successfully", "Information", "Succeed");
        this.router.navigate(['/clockout']);
      } else {
        this.toastService.doToastInfo("Failed to start work", "Information", "Error");
      }
    },
    (error) => {
      this.toastService.doToastInfo("Failed to start work", "Information", "Error");
    }
  );
}

  

  isValidAmount(amount: number): boolean {
    return amount > 0;
  }

  checkAmountInfo() {
  const decodedToken = this.accountService.decodeToken();
  const userId = decodedToken?.userId || null;

  if (!userId) {
    this.toastService.doToastInfo("Something went wrong", "Information", "Error");
    return;
  }

  this.shiftInfoService.acctiveShift().subscribe(
    (res: any) => {
      if (res.status === 'Succeed' && res.session && res.session.amountInput > 0) {
        this.amountInput = res.session.amountInput;
        this.isInputDisabled = true;
        this.router.navigate(['/clockout']);
      } else {
        let modal = new bootstrap.Modal(document.getElementById('inputamount'));
        modal.show();
      }
    },
    (error) => {
      let modal = new bootstrap.Modal(document.getElementById('inputamount'));
      modal.show();
    }
  );
}

  // startWork() {
  //   const decodedToken = this.accountService.decodeToken();
  //   const userId = decodedToken?.userId || null;
  //   const amountInput = this.amountInput;
  //   const userName = decodedToken?.name || ''; 
  //   if (!userId) {
      
  //     this.toastService.doToastInfo("Something when wrong","Information","Error");
  //     return;
  //   }
 
  //   if (this.isValidAmount(amountInput)) {
  //     // this.toastService.doToastInfo("Work stated successfully","Information","Succeed");
      
  //     // Store the amount directly in localStorage for the current session
  //     localStorage.setItem('sessionAmountInput', amountInput.toString());
  //     // Also store who started the session
  //     localStorage.setItem('startBy', userId.toString());
  //     localStorage.setItem('startByName', userName);
  //     const startTime = new Date().toISOString();
  //     localStorage.setItem('sessionStartAt', startTime);
  //     let data = {
  //       startBy: userId,
  //       startAt: startTime,
  //       amountInput: amountInput
  //     };
 
  //     this.shiftInfoService.startWork(data).subscribe(
  //       (res: any) => {
  //         if (res.status === 'Succeed') {
  //           localStorage.setItem('activeSession', 'true');
  //           localStorage.setItem('activeSessionId', res.userWinfoldId);
            
  //           // Clear any clock out status
  //           localStorage.removeItem('userClockedOut');
  //           this.isInputDisabled = true;
            
  //           this.toastService.doToastInfo("Work stated successfully","Information","Succeed");
  //           this.router.navigate(['/clockout']);
  //         }
  //       }
  //     );
  //   } else {
  //     alert('Please enter a valid amount.');
  //   }
  // }

  
  

  // isValidAmount(amount: number): boolean {
  //   return amount > 0;
  // }

  // checkAmountInfo() {
  //   const decodedToken = this.accountService.decodeToken();
  //   const userId = decodedToken?.userId || null;
    
  //   if (!userId) {
  //     this.toastService.doToastInfo("Something when wrong","Information","Error");
  //     return;
  //   }
   
  //   // First, check if there's an active session
  //   const activeSession = localStorage.getItem('activeSession') === 'true';
    
  //   if (activeSession) {
  //     // If there's an active session, check if we have a stored amount
  //     const sessionAmount = localStorage.getItem('sessionAmountInput');
      
  //     if (sessionAmount) {

  //       this.amountInput = parseFloat(sessionAmount);

  //       this.isInputDisabled = true;
  //       // We have an active session with an amount - go straight to sale list
  //       this.router.navigate(['/clockout']);

  //       return;
  //     }
  //   }
    
  //   // If we don't have an active session with an amount, show the modal
  //   let modal = new bootstrap.Modal(document.getElementById('inputamount'));
  //   modal.show();
  // }
  checkInvoice(){
    this.router.navigate(['/invoice']);
  }



  checkActiveSession() {
  this.shiftInfoService.acctiveShift().subscribe((res: any) => {
    if (res.status === 'Succeed' && res.session && res.session.amountInput > 0) {
      // Active session with amountInput exists
      this.isInputDisabled = true;
      this.isSaveDisabled = true; // disable Save button
      this.amountInput = res.session.amountInput; // show existing amount (optional)
    } else {
      // No active session
      this.isInputDisabled = false;
      this.isSaveDisabled = false; // enable Save button
      this.amountInput;
    }
  });
}
}
