import { Component, OnInit } from '@angular/core';
import { ShiftInfoService } from '../../../service/shift-info.service';
import { HttpClientModule } from '@angular/common/http';
import { NgxPaginationModule } from 'ngx-pagination';
import { CommonModule } from '@angular/common';
import { DataTablesModule } from 'angular-datatables';
import { ElementRef, ViewChild } from '@angular/core';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { AccountService } from '../../../service/account.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

export interface saleReport {
  userWInfoId: number;
  startBy: number;
  startAt: "";
  amountInput: number;
  endBy: number;
  endAt: "";
  totalSale: number;
  totalAmount: number;
}
export interface saleReportResponse {
  status: string; 
  saleList: saleReport[];
}
@Component({
  selector: 'app-sale-report',
  standalone: true,
  imports: [HttpClientModule,NgxPaginationModule,CommonModule,DataTablesModule,FormsModule,NgxPaginationModule],
  templateUrl: './sale-report.component.html',
  styleUrl: './sale-report.component.css'
})
export class SaleReportComponent implements OnInit{
  @ViewChild('printSection', { static: false }) printSection!: ElementRef;
  showReport: boolean = false;
  saleList: any[]=[];
  groupedSales: any[] = []; 
  originalSales: saleReport[] = []; // Add this to store raw data
  currentTime: string = '';
  userName = "";
  todaySales: any[] = [];
  totalSalesToday: number = 0;
  totalAmountToday: number = 0;
  filteredSales: any[] = [];
  startAt: string | null = null; // For start date
  endAt: string | null = null; // For end date
  noDataFound: boolean = false;
  currentDate: string = new Date().toISOString().split('T')[0]; 
  currentPage: number = 1;
  itemsPerPage: number = 50;

  constructor(
    private shiftInfoService: ShiftInfoService,
    private accountService: AccountService,
    private router:Router
  ){}


  ngOnInit(): void {
    this.getSaleReport();

    const decodedToken = this.accountService.decodeToken();
    this.userName = decodedToken.name;

     // Initialize the current time and update every second
     this.updateTime();
     setInterval(() => this.updateTime(), 1000);
  }
  pageitem(page: number) {
    this.router.navigate([], {
      queryParams: { page: page }
    });
  }
  
  
  updateTime() {
    this.currentTime = new Date().toLocaleTimeString();
  }
  
  getSaleReport(): void {
    this.shiftInfoService.getReport().subscribe((res: saleReportResponse) => {
      if (res.status === "Succeed") {
        this.originalSales = res.saleList; // Store the raw data
        this.saleList = this.groupSalesByStartAt(this.originalSales);
        this.filterSalesByDate(); // Apply filter if dates are set
      }
    });
  }
  
  clearFilters(): void {
    this.startAt = '';
    this.endAt = '';
    if (this.originalSales.length) {
      this.saleList = this.groupSalesByStartAt(this.originalSales);
      this.noDataFound = this.saleList.length === 0;
    }
  }
  
  filterSalesByDate(): void {
    if (!this.originalSales.length) return;
  
    let filteredData = [...this.originalSales]; // Work with raw data copy
  
    if (this.startAt || this.endAt) {
      const startDate = this.startAt ? new Date(this.startAt) : null;
      const endDate = this.endAt ? new Date(this.endAt) : null;
  
      // Validate dates
      if (startDate && isNaN(startDate.getTime())) return;
      if (endDate && isNaN(endDate.getTime())) return;
  
      if (endDate) {
        endDate.setHours(23, 59, 59, 999);
      }
  
      filteredData = this.originalSales.filter((sale) => {
        const saleDate = new Date(sale.startAt);
        return (
          (!startDate || saleDate >= startDate) &&
          (!endDate || saleDate <= endDate)
        );
      });
    }
  
    this.saleList = this.groupSalesByStartAt(filteredData);
    this.noDataFound = this.saleList.length === 0;
  }
  
  // Keep groupSalesByStartAt as is
  groupSalesByStartAt(sales: saleReport[]): { date: string; items: saleReport[]; totalSale: number; totalAmount: number }[] {
    const grouped = sales.reduce((acc: { [key: string]: saleReport[] }, sale) => {
      const startAt = new Date(sale.startAt).toDateString();
      if (!acc[startAt]) {
        acc[startAt] = [];
      }
      acc[startAt].push(sale);
      return acc;
    }, {});
  
    return Object.keys(grouped).map((date) => {
      const items = grouped[date];
      const totalSale = items.reduce((sum, item) => sum + item.totalSale, 0);
      const totalAmount = items.reduce((sum, item) => sum + item.totalAmount, 0);
  
      return {
        date,
        items,
        totalSale,
        totalAmount,
      };
    });
  }
  
  // Update printTable
  printTable(startAt?: any): void {
    // this.showReport = true;
    
    let filteredList = [...this.saleList];
    if (startAt) {
      const targetDate = new Date(startAt);
      filteredList = this.saleList.filter(group => 
        new Date(group.date).toDateString() === targetDate.toDateString()
      );
    }
  
    const originalSaleList = [...this.saleList];
    this.saleList = filteredList;
  
    setTimeout(() => {
      const printContent = document.getElementById('printSection')?.innerHTML;
      const newWindow = window.open('', '', 'width=800,height=600');
  
      if (newWindow) {
        newWindow.document.open();
        newWindow.document.write(`
          <html>
            <head>
              <title>Sales Report - T System</title>
              <style>
                @page { margin: 0; size: auto; }
                @media print { html, body { margin: 0; padding: 0; } }
                body { font-family: Arial, sans-serif; padding: 20px; }
                .report-container { width: 100%; max-width: 100%; margin: auto; }
                .report-header { text-align: center; margin-bottom: 20px; }
                .report-table { width: 100%; border-collapse: collapse; }
                .report-table th, .report-table td { border: 1px solid black; padding: 5px; text-align: left; }
                .report-footer { margin-top: 20px; text-align: left; }
              </style>
            </head>
            <body>
              <div class="report-container">
                ${printContent}
              </div>
            </body>
          </html>
        `);
        newWindow.document.close();
        newWindow.print();
        newWindow.close();
      }
  
      this.saleList = originalSaleList;
      this.showReport = false;
    }, 100);
  }
  
  downloadPDF(startAt?: any): void {
    try {
      console.log("Starting PDF download process...");
      this.showReport = true;
      
      // Filter the data if needed
      let filteredList = [...this.saleList];
      if (startAt) {
        const targetDate = new Date(startAt);
        filteredList = this.saleList.filter(group => 
          new Date(group.date).toDateString() === targetDate.toDateString()
        );
      }
      
      const originalSaleList = [...this.saleList];
      this.saleList = filteredList;
      
      // Give more time for the DOM to update
      setTimeout(() => {
        // Get the print section element
        const element = document.getElementById('printSection');
        if (!element) {
          console.error("Element with ID 'printSection' not found");
          this.saleList = originalSaleList;
          this.showReport = false;
          return;
        }
        
        // Create a temporary container with fixed width to ensure all columns are captured
        const tempContainer = document.createElement('div');
        tempContainer.style.position = 'absolute';
        tempContainer.style.left = '-9999px';
        tempContainer.style.top = '0';
        tempContainer.style.width = '1200px'; // Force a wider width to accommodate all columns
        tempContainer.style.background = 'white';
        tempContainer.style.padding = '20px';
        
        // Clone the content to our temporary container
        tempContainer.innerHTML = element.innerHTML;
        
        // Adjust table width in the clone to ensure it fills the container
        const tables = tempContainer.querySelectorAll('table');
        tables.forEach(table => {
          table.style.width = '100%';
          table.style.tableLayout = 'auto';
        });
        
        // Add to document for rendering
        document.body.appendChild(tempContainer);
        
        // Use html2canvas with improved settings
        html2canvas(tempContainer, {
          scale: 1.5, // Slightly lower scale to prevent size issues
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
          windowWidth: 1200, // Match container width
          windowHeight: tempContainer.scrollHeight,
          logging: true,
        }).then(canvas => {
          console.log("Canvas generated successfully", canvas.width, canvas.height);
          document.body.removeChild(tempContainer);
          
          try {
            // Create PDF with landscape orientation for wider tables
            const pdf = new jsPDF('l', 'mm', 'a4'); // 'l' for landscape
            
            // Get dimensions
            const imgData = canvas.toDataURL('image/png');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            
            // Calculate image dimensions to fit the page while maintaining aspect ratio
            const imgWidth = pdfWidth - 20; // 10mm margin on each side
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            
            // Add image to PDF
            pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
            
            // Handle multi-page if needed
            if (imgHeight > pdfHeight - 20) {
              let heightLeft = imgHeight - (pdfHeight - 20);
              let position = -(pdfHeight - 20);
              
              while (heightLeft > 0) {
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
                heightLeft -= (pdfHeight - 20);
                position -= (pdfHeight - 20);
              }
            }
            
            const filename = startAt 
              ? `Sales_Report_${new Date(startAt).toISOString().split('T')[0]}.pdf`
              : 'Sales_Report_T_System.pdf';
            
            console.log(`Saving PDF as: ${filename}`);
            pdf.save(filename);
            console.log("PDF saved successfully");
          } catch (error) {
            console.error("Error creating PDF:", error);
          }
          
          // Restore original state
          this.saleList = originalSaleList;
          this.showReport = false;
        }).catch(err => {
          console.error("Error generating canvas:", err);
          document.body.removeChild(tempContainer);
          this.saleList = originalSaleList;
          this.showReport = false;
        });
      }, 300); // Slightly longer timeout
    } catch (error) {
      console.error("Error in downloadPDF:", error);
      this.saleList = this.originalSales;
      this.showReport = false;
    }
  }
}
