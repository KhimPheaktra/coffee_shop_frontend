import { Component, OnInit } from '@angular/core';

import { DataTablesModule } from 'angular-datatables';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ExchangeRateService } from '../../../service/exchange-rate.service';
import { ToastService } from '../../../service/toast.service';
import { SearchComponent } from '../../features/search/search.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-exchange-rate',
  standalone: true,
  imports: [DataTablesModule,CommonModule,FormsModule,HttpClientModule,ReactiveFormsModule,SearchComponent,NgxPaginationModule],
  templateUrl: './exchange-rate.component.html',
  styleUrl: './exchange-rate.component.css'
})
export class ExchangeRateComponent implements OnInit {

  exchangeRate: any[] = [];
  
  exchangrateId = 0;
  currencyCode = "";
  natRate = 0;
  rate = 0;
  effectiveDate = "";

  filteredExchange: any[]= [];
  currentPage: number = 1;
  itemsPerPage: number = 10;

  btnSave: boolean = false;
  btnEdit: boolean = false;
  btnDelete: boolean = false;
  
  searchText = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(private exchangeRateService: ExchangeRateService,    
    private toastService: ToastService,
    private activatedRoute: ActivatedRoute
  ){}

  ngOnInit(): void {
    this.GetExchangeRate();


    this.activatedRoute.queryParams.subscribe(params => {
      this.searchText = params['search'] || '';
      this.currentPage =  Number(params['page']); 
      this.filterExchange(this.searchText);
  });
  }

  
 filterExchange(searchText: string) {
  if (!searchText?.trim()) {
    this.filteredExchange = this.exchangeRate;
  } else {
    const lowerSearch = searchText.toLowerCase().trim();
    this.filteredExchange = this.exchangeRate.filter(
      (exchange: { currencyCode: string }) =>
        exchange.currencyCode.toLowerCase().includes(lowerSearch)
    );
  }
}


  sortById() {
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.exchangeRate.sort((a, b) => {
      return this.sortDirection === 'desc'
        ? b.exchangrateId - a.exchangrateId
        : a.exchangrateId - b.exchangrateId;
    });
    this.filteredExchange = this.exchangeRate;
  }
    pageitem(page: number) {
    // this.router.navigate([], {
    //   queryParams: { page: page }
    // });
  }


  resetForm(){
  this.exchangrateId = 0;
  this.currencyCode = "";
  this.rate = 0;
  this.effectiveDate = "";
  }

  	GetExchangeRate() {
    this.exchangeRateService.getExchangeRate().subscribe((res: any) => {
      if (res.status === 'Succeed') {
        this.exchangeRate = res.exchangeRate;
        this.filteredExchange = this.exchangeRate;
      }
    })
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

  ViewExchangeRate(exchangrateId: any,evName: string){
    this.visibleCRUDButton(evName);
    let data = {
      exchangrateId: exchangrateId
    };
    this.exchangeRateService.getExchangeRateById(data).subscribe((res: any) => {
      if(res.status === "Succeed"){
        this.exchangrateId = res.exchangeRate[0].exchangrateId;
        this.currencyCode = res.exchangeRate[0].currencyCode;
        this.natRate = res.exchangeRate[0].natRate;
        this.rate = res.exchangeRate[0].rate;
        this.effectiveDate = res.exchangeRate[0].effectiveDate;
      }
    });
  }
  SaveExchangeRate(){
    let data = {
      exchangrateId: this.exchangrateId,
      currencyCode: this.currencyCode,
      natRate: this.natRate,
      rate: this.rate,
      effectiveDate: new Date().toISOString(), 
    }
    this.exchangeRateService.editExchangeRate(data).subscribe((res: any) => {
      if(res.status === "Succeed"){
       this.GetExchangeRate();
       this.resetForm();
       document.getElementById('close')?.click();
       this.toastService.doToastInfo('Add Succeed', 'Information', 'Succeed');
      }
      else{
        this.toastService.doToastInfo('Something when wrong', 'Information', 'Error');
      }
    })
  }
  EditExchangeRate(){
    let data = {
      exchangrateId: this.exchangrateId,
      currencyCode: this.currencyCode,
      natRate: this.natRate,
      rate: this.rate,
      effectiveDate: new Date().toISOString(), 
    }
    this.exchangeRateService.editExchangeRate(data).subscribe((res: any) => {
      if(res.status === "Succeed"){
       this.GetExchangeRate();
       this.resetForm();
       document.getElementById('close')?.click();
       this.toastService.doToastInfo('Edit Succeed', 'Information', 'Succeed');
      }
      else{
        this.toastService.doToastInfo('Something when wrong', 'Information', 'Error');
      }
    })
  }
  DeleteExchangeRate(exchangrateId:any){
    let data = {
      exchangrateId: this.exchangrateId,
      currencyCode: this.currencyCode,
      natRate: this.natRate,
      rate: this.rate,
      effectiveDate: this.effectiveDate, 
    }
    this.exchangeRateService.deleteExchnageRate(data).subscribe((res : any) =>{
      if(res.status === "Succeed"){
        this.GetExchangeRate();
        this.resetForm();
        document.getElementById('close-delete-popup')?.click();
        this.toastService.doToastInfo('Delete Succeed', 'Information', 'Succeed');
      }
      else{
        this.toastService.doToastInfo('Something when wrong', 'Information', 'Error');
      }
    })
  }
}
