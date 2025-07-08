import { Component, OnInit } from '@angular/core';
import { CheckoutService } from '../../../service/checkout.service';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sale-succeed',
  standalone: true,
  imports: [HttpClientModule,CommonModule],
  templateUrl: './sale-succeed.component.html',
  styleUrl: './sale-succeed.component.css'
})
export class SaleSucceedComponent implements OnInit {

  changeDue: number = 0;
  changeDueInR: number = 0;

  constructor(private checkoutService: CheckoutService){}
  ngOnInit(): void {
    const change = this.checkoutService.getChangeDue();
    this.changeDue = change.changeDue;
    this.changeDueInR = change.changeDueInR;
  }

}
