import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AmountService {

  constructor() { }
  private amountInputSubject = new BehaviorSubject<number>(0);

  setAmountInput(userId: number, amount: number) {
    if (!userId) return;
  
    // Store amount using user ID as the key
    localStorage.setItem(`amountInput_${userId}`, amount.toString());
  
    // Also update the BehaviorSubject to notify the application
    this.amountInputSubject.next(amount);
  }
  getAmountInput(userId: number): number {
    if (!userId) return 0; // Ensure user ID is valid
  
    // Retrieve the stored amount for the logged-in user
    const storedAmount = localStorage.getItem(`amountInput_${userId}`);
    
    if (storedAmount) {
      return parseFloat(storedAmount);
    }
  
    return 0; // Default to 0 if no amount is stored
  }
  
  resetAmountInput(userId: number) {
    localStorage.removeItem(`amountInput_${userId}`);
    this.amountInputSubject.next(0); // Reset to 0
}

  // getAmountInput(): number {
  //   // Check localStorage first in case of page refresh
  //   const storedAmount = localStorage.getItem('amountInput');
  //   if (storedAmount) {
  //     const amount = parseFloat(storedAmount);
  //     this.amountInputSubject.next(amount);
  //     return amount;
  //   }
  //   return this.amountInputSubject.getValue();
  // }
  
}
