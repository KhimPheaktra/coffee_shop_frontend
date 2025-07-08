import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DataTablesModule } from 'angular-datatables';
import { ADTSettings } from 'angular-datatables/src/models/settings';
import { NgxPaginationModule } from 'ngx-pagination';
import { Subject } from 'rxjs';

import { CategoryService } from '../../../service/category.service';
import { ToastService } from '../../../service/toast.service';
import { SearchComponent } from '../../features/search/search.component';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [NgxPaginationModule, HttpClientModule, CommonModule, DataTablesModule, FormsModule, ReactiveFormsModule,SearchComponent],
  templateUrl: './category.component.html',
  styleUrl: './category.component.css'
})
export class CategoryComponent implements OnInit ,OnDestroy{

  categoryList: any[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalProduct: any;



  btnSave: boolean = false;
  btnEdit: boolean = false;
  btnDelete: boolean = false;

  category_id = 0;
  category_name = "";
  category_description = "";

  filteredCategory:any =[];
  searchText = '';

  
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(
    private categoryService: CategoryService,
    private toastService: ToastService,
    private activatedRoute: ActivatedRoute,
    private router: Router,

  ){}
  ngOnInit(): void {
    this.getCategory();

    this.activatedRoute.queryParams.subscribe(params => {
      this.searchText = params['search'] || '';
      this.currentPage =  Number(params['page']); 
      this.filterCategory(this.searchText);
  });
  }
  ngOnDestroy(): void {

  }

  onSearch() {
    this.router.navigate([], { queryParams: { search: this.searchText } });
  }
 

  sortById() {
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.categoryList.sort((a, b) => {
      return this.sortDirection === 'desc'
        ? b.category_id - a.category_id
        : a.category_id - b.category_id;
    });
    this.filteredCategory = this.categoryList;
  }
  
  resetForm() {
    this.category_id = 0;
    this.category_name = "";
    this.category_description = "";
  }

  getCategory(){
    
    this.categoryService.getCategory().subscribe((res: any) => {
      if(res.status === "Succeed"){
        this.categoryList = res.categoryList;
        this.filteredCategory = res.categoryList;
        this.totalProduct = res.length; 
      }
    })
  }

  pageitem(page: number) {
    // this.router.navigate([], { 
    //   queryParams: { page: page }
    // });
  }


filterCategory(searchText: string) {
  if (!searchText?.trim()) {
    this.filteredCategory = this.categoryList;
  } else {
    const lowerSearch = searchText.toLowerCase().trim();
    this.filteredCategory = this.categoryList.filter((category: { category_name: string }) =>
      category.category_name.toLowerCase().includes(lowerSearch)
    );
  }
}




  AddNew(): void {
    this.visibleCRUDButton("C");
}
visibleCRUDButton(evName: string) {
  this.btnSave = evName === "C";
  this.btnEdit = evName === "E";
  this.btnDelete = evName === "D";
  this.resetForm();
}

  ViewCategory(category_id: any,evName: string){
    this.visibleCRUDButton(evName);

    let data = {
      category_id: category_id
    };
    this.categoryService.getCategoryById(data).subscribe((res: any) => {
      if(res.status === 'Succeed'){
        this.category_id = res.categoryList[0].category_id;
        this.category_name = res.categoryList[0].category_name;
        this.category_description = res.categoryList[0].category_description;
      }
    });
  }

  SaveCategory(){

    let data = {
      category_id: this.category_id,
      category_name: this.category_name,
      category_description: this.category_description,
    };
    this.categoryService.addCategory(data).subscribe((res: any) =>{  
      if(res.status === 'Succeed'){
        this.getCategory();
        this.resetForm();
        document.getElementById("close")?.click();
        this.toastService.doToastInfo('Add Succeed', 'Information', 'Succeed');
      }
      else{
        this.toastService.doToastInfo('Something when wrong', 'Information', 'Error');

      }
    });
  }
    editCategory() {
      let data = {
        category_id: this.category_id,
        category_name: this.category_name,
        category_description: this.category_description,
      };
      this.categoryService.editCategory(data).subscribe((res: any) => {
        if (res.status === 'Succeed'){
          this.getCategory();
          this.resetForm();
          document.getElementById("close")?.click();
          this.toastService.doToastInfo('Edit Succeed', 'Information', 'Succeed');
        }
        else{
          this.toastService.doToastInfo('Something when wrong', 'Information', 'Error');

        }
      });
    }
    deleteCategory(category_id: any) {
        let data = {
          category_id: this.category_id,
          category_name: this.category_name,
          category_description: this.category_description,
        };
        
        this.categoryService.deleteCategory(data).subscribe((res: any) => {
          if (res.status === 'Succeed') {
            this.getCategory();
            this.resetForm();
            document.getElementById("close")?.click();
            document.getElementById('close-delete-popup')?.click();
            this.toastService.doToastInfo('Delete Succeed', 'Information', 'Succeed');
          }
          else{
            this.toastService.doToastInfo('Something when wrong', 'Information', 'Error');

          }
        });
      }

}
