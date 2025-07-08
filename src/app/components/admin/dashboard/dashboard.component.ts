import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { RouterOutlet } from '@angular/router';

import { SaleService } from '../../../service/sale.service';
import { SaleListComponent } from '../sale-list/sale-list.component';
import { UserService } from '../../../service/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AccountService } from '../../../service/account.service';

interface SaleGroup {
  sale_id: number;
  sale_date: string;
  items: any[];
  groupTotal: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [SaleListComponent, CommonModule, FormsModule, HttpClientModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  saleList: any[] = [];
  groupedSales: SaleGroup[] = [];
  todaySalesCount: number = 0;
  allSalesCount: number = 0;
  userList: any[] = [];
  allUser: number = 0;
  filteredSales: any[] = [];

  constructor(
    private saleService: SaleService,
    private userService: UserService,
    private accountService: AccountService
  ) {}

  ngOnInit(): void {
    this.getSale();
    this.getUser();
  }

  getFilteredTotal() {
    return this.filteredSales.reduce((acc, sale) => {
      return acc + sale.price * sale.qty * (1 - (sale.discount || 0) / 100);
    }, 0);
  }

  getUser() {
    this.userService.getAllUser().subscribe((res: any) => {
      this.userList = res.userList;
      this.allUser = this.userList.length;
    });
  }

  getSale() {
    this.saleService.getSale().subscribe((res: any) => {
      this.saleList = res.saleList;
      this.groupSales();
      this.calculateSalesCounts();
      this.filteredSales = this.saleList;
    });
  }

  groupSales() {
    const uniqueSales = new Map<number, SaleGroup>();

    this.saleList.forEach((sale) => {
      const saleDetails = sale.sale_details || [];

      uniqueSales.set(sale.sale_id, {
        sale_id: sale.sale_id,
        sale_date: sale.sale_date,
        items: saleDetails.map((detail: any) => ({
          product_name: detail.product_name,
          price: detail.price,
          qty: detail.qty,
          discount: detail.discount,
          total_price:
            detail.price * detail.qty * (1 - (detail.discount || 0) / 100),
        })),
        groupTotal: saleDetails.reduce(
          (sum: number, detail: any) =>
            sum +
            detail.price * detail.qty * (1 - (detail.discount || 0) / 100),
          0
        ),
      });
    });

    this.groupedSales = Array.from(uniqueSales.values()).sort(
      (a, b) =>
        new Date(b.sale_date).getTime() - new Date(a.sale_date).getTime()
    );
  }

  calculateSalesCounts() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Count unique sale_ids for today
    this.todaySalesCount = this.groupedSales.filter((sale) => {
      const saleDate = new Date(sale.sale_date);
      saleDate.setHours(0, 0, 0, 0);
      return saleDate.getTime() === today.getTime();
    }).length;

    // Count total unique sale_ids
    this.allSalesCount = this.groupedSales.length;
  }
}
