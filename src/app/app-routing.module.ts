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

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
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
      path: ':id',
      component: InvoiceDetailComponent,
    }]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
