import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SalesComponent } from './sales/sales.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './home/home.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatButtonModule } from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatTableModule} from '@angular/material/table';
import {MatSortModule} from '@angular/material/sort';
import { PricelistComponent } from './pricelist/pricelist.component';
import { ItemspriceComponent } from './pricelist/itemsprice/itemsprice.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { SigninComponent } from './signin/signin.component';
import {FormsModule} from '@angular/forms';
import { InvoiceComponent } from './invoice/invoice.component';


const materialComponent = [
  MatGridListModule,
  MatButtonModule,
  MatCardModule,
  MatFormFieldModule,
  MatTableModule,
  MatSortModule,
  Ng2SearchPipeModule,
  FormsModule
];

@NgModule({
  declarations: [
    AppComponent,
    SalesComponent,
    HomeComponent,
    PricelistComponent,
    ItemspriceComponent,
    SigninComponent,
    InvoiceComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    materialComponent
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
