import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { SalesComponent } from './sales/sales.component';
import { PricelistComponent } from './pricelist/pricelist.component';
import { ItemspriceComponent } from './pricelist/itemsprice/itemsprice.component';
import { SigninComponent } from './signin/signin.component';
import { InvoiceComponent } from './invoice/invoice.component';
import { SigninGuard } from './signin/signin.guard';
import { InvoiceDetailComponent } from './invoice/invoice-detail/invoice-detail.component';
import { QuotationdetailComponent } from './sales/quotationdetail/quotationdetail.component';
import { InvoicegroupComponent } from './invoice/invoicegroup/invoicegroup.component';
import { CustomerComponent } from './customer/customer.component';
import { FlowerplantComponent } from './flowerplant/flowerplant.component';
import { UsersmanagementComponent } from './usersmanagement/usersmanagement.component';
import { EmployeeComponent } from './employee/employee.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [SigninGuard],
  },
  {
    path: 'flowerplant',
    component: FlowerplantComponent,
    canActivate: [SigninGuard],
  },
  {
    path: 'employee',
    component: EmployeeComponent,
    canActivate: [SigninGuard],
  },
  {
    path: 'usersmanagement',
    component: UsersmanagementComponent,
    canActivate: [SigninGuard],
  },
  {
    path: 'customers',
    component: CustomerComponent,
    canActivate: [SigninGuard],
  },
  {
    path: 'sales',
    children: [{
      path: '',
      component: SalesComponent,
      canActivate: [SigninGuard],
    }]
  },
  {
    path: 'pricelist',
    component: PricelistComponent,
    canActivate: [SigninGuard],
  },
  {
    path: 'itemsprice',
    component: ItemspriceComponent,
    canActivate: [SigninGuard],
  },
  {
    path: 'signin',
    component: SigninComponent
  },
  {
    path: 'invoice',
    children: [{
      path: '',
      component: InvoiceComponent,
      canActivate: [SigninGuard],
    }, {
      path: 'invoicegroup/:id',
      component: InvoiceDetailComponent,
    }]
  },
  {
    path: 'quotationdetail/:id',
    component: QuotationdetailComponent,
    // canActivate: [SigninGuard],
  },
  {
    path: ':id',
    component: InvoicegroupComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
