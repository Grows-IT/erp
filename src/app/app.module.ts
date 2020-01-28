import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { AppRoutingModule } from "./app-routing.module";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { Ng2SearchPipeModule } from "ng2-search-filter";
import { AngularFireModule } from "@angular/fire";
import { AngularFireDatabaseModule } from "@angular/fire/database";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatToolbarModule } from "@angular/material/toolbar";
import {
  MatDialogModule,
  MatGridListModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatFormFieldModule,
  MatInputModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatListModule,
  MatCardModule,
  MatTableDataSource,
  MatSort,
  MatTableModule,
  MatSortModule,
  MatIconModule,
  MatMenuModule,
  MatExpansionModule,
  MatProgressSpinnerModule,
  MatCheckboxModule,
  MatAutocompleteModule
} from "@angular/material";

import { AppComponent } from "./app.component";
import { SalesComponent } from "./sales/sales.component";
import { HomeComponent } from "./home/home.component";
import { QuotationFormComponent } from "./sales/quotation-form/quotation-form.component";
import { QuotationDialogComponent } from "./sales/quotation-dialog/quotation-dialog.component";
import { PricelistComponent } from "./pricelist/pricelist.component";
import { ItemspriceComponent } from "./pricelist/itemsprice/itemsprice.component";
import { SigninComponent } from "./signin/signin.component";
import { InvoiceComponent } from "./invoice/invoice.component";

import { environment } from "src/environments/environment";
import { CutStringPipe } from "./cut-string.pipe";
import { InvoiceDetailComponent } from "./invoice/invoice-detail/invoice-detail.component";
import { RouterModule } from "@angular/router";

import { QuotationdetailComponent } from "./sales/quotationdetail/quotationdetail.component";
import { InvoicegroupComponent } from "./invoice/invoicegroup/invoicegroup.component";
import { CustomerComponent } from "./customer/customer.component";
import { CustomerdialogComponent } from "./customer/customerdialog/customerdialog.component";
import { FlowerplantComponent } from './flowerplant/flowerplant.component';
import { FlowerplantdialogComponent } from './flowerplant/flowerplantdialog/flowerplantdialog.component';
import { UsersmanagementComponent } from './usersmanagement/usersmanagement.component';
import { UserdialogComponent } from './usersmanagement/userdialog/userdialog.component';

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
  FormsModule,
  MatIconModule,
  MatMenuModule,
  MatExpansionModule,
  MatProgressSpinnerModule,
  MatCheckboxModule,
  MatProgressSpinnerModule,
  RouterModule,
  MatToolbarModule,
  MatSlideToggleModule,
  MatAutocompleteModule
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
    CutStringPipe,
    InvoiceDetailComponent,
    QuotationdetailComponent,
    InvoicegroupComponent,
    CustomerComponent,
    CustomerdialogComponent,
    FlowerplantComponent,
    FlowerplantdialogComponent,
    UsersmanagementComponent,
    UserdialogComponent
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
  providers: [MatNativeDateModule],
  bootstrap: [AppComponent],
  entryComponents: [QuotationDialogComponent, CustomerdialogComponent, FlowerplantdialogComponent, UserdialogComponent]
})
export class AppModule {}
