import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';

import { DataTablesModule } from 'angular-datatables';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ADTSettings } from 'angular-datatables/src/models/settings';
import { Subject } from 'rxjs';
import { SaleService } from '../../../service/sale.service';
import { AccountService } from '../../../service/account.service';
import { Session } from 'inspector';
import { ActivatedRoute, Router } from '@angular/router';
import { AmountService } from '../../../service/amount.service';
import { ShiftInfoService } from '../../../service/shift-info.service';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-sale-list',
  standalone: true,
  imports: [DataTablesModule, CommonModule, FormsModule, HttpClientModule,NgxPaginationModule],
  templateUrl: './sale-list.component.html',
  styleUrl: './sale-list.component.css',
})
export class SaleListComponent implements OnInit, OnDestroy {
  saleList: any[] = [];
  allSales: any[] = [];
  startDate: string = '';
  endDate: string = '';
  groupedSales: any[] = [];
  filteredSales: any[] = [];
  // originalSales: any[] = [];
  role = '';
  currentPage: number = 1;
  itemsPerPage: number = 50;
  percentageChange: number = 0;
  noDataFound: boolean = false;
  totalAmount: number = 0;
  totalSale: number = 0;
  amountInput: number = 0;
  existingUserWork: any[] = [];
  todaySalesCount: number = 0;
  allSalesCount: number = 0;
  sortDirection: 'asc' | 'desc' = 'asc';
  constructor(
    private saleService: SaleService,
    private accountService: AccountService,
    private router: Router,
    private amountService: AmountService,
    private shiftInfoService: ShiftInfoService,
    private cdr: ChangeDetectorRef,
  ) {}
  ngOnDestroy(): void {}

  ngOnInit(): void {
    this.getSaleList();
  //   const decodeToken = this.accountService.decodeToken()
  //   this.role = decodeToken?.Role || '';
  //   const userId = decodeToken?.userId || null;


  //   if (userId) {
  //       this.totalAmount = this.amountService.getAmountInput(userId);
    
  // }
  }

  // ToHomePage() {
  //   this.router.navigate(['/home']);
  // }
  // getAmountInput(): number {
  //   // Get the amount directly from localStorage
  //   const amount = localStorage.getItem('sessionAmountInput');
    
  //   if (amount) {
  //     return parseFloat(amount);
  //   }
    
  //   return 0;
  // }
  
  // calculateSalesCounts() {
  //   const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
  
  //   // Filter sales for today
  //   const todaySales = this.saleList.filter((sale) => {
  //     const saleDate = sale.sale_date.split('T')[0]; // Ensure date is in the correct format
  //     return saleDate === today;
  //   });
  
  //   // Count unique sale_ids for today
  //   this.todaySalesCount = new Set(todaySales.map(sale => sale.sale_id)).size;
  
  //   // Count total unique sale_ids
  //   this.allSalesCount = new Set(this.saleList.map(sale => sale.sale_id)).size;
  // }

  
  
//   clockOut() {
//     const decodedToken = this.accountService.decodeToken();
//     const userId = decodedToken?.userId || null;

//     if (!userId) {
//         console.error("User ID is missing!");
//         return;
//     }

//     const startBy = localStorage.getItem('startBy');
//     const endBy = userId;

//     localStorage.setItem('userClockedOut', 'true');
//     this.amountService.resetAmountInput(userId); // Reset amount logic in your service
//     const data = {
//         startBy: startBy ? parseInt(startBy) : userId,
//         endBy: endBy,
//         totalSale: this.totalSale,
//         totalAmount: this.totalAmount,
//         endAt: new Date().toISOString()
//     };

//     this.shiftInfoService.clockOut(data).subscribe(
//         (res: any) => {
//             if (res.status === 'Succeed') {
//               // ✅ Reset frontend values using response
//               // this.totalSale = res.resetData.totalSale;
//               // this.totalAmount = res.resetData.totalAmount;
//               this.saleList = [];

//               // ✅ Clear stored data in sessionStorage and localStorage
//               sessionStorage.setItem('totalSale', '0');
//               sessionStorage.setItem('totalAmount', '0');

//               localStorage.setItem(`amountInput_${userId}`, ''); // Clear Amount Input
//               localStorage.removeItem('activeSession');
//               localStorage.removeItem('activeSessionId');
//               localStorage.removeItem('startBy');

//               // ✅ Notify home component or other components if needed
//               localStorage.setItem('resetSalesData', Date.now().toString());

//               // ✅ Call refreshUI to trigger the UI update
//               this.refreshUI();

//               // ✅ Redirect to home page after clocking out
//               this.router.navigate(['/home']);
//             } else {
//                 console.error("Clock Out Failed:", res.message);
//             }
//         },
//         (error) => {
//             console.error("Clock Out Error:", error);
//         }
//     );
// }

// refreshUI() {
//   this.cdr.detectChanges();
// }

pageitem(page: number) {
  this.router.navigate([], {
    queryParams: { page: page }
  });
}

  
  sortById() {
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.groupedSales.sort((a, b) => {
      return this.sortDirection === 'desc'
        ? a.sale_id - b.sale_id
        : b.sale_id - a.sale_id;
    });
  }

//   getSaleList() {
//     const decodedToken = this.accountService.decodeToken();
//     const userId = decodedToken.userId || null;
//     const role = decodedToken.Role || null;

//     const today = new Date().toISOString().split('T')[0];  // Get today's date in YYYY-MM-DD format

//     // Check if sales data needs to be reset (from clock out)
//     if (sessionStorage.getItem('resetSalesData')) {
//         // Reset total amount and sale count
//         this.totalAmount = 0;
//         this.totalSale = 0;
//         this.saleList = [];  // Clear the previous sales list
//         // Remove reset flag so it only happens once
//         sessionStorage.removeItem('resetSalesData');
//     }

//     // Fetch sales data
//     this.saleService.getSale().subscribe((res: any) => {
//         if (res.status === 'Succeed') {
//             if (role === "User") {
//                 // Filter out "NotActive" sales and only include today's sales
//                 this.saleList = res.saleList.filter((sale: any) => {
//                     const saleDate = sale.sale_date.split('T')[0];
//                     return saleDate === today && sale.status === 1;  // SaleStatus 2 might represent NotActive
//                 });
//             } else if (role === "Admin") {
//                 this.saleList = res.saleList
//             }

//             // Calculate total sales count (today's sales count)
//             this.todaySalesCount = this.saleList.length;  // Count the number of sales for today

//             // Calculate total amount from the filtered sales (calculate total for today)
//             this.totalAmount = this.saleList.reduce((total, sale) => {
//                 return total + (sale.price * sale.qty * (1 - (sale.discount || 0) / 100));
//             }, 0);

//             // Calculate total sales (number of unique sales)
//             this.totalSale = new Set(this.saleList.map(sale => sale.sale_id)).size;

//             // Group and sort sales
//             this.calculateSalesCounts();
//             this.groupedSales = this.groupSalesById(this.saleList);
//             this.groupedSales.sort((a, b) => b.sale_id - a.sale_id);
//             this.filteredSales = this.saleList.sort((a, b) => b.sale_id - a.sale_id);
//         }
//     });
// }



getSaleList() {

  this.saleService.getSale().subscribe((res: any) => {
    if (res.status === 'Succeed') {
      this.saleList = res.saleList;
      this.groupedSales = this.groupSalesById(this.saleList);
      this.groupedSales.sort((a, b) => b.sale_id - a.sale_id);
      this.filteredSales = this.saleList.sort((a, b) => b.sale_id - a.sale_id);
    }
  });
}


  groupSalesById(sales: any[]): any[] {
    const grouped: any[] = [];
    sales.forEach((sale) => {
      const existingGroup = grouped.find(
        (group) => group.sale_id === sale.sale_id
      );
      if (existingGroup) {
        existingGroup.items.push(sale);
        existingGroup.groupTotal +=
          sale.price * sale.qty * (1 - (sale.discount || 0) / 100);
      } else {
        grouped.push({
          sale_id: sale.sale_id,
          userId: sale.userName,
          sale_date: sale.sale_date,
          items: [sale],
          groupTotal: sale.price * sale.qty * (1 - (sale.discount || 0) / 100),
        });
      }
    });
    return grouped;
  }

  

  filterSalesByDate() {
    // Reset "No Data Found" and percentage change by default
    // Handle case when no dates are selected
    if (!this.startDate && !this.endDate) {
      this.filteredSales = this.saleList; // Show all sales
      this.groupedSales = this.groupSalesById(this.saleList);
      return;
    }

    const startDate = this.startDate ? new Date(this.startDate) : new Date(0);
    const endDate = this.endDate ? new Date(this.endDate) : new Date();
    endDate.setHours(23, 59, 59, 999); // Include end of the selected day

    // Filter sales for the selected date range
    this.filteredSales = this.saleList.filter((sale) => {
      const saleDate = new Date(sale.sale_date);
      return saleDate >= startDate && saleDate <= endDate;
    });

    // Check if no sales found for the selected date range
    if (this.filteredSales.length === 0) {
      this.noDataFound = true;
      this.filteredSales = []; // Clear the table by setting filteredSales to an empty array
      this.groupedSales = []; // Clear grouped sales
    } else {
      this.noDataFound = false; 
      this.groupedSales = this.groupSalesById(this.filteredSales); // Regroup sales if data exists
    }

    // Calculate total sales for the selected range
    const filteredTotal = this.filteredSales.reduce((total, sale) => {
      return total + sale.price * sale.qty * (1 - (sale.discount || 0) / 100);
    }, 0);

    // Get sales for "comparison period" (yesterday or another day to compare)
    const comparisonStart = new Date(startDate);
    comparisonStart.setDate(comparisonStart.getDate() - 1); // Previous day
    const comparisonEnd = new Date(startDate);
    comparisonEnd.setHours(23, 59, 59, 999);

    const comparisonSales = this.saleList.filter((sale) => {
      const saleDate = new Date(sale.sale_date);
      return saleDate >= comparisonStart && saleDate <= comparisonEnd;
    });

    const comparisonTotal = comparisonSales.reduce((total, sale) => {
      const discount = Number(sale.discount) || 0; // Ensure it's a number
      return total + sale.price * sale.qty * (1 - discount / 100);
    }, 0);
    

    // Calculate percentage change
    if (comparisonTotal > 0) {
      this.percentageChange = Math.abs(((filteredTotal - comparisonTotal) / comparisonTotal) * 100);
    } else {
      this.percentageChange = 0;
    }
    
    
    // Group the filtered sales
    this.groupedSales = this.groupSalesById(this.filteredSales);
  }

  getFilteredTotal() {
    return this.filteredSales.reduce((acc, sale) => {
      return acc + sale.price * sale.qty * (1 - (sale.discount || 0) / 100);
    }, 0);
  }

 
  

  // Optional: Add method to clear filters
  clearFilters() {
    this.startDate = '';
    this.endDate = '';
    this.percentageChange = 0;
    this.getSaleList();
    this.noDataFound = false;

  }
}
