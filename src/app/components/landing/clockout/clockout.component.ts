import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { SaleService } from '../../../service/sale.service';

import { AccountService } from '../../../service/account.service';
import { AmountService } from '../../../service/amount.service';
import { ShiftInfoService } from '../../../service/shift-info.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { Router } from '@angular/router';
import { ToastService } from '../../../service/toast.service';

@Component({
  selector: 'app-clockout',
  standalone: true,
  imports: [DataTablesModule, CommonModule, FormsModule, HttpClientModule],
  templateUrl: './clockout.component.html',
  styleUrl: './clockout.component.css'
})
export class ClockoutComponent implements OnInit{
  saleList: any[] = [];
  allSales: any[] = [];
  startDate: string = '';
  endDate: string = '';
  startBy = "";
  groupedSales: any[] = [];
  filteredSales: any[] = [];
  // originalSales: any[] = [];
  role = '';
  userName = '';
  percentageChange: number = 0;
  noDataFound: boolean = false;
  totalAmount: number = 0;
  totalSale: number = 0;
  amountInput: number = 0;
  existingUserWork: any[] = [];
  todaySalesCount: number = 0;
  allSalesCount: number = 0;
  sortDirection: 'asc' | 'desc' = 'asc';
  currentDate: Date = new Date();
  constructor(
        private saleService: SaleService,
        private accountService: AccountService,
        private router: Router,
        private amountService: AmountService,
        private shiftInfoService: ShiftInfoService,
        private cdr: ChangeDetectorRef,
        private toastService:ToastService,
  ){}
  ngOnInit(): void {
    this.getSaleList();
    this.loadStartData();
    const decodeToken = this.accountService.decodeToken()
    this.role = decodeToken?.Role || '';
    const userId = decodeToken?.userId || null;
    this.userName = decodeToken.name || '';
    
    if (userId) {
        this.totalAmount = this.amountService.getAmountInput(userId);
  }
   setInterval(() => {
      this.currentDate = new Date();
    }, 1000); // Updates every second
  
  }

loadStartData() {
  const decodedToken = this.accountService.decodeToken();
  const userId = decodedToken?.userId;

  if (!userId) {
    this.toastService.doToastInfo("Invalid User", "Error", "Session Error");
    return;
  }

    this.shiftInfoService.acctiveShift().subscribe(
    (res: any) => {
      const session = res.session;

      this.amountInput = session?.amountInput || 0;
      this.startDate = session?.startAt ? new Date(session.startAt).toString() : 'N/A';
      this.startBy = session?.userName || 'Unknown';
    },
    (error) => {
      console.error("Failed to load session data:", error);
      this.amountInput = 0;
      this.startDate = 'N/A';
      this.startBy = 'Unknown';
    }
  );
}


  ToHomePage() {
    this.router.navigate(['/home']);
  }
  

  
calculateSalesCounts() {
  // No need for today's sales, just count all unique sales
  this.allSalesCount = new Set(this.saleList.map(sale => sale.sale_id)).size ;
}


clockOut() {
    const decodedToken = this.accountService.decodeToken();
    const userId = decodedToken?.userId || null;

    if (!userId) {
      this.toastService.doToastInfo("Something went wrong", "Information", "Error");
      return;
    }
    this.shiftInfoService.acctiveShift().subscribe(
    (res: any) => {
      if (res.status !== 'Succeed' || !res.session || !res.session.userWInfoId) {
        this.toastService.doToastInfo("No active work session found", "Information", "Error");
        return;
      }

      const session = res.session;

      const data = {
        userWInfoId: session.userWInfoId,
        startBy: session.startBy,  // session owner who started the shift
        endBy: userId,             // current logged in user clocking out
        totalSale: this.totalSale,
        totalAmount: this.totalAmount,
        endAt: new Date().toISOString()
      };

      this.shiftInfoService.clockOut(data).subscribe(
        (res: any) => {
          if (res.status === 'Succeed') {
            this.amountService.resetAmountInput(userId);
            this.toastService.doToastInfo("Clocked out successfully", "Information", "Succeed");
            this.router.navigate(['/home']).then(() => {
            window.location.reload();
          });;
          } else {
            this.toastService.doToastInfo("Failed to clock out", "Information", "Error");
          }
        },
        (error) => {
          this.toastService.doToastInfo("Failed to clock out", "Information", "Error");
        }
      );
    },
  );
}

// clockOut() {
//   const decodedToken = this.accountService.decodeToken();
//   const userId = decodedToken?.userId || null;

//   if (!userId) {
//     this.toastService.doToastInfo("Something when wrong","Information","Error");
//       return;
//   }

//   const startBy = localStorage.getItem('startBy');
//   const endBy = userId;

//   localStorage.setItem('userClockedOut', 'true');
//   this.amountService.resetAmountInput(userId); // Reset amount logic in your service
//   const data = {
//       startBy: startBy ? parseInt(startBy) : userId,
//       endBy: endBy,
//       totalSale: this.totalSale,
//       totalAmount: this.totalAmount,
//       endAt: new Date().toISOString()
//   };

//   this.shiftInfoService.clockOut(data).subscribe(
//       (res: any) => {
//           if (res.status === 'Succeed') {
//               // ✅ Clear stored data in sessionStorage and localStorage
//               sessionStorage.setItem('totalSale', '0');
//               sessionStorage.setItem('totalAmount', '0');

//               localStorage.setItem(`amountInput_${userId}`, ''); // Clear Amount Input
//               localStorage.removeItem('activeSession');
//               localStorage.removeItem('activeSessionId');
//               localStorage.removeItem('startBy');

//               // ✅ Notify other components to reset sales data
//               localStorage.setItem('resetSalesData', Date.now().toString());

//               // ✅ Refresh UI
//               this.refreshUI();

//               // ✅ Redirect to home page after clocking out
//               this.router.navigate(['/home']);
//           } else {
//             this.toastService.doToastInfo("Something when wrong","Information","Error");
//           }
//       },
//       (error) => {
//         this.toastService.doToastInfo("Something when wrong","Information","Error");
//       }
//   );
// }
getSaleList() {
  this.saleService.getSale().subscribe((res: any) => {
      if (res.status === 'Succeed' && res.saleList) {
          // Filter only active sales
          this.saleList = res.saleList.filter((sale: any) => sale.status === 1);

          // Calculate total amount from active sales
          this.totalAmount = this.saleList.reduce((total, sale) => {
              return total + (sale.price * sale.qty * (1 - (sale.discount || 0) / 100));
          }, 0);

          // Count active sales (only where status === 1)
          this.totalSale = new Set(this.saleList.map(sale => sale.sale_id)).size;
          
          // ✅ Update todaySalesCount only for active sales
          this.todaySalesCount = this.totalSale; 
          
      }
  });
}


refreshUI() {
  this.cdr.detectChanges();
}
}
