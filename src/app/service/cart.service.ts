import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  globalDiscount: number = 0;

  private cartVisibleSource = new BehaviorSubject<boolean>(false);
  private orderCountSource = new BehaviorSubject<number>(0);

  private items: any[] = [];
  constructor() {}

  cartVisible$ = this.cartVisibleSource.asObservable();
  orderCount$ = this.orderCountSource.asObservable();

  toggleCart() {
    this.cartVisibleSource.next(!this.cartVisibleSource.value);
  }

  updateOrderCount() {
    const totalQty = this.items.reduce((sum, item) => sum + item.qty, 0);
    this.orderCountSource.next(totalQty);
  }

  addToCart(product: any) {
    const existingItem = this.items.find(
      (item) => item.product_id === product.product_id
    );

    if (existingItem) {
      // Increase quantity if product already exists
      this.increaseQty(existingItem);
    } else {
      // Add new product to cart
      this.items.push({ ...product, qty: 1, totalPrice: product.price });
    }
    this.updateOrderCount();
  }
  getItems() {
    return this.items;
  }

  // Method to increase quantity
  increaseQty(item: any) {
    item.qty += 1;
    item.totalPrice = item.qty * item.price;
    this.updateOrderCount();
  }

  updateQty(item: any, qty: number) {
    if (qty < 1) {
      qty = 1;
    }
    item.qty = qty;
    item.totalPrice = item.qty * item.price;
    this.updateOrderCount();
  }

  decreaseQty(item: any) {
    if (item.qty > 1) {
      item.qty -= 1;
      item.totalPrice = item.qty * item.price;
      this.updateOrderCount();
    } else {
      this.removeItem(item);
    }
  }

  // Remove item from cart
  removeItem(product: any) {
    this.items = this.items.filter(
      (item) => item.product_id !== product.product_id
    );
    this.updateOrderCount();
  }

  // Calculate total cart price
  getTotalPrice() {
    // return this.items.reduce((total, item) => total + item.totalPrice, 0);
    return this.items.reduce((total, item) => {
      const discount = item.discount || 0; // Default to 0 if no discount is specified
      const discountedPrice =
        item.totalPrice - (item.totalPrice * discount) / 100;
      return total + discountedPrice;
    }, 0);
  }

  clearItems() {
    this.items = [];
  }
  closeCart() {
    this.cartVisibleSource.next(false);
  }
}
