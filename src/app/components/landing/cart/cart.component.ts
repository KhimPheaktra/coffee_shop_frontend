import { Component, inject, TrackByFunction } from '@angular/core';

import { CommonModule } from '@angular/common';

import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { CartService } from '../../../service/cart.service';
import { ExchangeRateService } from '../../../service/exchange-rate.service';
import { SaleService } from '../../../service/sale.service';
import { AccountService } from '../../../service/account.service';
import { AmountService } from '../../../service/amount.service';
import { ToastService } from '../../../service/toast.service';
import { ShiftInfoService } from '../../../service/shift-info.service';
declare var bootstrap: any; 
@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule, DataTablesModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})

export class CartComponent {
  productList: any[] = []; // Replace with your actual product data
  cartItems: any[] = [];
  exchangeRate: any;
  usedicount: number = 0;
  isDiscountEnabled: boolean = false;
  product_image = '';
  product_name = '';

  sale_id: any;
  sale_data: any;
  product_id: any;
  price: any;
  qty: any;
  discount: any;
  total_price: any;

  amountTake: number = 0; // Holds the input value for the amount taken
  remainingAmount: number = 0; // Holds the calculated remaining amount
  amountInput: number = 0; 

  isMobile: boolean = false;

  constructor(
    private router: Router,
    public cartService: CartService,
    private exchnageRateService: ExchangeRateService,
    private amountService: AmountService,
    private accountService: AccountService,
    private toastService:ToastService,
    private shiftInfoService:ShiftInfoService,
  ) {}

  ngOnInit() {
    this.cartItems = this.cartService.getItems();
    this.GetExchangeRate();
    const activeSession = localStorage.getItem('activeSession') === 'true';
    
    if (!activeSession) {
      // No active session, redirect to home
      this.router.navigate(['/home']);
      return;
    }
    this.checkScreenSize();
    window.addEventListener('resize', () => this.checkScreenSize());
  }

  // addToCart(product: any) {
  //   const productWithQty = {
  //     ...product,
  //     qty: 1,
  //     totalPrice: product.price,
  //   };
  //   this.cartService.addToCart(productWithQty);
  // }
  GetExchangeRate() {
    this.exchnageRateService.getExchangeRate().subscribe((res: any) => {
      if (res.status === 'Succeed' && res.exchangeRate.length > 0) {
        this.exchangeRate = res.exchangeRate[0].rate; // Extract rate directly
      }
    });
  }
  private checkScreenSize() {
    this.isMobile = window.innerWidth < 768;
  }


Order() {
  const decodedToken = this.accountService.decodeToken();
  const userId = decodedToken?.userId || null;

  if (!userId) {
    this.toastService.doToastInfo(
      'Invalid user session. Please log in again.',
      'Session Error',
      'Error'
    );
    return;
  }

  this.shiftInfoService.acctiveShift().subscribe(
    (res: any) => {
      if (res.status === 'Succeed' && res.session && res.session.amountInput > 0) {
        this.amountInput = res.session.amountInput;
        this.router.navigate(['/checkout']);
      }  else {
        // ❗ Only show toast if session is missing or invalid
        this.toastService.doToastInfo(
          'Please enter a valid amount before placing an order.',
          'Information',
          'Error'
        );
      }
    },
    (error) => {
      this.toastService.doToastInfo(
        'Failed to load session. Please try again.',
        'Error',
        'Error'
      );
    }
  );
}

  // Order() {
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
  //       this.router.navigate(['/checkout']);
  //       return;
  //     }
  //   }
    
  //   // If we don't have an active session with an amount, show the modal
  //   this.toastService.doToastInfo(
  //     'Please enter a valid amount before placing an order.',
  //     'Information',
  //     'Error'
  //   );
  // }
 
  toggleDiscount() {
    this.isDiscountEnabled = !this.isDiscountEnabled;
  }
  resetForm() {
    this.product_image = '';
    this.product_name = '';
    this.price = 0;
    this.total_price = 0;
    this.amountTake = 0;
    this.remainingAmount = 0;
    this.discount = 0;
  }

  removeFromCart(item: any) {
    this.cartService.removeItem(item);
  }

  getAmountInput(): number {
    // Get the amount directly from localStorage
    const amount = localStorage.getItem('sessionAmountInput');
    
    if (amount) {
      return parseFloat(amount);
    }
    
    return 0;
  }

  trackById(index: number, item: any): number {
    return item.product_id;
  }

  calculateRemaining() {
    const total = this.cartService.getTotalPrice(); // Fetch the total price
    this.remainingAmount = total - this.amountTake; // Calculate remaining amount
  }

  applyDiscountToCart() {
    // Validate discount value
    if (this.discount < 0 || this.discount > 100) {
      alert('Discount must be between 0 and 100.');
      return;
    }

    this.cartService.getItems().forEach((item: any) => {
      const discountFactor = (100 - this.discount) / 100;
      item.total_price = (item.price * item.qty * discountFactor).toFixed(2);
      item.discount = this.discount;
    });
  }

  // addSale() {
  //   if (
  //     this.product_id === 0 ||
  //     this.price === 0 ||
  //     this.qty === 0 ||
  //     this.total_price === 0
  //   ) {
  //     alert('Please fill in all required fields.');
  //     return;
  //   }

  //   const totalUSD = this.cartService.getTotalPrice();

  //   if (this.amountTake < totalUSD) {
  //     Swal.fire({
  //       position: 'center',
  //       icon: 'error',
  //       title: 'Not enough amount',
  //       showConfirmButton: true,
  //       timer: 4500,
  //     });
  //     return;
  //   }
  //   this.GetExchangeRate();

  //   if (!this.exchangeRate) {
  //     console.error('Exchange rate not available. Please try again.');
  //     return;
  //   }

  //   const saleData = {
  //     sale_id: this.sale_id,
  //     sale_date: new Date().toISOString(),
  //     sale_detail_request: this.cartService.getItems().map((item: any) => {
  //       const discount = item.discount || 0;
  //       const totalPriceUSD =
  //         item.price * item.qty - (item.price * item.qty * discount) / 100;
  //       return {
  //         product_id: item.product_id,
  //         price: item.price,
  //         qty: item.qty,
  //         discount: discount,
  //         total_price: totalPriceUSD,
  //         total_in_riel: totalPriceUSD * this.exchangeRate,
  //       };
  //     }),
  //   };

  //   // Send sale data to the backend
  //   this.saleService.addSale(saleData).subscribe(
  //     (response) => {
  //       Swal.fire({
  //         position: 'center',
  //         icon: 'success',
  //         title: 'Sale added successfully!',
  //         showConfirmButton: false,
  //         timer: 3000,
  //       });
  //       this.cartService.clearItems(); // Clear the cart after a successful sale
  //     },
  //     (error) => {
  //       Swal.fire({
  //         position: 'center',
  //         icon: 'error',
  //         title: 'Failed to add sale!',
  //         showConfirmButton: true,
  //       });
  //       console.error('Error adding sale:', error);
  //     }
  //   );
  // }
}
