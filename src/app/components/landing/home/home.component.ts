import { Component, NgZone, OnDestroy, OnInit, Query } from '@angular/core';
import {
  ActivatedRoute,
  Router,
  RouterModule,
  RouterOutlet,
} from '@angular/router';
import {  HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

import { DataTablesModule } from 'angular-datatables';
import { CartComponent } from '../cart/cart.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CartService } from '../../../service/cart.service';
import { CategoryService } from '../../../service/category.service';
import { ProductService } from '../../../service/product.service';
import { ExchangeRateService } from '../../../service/exchange-rate.service';
import { SearchComponent } from "../../features/search/search.component";
import { NgxPaginationModule } from 'ngx-pagination';
import { SaleService } from '../../../service/sale.service';
import { AccountService } from '../../../service/account.service';
import { AmountService } from '../../../service/amount.service';
import { ShiftInfoService } from '../../../service/shift-info.service';
declare var bootstrap : any;
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HttpClientModule,
    CommonModule,
    DataTablesModule,
    CartComponent,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    SearchComponent,
    NgxPaginationModule
],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit, OnDestroy {
  productList: any[] = [];
  categoryList: any[] = [];
  filteredProducts: any[] = [];
  selectedCategory: string | null = null;
  searchText= '';
  exchangeRate: any[] = [];
  page = 1;
  product_name = '';
  category_name ='';
  price = 0;
  qty = 1;
  product_image = '';
  amountInput:number = 0;
  totalAmount:number = 0;
  totalSale: number = 0;
  invalidAmount: boolean = false;
  isAmountSet: boolean = false;
  currentDate: Date = new Date();

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService,
    private categoryService: CategoryService,
    private ngZone: NgZone,
    private exchangeRateService: ExchangeRateService,
    private saleService: SaleService,
    private accountService: AccountService,
    private amountService: AmountService,
    private shiftInfoService: ShiftInfoService
  ) {}
  ngOnDestroy(): void {}

  ngOnInit(): void {
    this.getProduct();
    this.getCategory();
    this.activatedRoute.queryParams.subscribe((params) => {
      this.selectedCategory = params['category_name'] || null;
      this.searchText = params['search'] || '';
      this.page = Number(params['page']) || 1; 
      // this.applyFilter(); 
      this.filterProducts(this.searchText); 
    });


  }

  // startWork() {
  //   const decodedToken = this.accountService.decodeToken();
  //   const userId = decodedToken?.userId || null;
  //   const amountInput = this.amountInput;
 
  //   if (!userId) {
  //     console.error("User ID is missing!");
  //     return;
  //   }
 
  //   if (this.isValidAmount(amountInput)) {
  //     console.log("Work started with amount:", amountInput);
      
  //     // Store the amount directly in localStorage for the current session
  //     localStorage.setItem('sessionAmountInput', amountInput.toString());
      
  //     // Also store who started the session
  //     localStorage.setItem('startBy', userId.toString());
  //     let data = {
  //       startBy: userId,
  //       startAt: new Date().toISOString(),
  //       amountInput: amountInput
  //     };
 
  //     this.shiftInfoService.startWork(data).subscribe(
  //       (res: any) => {
  //         if (res.status === 'Succeed') {
  //           localStorage.setItem('activeSession', 'true');
  //           localStorage.setItem('activeSessionId', res.userWinfoldId);
            
  //           // Clear any clock out status
  //           localStorage.removeItem('userClockedOut');
            
  //           alert('Work started successfully!');
  //           this.router.navigate(['/clockout']);
  //         }
  //       }
  //     );
  //   } else {
  //     alert('Please enter a valid amount.');
  //   }
  // }



  // startWork() {
  //     const decodedToken = this.accountService.decodeToken();
  //     const userId = decodedToken?.userId || null;
  //     const amountInput = this.amountInput;
  //     if (this.isValidAmount(amountInput)) {
  //       console.log("Work started with amount:", amountInput);
  //       this.isAmountSet = true;
        
  //       // Store the amount in the service
  //       this.amountService.setAmountInput(userId,amountInput);
  
  //     if (!userId) {
  //       console.error("User ID is missing!");
  //       return;
  //     }
  //     // Check if the previous user is still working (not clocked out)
  //     const previousUser = localStorage.getItem('userClockedOut');
  //     const previousUserId = previousUser ? previousUser : userId; // Use previous user if available

  //     // Set the session startBy as the previous user or the current user if no previous user
  //     localStorage.setItem('startBy', previousUserId);

  //     let data = {
  //       startBy: userId,
  //       startAt: new Date().toISOString(),
  //       amountInput: amountInput  // Send the correct value here
  //     };
  
  //     this.shiftInfoService.startWork(data).subscribe(
  //       (res: any) => {
  //         if (res.status === 'Succeed') {
  //           alert('Work started successfully!');
  //           localStorage.setItem('activeSession', 'true');
  //           localStorage.setItem('activeSessionId', res.userWinfoldId);
  //           document.getElementById('inputamount')?.click();
  //         }
  //       },

  //     );
  //   }
  // }

  // isValidAmount(amount: number): boolean {
  //   return amount > 0;
  // }

  // checkAmountInfo() {
  //   const decodedToken = this.accountService.decodeToken();
  //   const userId = decodedToken?.userId || null;
    
  //   if (!userId) {
  //     console.error("User ID is missing!");
  //     return;
  //   }
   
  //   // First, check if there's an active session
  //   const activeSession = localStorage.getItem('activeSession') === 'true';
    
  //   if (activeSession) {
  //     // If there's an active session, check if we have a stored amount
  //     const sessionAmount = localStorage.getItem('sessionAmountInput');
      
  //     if (sessionAmount) {
  //       console.log("Active session found with amount:", sessionAmount);
  //       // We have an active session with an amount - go straight to sale list
  //       this.router.navigate(['/clockout']);
  //       return;
  //     }
  //   }
    
  //   // If we don't have an active session with an amount, show the modal
  //   console.log("No active session with amount, showing input modal");
  //   let modal = new bootstrap.Modal(document.getElementById('inputamount'));
  //   modal.show();
  // }
  
  


	// GetExchangeRate() {
  //   this.exchangeRateService.getExchangeRate().subscribe((res: any) => {
  //     if (res.status === 'Succeed') {
  //       this.exchangeRate = res.exchangeRate;
  //     }
  //   })
  // }
  filterProducts(searchText: string) {
  if (!searchText?.trim()) {
    // If no search text, show filtered by category or all
    this.filteredProducts = this.selectedCategory
      ? this.productList.filter(
          (product) => product.category_name === this.selectedCategory
        )
      : this.productList;
  } else {
    const lowerSearch = searchText.toLowerCase().trim();
    // Filter products first by category if selected
    const productsToFilter = this.selectedCategory
      ? this.productList.filter(
          (product) => product.category_name === this.selectedCategory
        )
      : this.productList;

    this.filteredProducts = productsToFilter.filter(
      (product: any) =>
        product.product_name.toLowerCase().includes(lowerSearch) ||
        product.category_name.toLowerCase().includes(lowerSearch)
    );
  }
}

  pageitem(page: number) {
    this.router.navigate([], {
      queryParams: { page: page }
    });
  }

  getProduct() {
    this.productService.getProduct().subscribe((res: any) => {
      if (res.status === 'Succeed') {
        this.productList = res.productList;
        this.filteredProducts = this.productList;  
      }
    });
  }
  addToCart(product: any) {
    this.cartService.addToCart(product);
  }
  getCategory() {
    this.categoryService.getCategory().subscribe((res: any) => {
      if (res.status === 'Succeed') {
        this.categoryList = res.categoryList;
      }
    });
  }

  filterCategories(category: string | null) {
    this.selectedCategory = category; // Store the selected category
    this.filterProducts(this.searchText); // Re-apply filtering
  }
  

  // applyFilter(): void {
  //   if (this.selectedCategory) {
  //     this.filteredProducts = this.productList.filter(
  //       (product) => product.category_name === this.selectedCategory
  //     );
  //   } else {
  //     this.filteredProducts = this.productList; // Reset to all products
  //   }
  // }
}
