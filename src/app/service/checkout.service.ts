import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  private changeDue: number = 0;
  private changeDueInR: number = 0;
  constructor() { }
  // Store changeDue values
  setChangeDue(dollar: number, riel: number) {
    this.changeDue = dollar;
    this.changeDueInR = riel;
  }

  // Get the stored values
  getChangeDue() {
    return { changeDue: this.changeDue, changeDueInR: this.changeDueInR };
  }

  // Clear stored values after displaying
  clearChangeDue() {
    this.changeDue = 0;
    this.changeDueInR = 0;
  }
}
