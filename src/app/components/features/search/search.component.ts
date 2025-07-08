import { Component, EventEmitter, Output } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { AccountService } from '../../../service/account.service';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [FormsModule,DataTablesModule,ReactiveFormsModule,RouterModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent {
 searchText:any;
  @Output() searchChanged = new EventEmitter<string>();
  cartItems: any;
  loggedInUsername: string = '';


  productList: { product_name: string; category_name: string }[] = [];
  categoryList: { category_name: string }[] = [];
  filteredProducts: any[] = [];
  filteredCategory: any[] = [];

  constructor(
    private router: Router,
    private accountService: AccountService,
  ){}
  ngOnInit(): void {

  
  }
  
  onSearch() {
    this.searchChanged.emit(this.searchText);
  }
  // onSearch() {
  //   this.router.navigate([], { queryParams: { search: this.searchText } });
  // }
 

}
