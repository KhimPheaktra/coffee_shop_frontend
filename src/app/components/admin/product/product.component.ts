import { Component, OnDestroy, OnInit } from '@angular/core';

import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ADTSettings } from 'angular-datatables/src/models/settings';
import { debounceTime, pipe, Subject } from 'rxjs';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../../service/product.service';
import { ToastService } from '../../../service/toast.service';
import { CategoryService } from '../../../service/category.service';
import { SearchComponent } from '../../features/search/search.component';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [
    NgxPaginationModule,
    HttpClientModule,
    CommonModule,
    DataTablesModule,
    FormsModule,
    ReactiveFormsModule,
    SearchComponent,
  ],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css',
})
export class ProductComponent implements OnInit, OnDestroy {
  productList: any[] = [];
  categoryList: any[] = [];
  imagePreview: string | null = null;
  selectedProduct: any;
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalProduct: any;

  btnSave: boolean = false;
  btnEdit: boolean = false;
  btnDelete: boolean = false;

  product_id = 0;
  product_name = '';
  product_description = '';
  category_id = 0;
  category_name = '';
  price = 0;
  product_image = '';

  filteredProducts: any = [];
  searchText = "";

  sortDirection: 'asc' | 'desc' = 'asc';
  constructor(
    private productService: ProductService,
    private toastService: ToastService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.getProduct();
    this.getCategory();

    this.activatedRoute.queryParams.subscribe((params) => {
      this.searchText = params['search'] || '';
      this.currentPage = Number(params['page']) || 1; // Default to page 1 if not set
      // this.page = Number(params['page']);

      this.filterProducts(this.searchText);
    });
  }

  ngOnDestroy(): void {

  }


  sortById() {
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.productList.sort((a, b) => {
      return this.sortDirection === 'desc'
        ? b.product_id - a.product_id
        : a.product_id - b.product_id;
    });
    this.filteredProducts = this.productList;
  }
  
filterProducts(searchText: string) {
  if (!searchText) {
    this.filteredProducts = this.productList;
  } else {
    const lowerSearch = searchText.toLowerCase();
    this.filteredProducts = this.productList.filter(
      (product) =>
        product.product_name.toLowerCase().includes(lowerSearch) ||
        product.category_name.toLowerCase().includes(lowerSearch)
    );
  }
}


  AddNew(): void {
    this.visibleCRUDButton('C');
    this.resetForm();
  }
  visibleCRUDButton(evName: string) {
    this.btnSave = evName === 'C';
    this.btnEdit = evName === 'E';
    this.btnDelete = evName === 'D';
    this.resetForm();
  }
  resetForm() {
    this.product_id = 0;
    this.product_name = '';
    this.product_description = '';
    this.category_id = 0;
    this.price = 0;
    this.product_image = '';
    this.imagePreview = '';
  }
  getProduct() {
    this.productService.getProduct().subscribe((res: any) => {
      if (res.status === 'Succeed') {
        this.productList = res.productList;
        this.filteredProducts = this.productList //.sort((a, b) => b.product_id - a.product_id);
        this.totalProduct = res.length;
      }
    });
  }
  // this.groupedSales.sort((a, b) => b.sale_id - a.sale_id);
  pageitem(page: number) {
    this.router.navigate([], {
      queryParams: { page: page }
    });
  }


  getCategory(){
    
    this.categoryService.getCategory().subscribe((res: any) => {
      if(res.status === "Succeed"){
        this.categoryList = res.categoryList;
      }
    })
  }

  ViewProduct(product_id: any, evName: string) {
    this.visibleCRUDButton(evName);
    let data = {
      product_id: product_id,
    };

    this.productService.getProductById(data).subscribe((res: any) => {
      if (res.status === 'Succeed') {
        this.product_id = res.productList[0].product_id;
        this.product_name = res.productList[0].product_name;
        this.product_description = res.productList[0].product_description;
        this.category_id = res.productList[0].category_id;
        this.price = res.productList[0].price;
        // this.product_image = res.productList[0].product_image;
        this.imagePreview = res.productList[0].product_image;
        if (evName === 'E') {
          this.btnEdit = true;
          this.btnDelete = false;
        } else {
          this.btnEdit = false;
          this.btnDelete = true;
        }
      }

    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.product_image = e.target.result;
        this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }
  SaveProduct() {
    let product_image =
      this.product_image || this.selectedProduct.product_image;
    let data = {
      product_id: this.product_id,
      product_name: this.product_name,
      product_description: this.product_description,
      category_id: this.category_id,
      price: this.price,
      product_image: product_image,
    };
    this.productService.addProduct(data).subscribe((res: any) => {
      if (res.status === 'Succeed') {
        this.getProduct();
        this.resetForm();
        document.getElementById('close')?.click();
        this.toastService.doToastInfo('Add Succeed', 'Information', 'Succeed');
      }
      else{
        this.toastService.doToastInfo('Something when wrong', 'Information', 'Error');
      }
    });
  }
  EditProduct() {
    let updatedProductImage =
      this.imagePreview || this.selectedProduct.product_image;
    let data = {
      product_id: this.product_id,
      product_name: this.product_name,
      product_description: this.product_description,
      category_id: this.category_id,
      price: this.price,
      product_image: updatedProductImage,
    };
    this.productService.editProduct(data).subscribe((res: any) => {
      if (res.status === 'Succeed') {
        this.getProduct();
        this.resetForm();
        document.getElementById('close')?.click();
        this.toastService.doToastInfo('Edit Succeed', 'Information', 'Succeed');
      }
      else{
        this.toastService.doToastInfo('Something when wrong', 'Information', 'Error');
      }
    });
  }
  DeleteProduct(product_id: any) {
    let data = {
      product_id: product_id,
      product_name: this.product_name,
      product_description: this.product_description,
      category_id: this.category_id,
      price: this.price,
      product_image: this.product_image,
    };
    this.productService.deleteProduct(data).subscribe((res: any) => {
      if (res.status === 'Succeed') {
        this.getProduct();
        this.resetForm();
        document.getElementById('close')?.click();
        document.getElementById('close-delete-popup')?.click();
        this.toastService.doToastInfo('Delete Succeed', 'Information', 'Succeed');
      }
      else{
        this.toastService.doToastInfo('Something when wrong', 'Information', 'Error');

      }
    });
  }
}
