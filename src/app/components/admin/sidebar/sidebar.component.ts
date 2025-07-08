import { Component, HostListener, OnInit } from '@angular/core';

import {
  ActivatedRoute,
  RouterLink,
  RouterModule,
  RouterOutlet,
} from '@angular/router';

import { FormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { CommonModule } from '@angular/common';
import { AccountService } from '../../../service/account.service';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    RouterLink,
    FormsModule,
    DataTablesModule,
    CommonModule,
    RouterModule,
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
  animations: [
    trigger('dropdownAnimation', [
      state('void', style({ opacity: 0, transform: 'translateY(-20px)' })),
      state('*', style({ opacity: 1, transform: 'translateY(0)' })),
      transition('void => *', [animate('200ms ease-out')]),
      transition('* => void', [animate('200ms ease-in')]),
    ]),
  ],
})
export class SidebarComponent implements OnInit {
  isSidebarCollapsed: boolean = false;
  Username: string = '';
  isDropdownOpen = false;

  isMobile = false;
  constructor(private accountservice: AccountService) {
    this.checkScreenSize();
  }

  ngOnInit(): void {
    this.checkScreenSize();

    // Listen for window resize events
    window.addEventListener('resize', () => {
      this.checkScreenSize();
    });
  }

  @HostListener('window:resize')
  onResize() {
    this.checkScreenSize();
  }

  checkScreenSize() {
    const isMobileView = window.innerWidth <= 768;
    this.isMobile = isMobileView;
    // Auto-expand on mobile
    this.isSidebarCollapsed = isMobileView;
  }

  toggleSidebar(): void {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
}
