import { RouterModule, Routes } from '@angular/router';

import { NgModule } from '@angular/core';
import { CategoryComponent } from './components/admin/category/category.component';
import { DashboardComponent } from './components/admin/dashboard/dashboard.component';
import { ExchangeRateComponent } from './components/admin/exchange-rate/exchange-rate.component';
import { ProductComponent } from './components/admin/product/product.component';
import { UserComponent } from './components/admin/user/user.component';
import { CartComponent } from './components/landing/cart/cart.component';
import { CheckoutComponent } from './components/landing/checkout/checkout.component';
import { HomeComponent } from './components/landing/home/home.component';
import { LoginComponent } from './components/landing/login/login.component';
import { RoleComponent } from './components/admin/role/role.component';
import { SaleListComponent } from './components/admin/sale-list/sale-list.component';
import { SaleReportComponent } from './components/admin/sale-report/sale-report.component';
import { ClockoutComponent } from './components/landing/clockout/clockout.component';
import { InvoiceComponent } from './components/features/invoice/invoice.component';
import { SaleSucceedComponent } from './components/features/sale-succeed/sale-succeed.component';
import { AuthGuard } from './components/core/guard/auth.guard';
import { LoginGuard } from './components/core/login-guard/login.guard';


export const routes: Routes = [
  { path: 'login', component: LoginComponent,},
  { path: 'product', component: ProductComponent, canActivate: [AuthGuard], data: { expectedRole: 'Admin' } },
  { path: 'category', component: CategoryComponent, canActivate: [AuthGuard], data: { expectedRole: 'Admin' } },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard], data: { expectedRole: 'Admin' }  },
  { path: 'user', component: UserComponent, canActivate: [AuthGuard], data: { expectedRole: 'Admin' }  },
  { path: 'role', component: RoleComponent, canActivate: [AuthGuard], data: { expectedRole: 'Admin' }  },
  { path: 'exchange', component: ExchangeRateComponent, canActivate: [AuthGuard], data: { expectedRole: 'Admin' }  },
  { path: 'home', component: HomeComponent, title: 'Home', canActivate: [AuthGuard], data: { expectedRole: 'User' }  },
  { path: 'cart', component: CartComponent, canActivate: [AuthGuard], data: { expectedRole: 'User' }  },
  { path: 'checkout', component: CheckoutComponent, canActivate: [AuthGuard], data: { expectedRole: 'User' }  },
  { path: 'saleList', component: SaleListComponent, canActivate: [AuthGuard], data: { expectedRole: 'Admin' }  },
  { path: 'saleReport', component: SaleReportComponent, canActivate: [AuthGuard], data: { expectedRole: 'Admin' }  },
  {path: 'clockout',component: ClockoutComponent, canActivate: [AuthGuard], data: { expectedRole: 'User' } },
  {path: 'invoice',component: InvoiceComponent, canActivate: [AuthGuard], data: { expectedRole: 'User && Admin' } },
  {path: 'saleSucceed',component: SaleSucceedComponent, canActivate: [AuthGuard], data: { expectedRole: 'User' } }
];
