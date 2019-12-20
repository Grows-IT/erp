import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { SalesComponent } from './sales/sales.component';
import { PricelistComponent } from './pricelist/pricelist.component';
import { ItemspriceComponent } from './pricelist/itemsprice/itemsprice.component';
import { SigninComponent } from './signin/signin.component';
import { InvoiceComponent } from './invoice/invoice.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'sales',
    children: [{
      path: '',
      component: SalesComponent
    }]
  },
  {
    path: 'pricelist',
    component: PricelistComponent
  },
  {
    path: 'itemsprice',
    component: ItemspriceComponent
  },
  {
    path: 'signin',
    component: SigninComponent
  },
  {
    path: 'invoice',
    component: InvoiceComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
