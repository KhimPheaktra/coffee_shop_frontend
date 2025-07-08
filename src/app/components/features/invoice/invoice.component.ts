import { Component, Input, OnInit } from '@angular/core';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule, PercentPipe } from '@angular/common';
import { DataTablesModule } from 'angular-datatables';
import { SaleService } from '../../../service/sale.service';
import { InvoiceService } from '../../../service/invoice.service';
import { Router } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { ToastService } from '../../../service/toast.service';
@Component({
  selector: 'app-invoice',
  standalone: true,
  imports: [HttpClientModule,CommonModule,DataTablesModule,NgxPaginationModule],
  templateUrl: './invoice.component.html',
  styleUrl: './invoice.component.css'
})
export class InvoiceComponent implements OnInit {
  @Input() saleData: any;
  invoiceList: any[] = []
  currentDate = new Date();
  currentTime = this.currentDate.toLocaleTimeString();
  shopName = 'T System';
  isPrintMode = false;
  page: number = 1;
  selectedInvoice: any = null;
  sortDirection: 'asc' | 'desc' = 'asc';
  constructor(private invoiceService:InvoiceService,private router:Router,private toastService:ToastService){}
  ngOnInit(): void {
    this.getInvoice();
  }

  getInvoice() {

    this.invoiceService.getInvoice().subscribe((res: any) => {
      if (res.status === 'Succeed') {
        this.invoiceList = res.invoiceList
        this.invoiceList.sort((a, b) => b.invoiceId - a.invoiceId);
      }
    });
  }
  sortById() {
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.invoiceList.sort((a, b) => {
      return this.sortDirection === 'asc'
        ? b.invoiceId - a.invoiceId
        : a.invoiceId - b.invoiceId;
    });
    
  }
  pageitem(page: number) {
    this.router.navigate([], {
      queryParams: { page: page }
    });
  }

  ToHomePage() {
    this.router.navigate(['/home']);
  }

  printInvoice(invoiceId: number) {
    this.selectedInvoice = this.invoiceList.find(sale => sale.invoiceId === invoiceId);
  
    if (!this.selectedInvoice || !Array.isArray(this.selectedInvoice.products)) {
      this.toastService.doToastInfo("Work stated successfully","Information","Succeed");
      return;
    }
  
    // Extract invoice data with sale time
    const saleDate = new Date(this.selectedInvoice.sale_date);
    
    const invoiceData = {
      invoiceId: this.selectedInvoice.invoiceId,
      saleDate: saleDate.toLocaleDateString(),
      saleTime: saleDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
      saleBy: this.selectedInvoice.saleBy,
      products: this.selectedInvoice.products,
      discount: this.selectedInvoice.discount || 0,
      totalAmount: this.selectedInvoice.totalAmount || 0,
      amountPaid: this.selectedInvoice.amountPaid || 0,
      changeDue: this.selectedInvoice.changeDue || 0,
      totalAmountInR: this.selectedInvoice.totalAmountInR || 0,
      amountPaidInR: this.selectedInvoice.amountPaidInR || 0,
      changeDueInR: this.selectedInvoice.changeDueInR || 0
    };
  
    // Create and open print window
    setTimeout(() => {
      const printWindow = window.open('', '', 'width=300,height=600');
      if (printWindow) {
        printWindow.document.open();
        printWindow.document.write(this.getInvoiceHTML(invoiceData));
        printWindow.document.close();
  
        printWindow.onload = () => {
          printWindow.print();
          // printWindow.close(); // Uncomment if you want auto-close after print
        };
      }
    }, 300);
  }
  
  // Separate method for HTML template
  private getInvoiceHTML(data: any): string {
    const productsHTML = data.products.map((product: any) => `
      <tr>
        <td>${product.product_name}</td>
        <td class="money-column">$${product.price.toFixed(2)}</td>
        <td class="money-column">${product.qty}</td>
        <td class="money-column">$${product.total.toFixed(2)}</td>
      </tr>
    `).join('');
  
    return `
      <html>
        <head>
          <title>Invoice - T System</title>
          <style>
            @page { 
              margin: 0;
              size: 80mm 297mm; /* Receipt paper size */
            }
            body { 
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 5mm;
              font-size: 10pt;
              line-height: 1.3;
            }
            .invoice-container { 
              width: 70mm;
              margin: 0 auto;
              border: 1px solid #000;
              padding: 5mm;
            }
            .invoice-header { 
              text-align: center;
              margin-bottom: 5mm;
            }
            .company-name {
              font-size: 14pt;
              font-weight: bold;
              margin: 0;
              padding: 0;
            }
            .invoice-title {
              font-size: 12pt;
              font-weight: bold;
              margin: 2mm 0;
            }
            .invoice-meta {
              margin: 1mm 0;
              font-size: 9pt;
              color: #333;
            }
            .divider {
              border-top: 1px dashed #999;
              margin: 3mm 0;
            }
            .invoice-table { 
              width: 100%;
              border-collapse: collapse;
              margin: 3mm 0;
              border: 1px solid #000;
              text-align: center;
            }
            .invoice-table th { 
              border: 1px solid #000;
              padding: 2mm 1mm;
              text-align: center;
              font-size: 9pt;
              background-color: #f9f9f9;
            }
            .invoice-table td { 
              padding: 2mm 1mm;
              text-align: center;
              font-size: 8pt;
              border: 1px solid #000;
            }
            .money-column {
              text-align: center !important;
              font-size: 8pt;
            }
            .totals-section {
              margin-top: 3mm;
              text-align: right;
            }
            .total-row {
              display: flex;
              justify-content: space-between;
              margin: 1mm 0;
            }
            .total-label {
              font-weight: bold;
              font-size: 7pt;
            }
            .total-value {
              font-size: 7pt;
            }
            .grand-total {
              font-weight: bold;
              font-size: 11pt;
              margin-top: 2mm;
            }
            .footer {
              margin-top: 5mm;
              text-align: center;
              font-size: 9pt;
              font-weight: bold; 
            }
            .footer p{
            font-weight: bold; 
            }
            .native-currency {
              font-size: 8pt;
              color: #666;
              margin-top: 0.5mm;
              text-align: right;
            }
            .totals-table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 3mm;
            }
            .totals-table td {
              padding: 2mm;
              font-size: 9pt;
            }
            .totals-table .label {
              text-align: left;
              font-weight: bold;
              font-size: 8pt;
            }
            .totals-table .value.khmer {
              text-align: right;
              font-size: 8pt;
            }
            // .totals-table .khmer {
            //   font-size: 8pt;
            //   color: #666;
            //   text-align: right;
            // }
          </style>
        </head>
        <body>
          <div class="invoice-container">
            <div class="invoice-header">
              <p class="company-name">T SYSTEM</p>
              <p class="invoice-title">INVOICE</p>
              <p class="invoice-meta">Date: ${data.saleDate} | Time: ${data.saleTime}</p>
              <p class="invoice-meta">Invoice ID: ${data.invoiceId}</p>
              <p class="invoice-meta">Sale By: ${data.saleBy}</p>
            </div>
            
            <div class="divider"></div>
  
            <table class="invoice-table">
              <thead>
                <tr>
                  <th width="40%">Item</th>
                  <th width="15%" class="money-column">Price</th>
                  <th width="10%" class="money-column">Qty</th>
                  <th width="20%" class="money-column">Total</th>
                </tr>
              </thead>
              <tbody>
                ${productsHTML}
              </tbody>
            </table>
  
            <div class="divider"></div>
            
            <table class="totals-table">
             <tr>
                <td class="label">Discount</td>
                <td class="value">${data.discount != null ? data.discount + '%' : '0%'}</td>
              </tr>
              <tr>
                <td class="label">សរុបតម្លៃ(ដុល្លា)​ / Grand Total($):</td>
                <td class="value">$${data.totalAmount.toFixed(2)}</td>
              </tr>
              <tr>
                <td  class="label">សរុបតម្លៃ(រៀល)​​/ Grand Total(R)</td>
                <td class="khmer"> ៛${data.totalAmountInR.toFixed(2)}</td>
              </tr>
              
              <tr>
                <td class="label">ប្រាក់ទទួលបា​ន(ដុល្លា) / Received($)</td>
                <td class="value">$${data.amountPaid.toFixed(2)}</td>
              </tr>
              <tr>
                <td class="label">ប្រាក់ទទួលបា​ន(រៀល) / Received(R)</td>
                <td class="khmer">៛${data.amountPaidInR.toFixed(2)}</td>
              </tr>
              
              <tr>
                <td class="label">ប្រាក់អាប់(ដុល្លា)​ / Change($)</td>
                <td class="value">$${data.changeDue.toFixed(2)}</td>
              </tr>
              <tr>
                <td class="label">ប្រាក់អាប់(រៀល)</td>
                <td class="khmer">៛${data.changeDueInR.toFixed(2)}</td>
              </tr>
            </table>
            
            <div class="divider"></div>
            
            <div class="footer">
              <p>Thank you for support our shop!</p>
              <p>Please come again</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }
  
}
