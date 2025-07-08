import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';

import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { Router } from '@angular/router';
import { CartService } from '../../../service/cart.service';
import { ExchangeRateService } from '../../../service/exchange-rate.service';
import { SaleService } from '../../../service/sale.service';
import { AccountService } from '../../../service/account.service';
import { CheckoutService } from '../../../service/checkout.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule, DataTablesModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css',
})
export class CheckoutComponent {
  productList: any[] = []; // Replace with your actual product data
  cartItems: any[] = [];
  exchangeRate: number = 0;

  usedicount: number = 0;
  isDiscountApplied: boolean = false;
  isDiscountEnabled: boolean = false;
  product_image = '';
  product_name = '';

  sale_id: any;
  usrId: any;
  orderType = "";
  sale_data = "";
  product_id: any;
  price: number = 0;
  qty: number = 0;
  discount: number = 0;
  total_price: number = 0;
  amountPaid: number | null = null;
  amountPaidInR: number | null = null;
  userName = "";
  changeDue = 0;
  changeDueInR = 0;
  invoiceDate = '';

  amountTake: number = 0;
  remainingAmount: number = 0;
  amountRiel: number = 0;
  remainingAmountRiel: number = 0;

  currentDate: Date = new Date();

  constructor(
    public cartService: CartService,
    private saleService: SaleService,
    private router: Router,
    private ngZone: NgZone,
    private exchnageRateService: ExchangeRateService,
    private accountService: AccountService,
    private checkoutService:CheckoutService
  ) {}

  ngOnInit() {
    this.GetExchangeRate();
    const decodedToken = this.accountService.decodeToken()
    this.userName = decodedToken.name || '';
    this.ngZone.runOutsideAngular(() => {
      setInterval(() => {
        this.ngZone.run(() => {
          this.currentDate = new Date();
        });
      }, 1000);
    });
  }

  GetExchangeRate() {
    this.exchnageRateService.getExchangeRate().subscribe((res: any) => {
      if (res.status === 'Succeed' && res.exchangeRate.length > 0) {
        this.exchangeRate = res.exchangeRate[0].rate; // Extract rate directly
      }
    });
  }

  toggleDiscount() {
    this.isDiscountEnabled = !this.isDiscountEnabled;
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

  ToHomePage() {
    this.router.navigate(['/home']);
  }

  trackById(index: number, item: any): number {
    return item.product_id;
  }

  // calculateRemaining() {
  //   const total = this.cartService.getTotalPrice();
  //   // this.remainingAmount = total - this.amountTake;

  //   // Calculate total take in dollars
  //   const totalTakeInDollar =
  //     this.amountTake + this.amountRiel / this.exchangeRate;

  //   // Remaining amount in dollars
  //   this.remainingAmount = parseFloat((total - totalTakeInDollar).toFixed(2));

  //   // Calculate total given in riels
  //   const totalTakeInRiel =
  //     this.amountTake * this.exchangeRate + this.amountRiel;

  //   // Remaining amount in riels
  //   this.remainingAmountRiel = parseFloat(
  //     (total * this.exchangeRate - totalTakeInRiel).toFixed(2)
  //   );
  // }
  calculateRemaining() {
    const total = this.cartService.getTotalPrice();

    // Convert Riel to Dollar equivalent
    const rielInDollars = (this.amountRiel ?? 0) / this.exchangeRate;

    // Calculate total received in both currencies
    const totalTakeInDollar = (this.amountTake ?? 0) + rielInDollars;
    const totalTakeInRiel = (this.amountTake ?? 0) * this.exchangeRate + (this.amountRiel ?? 0);

    // Calculate remaining balance
    this.remainingAmount = parseFloat((total - totalTakeInDollar).toFixed(2));
    this.remainingAmountRiel = parseFloat((total * this.exchangeRate - totalTakeInRiel).toFixed(2));

    // Determine amountPaid logic
    this.amountPaid = this.amountTake && this.amountTake > 0 ? this.amountTake : null;
    this.amountPaidInR = this.amountRiel && this.amountRiel > 0 ? this.amountRiel : null;

    // Calculate change due
    this.changeDue = parseFloat((totalTakeInDollar - total).toFixed(2));
    this.changeDueInR = this.changeDue * this.exchangeRate;

}


  
  // calculateRemainingRiel(){
  //   const total = this.cartService.getTotalPrice();
  //   this.remainingAmountRiel = total * this.exchangeRate - this.amountRiel;
  // }

  resetForm() {
    this.product_image = '';
    this.product_name = '';
    this.price = 0;
    this.total_price = 0;
    this.amountTake = 0;
    this.remainingAmount = 0;
    this.discount = 0;
  }


  addSale() {
    const decodedToken = this.accountService.decodeToken();
    const userId = decodedToken?.userId || '';

    const total = this.cartService.getTotalPrice();
    const rielInDollars = this.amountRiel ? this.amountRiel / this.exchangeRate : 0;

    const totalAmountTaken = (this.amountTake ?? 0) + rielInDollars;

    if (totalAmountTaken < total) {
        Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'Not enough amount',
            showConfirmButton: true,
            timer: 4500,
        });
        return;
    }

    // Calculate change
    const changeDue = totalAmountTaken - total;
    const changeDueInR = changeDue * this.exchangeRate;

    let data = {
        sale_id: this.sale_id,
        userId: userId,
        orderType: this.orderType,
        sale_date: new Date().toISOString(),
        sale_detail_request: this.cartService.getItems().map((item: any) => ({
            product_id: item.product_id,
            price: item.price,
            qty: item.qty,
            discount: item.discount || 0,
            totalTakeInRiel: this.amountRiel ?? null,
            totalTakeInDollar: this.amountTake ?? null,
            total_price: item.price * item.qty - (item.price * item.qty * (item.discount || 0)) / 100,
        })),
        invoices: [{
            saleBy: userId,
            totalAmount: total,
            totalAmountInR: total * this.exchangeRate,
            amountPaid: this.amountTake ? this.amountTake : null,
            amountPaidInR: this.amountRiel ? this.amountRiel : null,
            changeDue: changeDue,
            changeDueInR: changeDueInR,
            invoiceDate: new Date().toISOString(),
        }]
    };

    if (!this.cartService.getItems().length) {
        Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'Cart is empty!',
            showConfirmButton: true,
            timer: 4500,
        });
        return;
    }

    this.saleService.addSale(data).subscribe((res: any) => {
        if (res.status === 'Succeed') {
            // Store changeDue and changeDueInR in the service before navigating
            this.checkoutService.setChangeDue(changeDue, changeDueInR);

            document.getElementById('close-module')?.click();
            this.router.navigate(['/saleSucceed']);
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Thank you...!',
                showConfirmButton: false,
                timer: 2500,
            });

            this.cartService.clearItems();
            this.resetForm();
        } else {
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Something went wrong',
                showConfirmButton: false,
                timer: 2500,
            });
        }
    });
}


//   addSale() {
//     const decodedToken = this.accountService.decodeToken();
//     const userId = decodedToken?.userId || '';

//     const total = this.cartService.getTotalPrice();
//     const rielInDollars = this.amountRiel ? this.amountRiel / this.exchangeRate : 0;

//     // Allow amountTake to be null
//     const totalAmountTaken = (this.amountTake ?? 0) + rielInDollars;

//     if (totalAmountTaken < total) {
//         Swal.fire({
//             position: 'center',
//             icon: 'error',
//             title: 'Not enough amount',
//             showConfirmButton: true,
//             timer: 4500,
//         });
//         return;
//     }

//     // Calculate change
//     const changeDue = totalAmountTaken - total;
//     const changeDueInR = changeDue * this.exchangeRate;

//     let data = {
//         sale_id: this.sale_id,
//         userId: userId,
//         sale_date: new Date().toISOString(),
//         sale_detail_request: this.cartService.getItems().map((item: any) => ({
//             product_id: item.product_id,
//             price: item.price,
//             qty: item.qty,
//             discount: item.discount || 0,
//             totalTakeInRiel: this.amountRiel ?? null, // Allow null if paid in dollars
//             totalTakeInDollar: this.amountTake ?? null, // Allow null if paid in Riel
//             total_price: item.price * item.qty - (item.price * item.qty * (item.discount || 0)) / 100,
//         })),
//         invoices: [{
//             saleBy: userId,
//             totalAmount: total,
//             totalAmountInR: total * this.exchangeRate,
//             amountPaid: this.amountTake ? this.amountTake : null, // If paid in dollars, store the dollar amount, else null
//             amountPaidInR: this.amountRiel ? this.amountRiel : null, // If paid in Riel, store the Riel amount, else null
//             changeDue: changeDue,
//             changeDueInR: changeDueInR,
//             invoiceDate: new Date().toISOString(),
//         }]
//     };

//     if (!this.cartService.getItems().length) {
//         Swal.fire({
//             position: 'center',
//             icon: 'error',
//             title: 'Cart is empty!',
//             showConfirmButton: true,
//             timer: 4500,
//         });
//         return;
//     }

//     this.saleService.addSale(data).subscribe((res: any) => {
//         if (res.status === 'Succeed') {
//             document.getElementById('close-module')?.click();
//             this.router.navigate(['/home']);
//             Swal.fire({
//                 position: 'center',
//                 icon: 'success',
//                 title: 'Thank you...!',
//                 showConfirmButton: false,
//                 timer: 2500,
//             });
//             this.cartService.clearItems();
//             this.resetForm();
//         } else {
//             Swal.fire({
//                 position: 'center',
//                 icon: 'error',
//                 title: 'Something went wrong',
//                 showConfirmButton: false,
//                 timer: 2500,
//             });
//         }
//     });
// }


  
}
