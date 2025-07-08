import { CommonModule } from '@angular/common';
import { Component, HostListener, NgZone, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { DataTablesModule } from 'angular-datatables';

import Module from 'node:module';

import { CartComponent } from '../landing/cart/cart.component';
import { AccountService } from '../../service/account.service';
import { CartService } from '../../service/cart.service';

@Component({
  selector: 'app-body',
  standalone: true,
  imports: [
    FormsModule,
    DataTablesModule,
    ReactiveFormsModule,
    RouterModule,
    CommonModule,
    CartComponent,
  ],
  templateUrl: './body.component.html',
  styleUrl: './body.component.css',
})

export class BodyComponent implements OnInit {
  searchText: any;
  cartItems: any;
  loggedInUsername: string = '';
  role: string = '';
  userProfile: string = '';
  currentDate: Date = new Date();
  userId = 0;
  productList: { product_name: string; product_type_name: string }[] = [];
  producttypeList: { product_type_name: string }[] = [];
  filteredProducts: any[] = [];
  filteredCategories: any[] = [];

  isCartVisible = false;
  isLoging: boolean = false;
  isHomePage: boolean = false;

  cartVisible$ = this.cartService.cartVisible$;
  orderCount$ = this.cartService.orderCount$;
  isMobile: boolean = false;
  
  constructor(
    private router: Router,
    private accountService: AccountService,
    private ngZone: NgZone,
    private cartService: CartService
  ) {}
  ngOnInit(): void {
    // for check user information 
    // const decodedToken = this.accountService.decodeToken();
    // this.loggedInUsername = decodedToken.name;
    // this.role = decodedToken?.Role || '';
    // this.userProfile = decodedToken?.userProfile || ''; 
    const decodedToken = this.accountService.decodeToken();
    if (decodedToken) {
      this.loggedInUsername = decodedToken.name;
      this.role = decodedToken.Role;
      this.userProfile = decodedToken.userProfile;
    } else {
      this.loggedInUsername = '';
      this.role = '';
      this.userProfile = '';
    }

    // check screen size
    this.checkScreenSize();
    window.addEventListener('resize', () => this.checkScreenSize());

    // check if not home make the cart disible 
    this.isHomePage = this.router.url === '/home';
    // Subscribe to the router events to detect route changes
    this.router.events.subscribe(() => {
      this.isHomePage = this.router.url === '/home';
    });

    // current date time
    this.ngZone.runOutsideAngular(() => {
      setInterval(() => {
        this.ngZone.run(() => {
          this.currentDate = new Date();
        });
      }, 1000);
    });


  }

  onSearch() {
    this.router.navigate([], { queryParams: { search: this.searchText } });
    this.filterAll();
  }

 signout(): void {
  const decodedToken = this.accountService.decodeToken();
  const userId = decodedToken?.userId || null;
  this.accountService.logout(userId).subscribe({
    next: () => {
      sessionStorage.removeItem('isLogin');
      this.accountService.setToken(null);        // Clear token in memory
      this.accountService.setIsLogin(false);
      this.isLoging = false;
      this.router.navigate(['/login']);
    },
    error: (err) => {
      this.accountService.setToken(null);
      this.accountService.setIsLogin(false);
      this.isLoging = false;
      this.router.navigate(['/login']);
    }
  });
}

  

  // signout(userId: any): void {
  //   this.accountService.UserLogout(userId)
  //   sessionStorage.removeItem('isLogin');
  //   this.accountService.setIsLogin(false);
  //   this.isLoging = false;
  //   window.location.href = '/login';
  // }

  filterAll() {
    this.filteredProducts = !this.searchText
      ? this.productList
      : this.productList.filter(
          (product) =>
            product.product_name
              .toLowerCase()
              .includes(this.searchText.toLowerCase()) ||
            product.product_type_name
              .toLowerCase()
              .includes(this.searchText.toLowerCase())
        );

    this.filteredCategories = !this.searchText
      ? this.producttypeList
      : this.producttypeList.filter((producttype) =>
          producttype.product_type_name
            .toLowerCase()
            .includes(this.searchText.toLowerCase())
        );
  }

  toggleCart() {
    this.cartService.toggleCart();
  }

private checkScreenSize() {
  this.isMobile = window.innerWidth <= 768;
}

  ngOnDestroy() {
    window.removeEventListener('resize', () => this.checkScreenSize());
  }

  
}
