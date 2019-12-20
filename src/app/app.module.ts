import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import {
  MatDialogModule, MatGridListModule, MatButtonModule, MatButtonToggleModule, MatFormFieldModule, MatInputModule,
  MatDatepickerModule, MatNativeDateModule, MatListModule, MatCardModule, MatTableDataSource, MatSort, MatTableModule, MatSortModule
} from '@angular/material';

import { AppComponent } from './app.component';
import { SalesComponent } from './sales/sales.component';
import { HomeComponent } from './home/home.component';
import { QuotationFormComponent } from './sales/quotation-form/quotation-form.component';
import { QuotationDialogComponent } from './sales/quotation-dialog/quotation-dialog.component';
import { PricelistComponent } from './pricelist/pricelist.component';
import { ItemspriceComponent } from './pricelist/itemsprice/itemsprice.component';
import { SigninComponent } from './signin/signin.component';
import { InvoiceComponent } from './invoice/invoice.component';

import { environment } from 'src/environments/environment';

const materialComponent = [
  MatGridListModule,
  MatButtonModule,
  MatDialogModule,
  MatButtonToggleModule,
  MatFormFieldModule,
  MatInputModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatListModule,
  MatCardModule,
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
    QuotationDialogComponent,
    QuotationFormComponent,
    PricelistComponent,
    ItemspriceComponent,
    SigninComponent,
    InvoiceComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    materialComponent,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AngularFireDatabaseModule,
    AngularFireModule.initializeApp(environment.firebase)
  ],
  providers: [
    MatNativeDateModule
  ],
  bootstrap: [AppComponent],
  entryComponents: [QuotationDialogComponent],

})
export class AppModule { }
