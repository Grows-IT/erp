import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatToolbarModule } from '@angular/material/toolbar';
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
  MatAutocompleteModule,
  MatSelectModule,
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
import { InvoiceDetailComponent } from './invoice/invoice-detail/invoice-detail.component';
import { RouterModule } from '@angular/router';

import { QuotationdetailComponent } from './sales/quotationdetail/quotationdetail.component';
import { InvoicegroupComponent } from './invoice/invoicegroup/invoicegroup.component';
import { CustomerComponent } from './customer/customer.component';
import { CustomerdialogComponent } from './customer/customerdialog/customerdialog.component';
import { FlowerplantComponent } from './flowerplant/flowerplant.component';
import { FlowerplantdialogComponent } from './flowerplant/flowerplantdialog/flowerplantdialog.component';
import { UsersmanagementComponent } from './usersmanagement/usersmanagement.component';
import { UserdialogComponent } from './usersmanagement/userdialog/userdialog.component';
import { ChangeNameDialogComponent } from './invoice/change-name-dialog/change-name-dialog.component';
import { ConfirmDialogComponent } from './shared/confirm-dialog/confirm-dialog.component';
import { EmployeeComponent } from './employee/employee.component';
import { EmployeeprofileComponent } from './employee/employeeprofile/employeeprofile.component';
import { EmployeedialogComponent } from './employee/employeedialog/employeedialog.component';
import { DepartmentmanagementComponent } from './departmentmanagement/departmentmanagement.component';
import { DepartmentdialogComponent } from './departmentmanagement/departmentdialog/departmentdialog.component';
import { InventoryComponent } from './inventory/inventory.component';
import { InventoryDialogComponent } from './inventory/inventory-dialog/inventory-dialog.component';
import { SuppliersComponent } from './suppliers/suppliers.component';
import { SuppliersdialogComponent } from './suppliers/suppliersdialog/suppliersdialog.component';
import { PurchaseComponent } from './purchase/purchase.component';
import { PurchaseReComponent } from './purchase-re/purchase-re.component';
import { PurchaseRedialogComponent } from './purchase-re/purchase-redialog/purchase-redialog.component';
import { PurchaseRenextdialogComponent } from './purchase-re/purchase-renextdialog/purchase-renextdialog.component';
import { SupplieritemsComponent } from './suppliers/supplieritems/supplieritems.component';
import { SupplieritemsdialogComponent } from './suppliers/supplieritems/supplieritemsdialog/supplieritemsdialog.component';
import { PurchaseOrComponent } from './purchase-or/purchase-or.component';

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
  MatAutocompleteModule,
  MatSelectModule
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
    InvoiceDetailComponent,
    QuotationdetailComponent,
    InvoicegroupComponent,
    CustomerComponent,
    CustomerdialogComponent,
    FlowerplantComponent,
    FlowerplantdialogComponent,
    UsersmanagementComponent,
    UserdialogComponent,
    ChangeNameDialogComponent,
    ConfirmDialogComponent,
    EmployeeComponent,
    EmployeeprofileComponent,
    EmployeedialogComponent,
    DepartmentmanagementComponent,
    DepartmentdialogComponent,
    InventoryComponent,
    InventoryDialogComponent,
    SuppliersComponent,
    SuppliersdialogComponent,
    PurchaseComponent,
    PurchaseReComponent,
    PurchaseRedialogComponent,
    PurchaseRenextdialogComponent,
    SupplieritemsComponent,
    SupplieritemsdialogComponent,
    PurchaseOrComponent,
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
  entryComponents: [
    QuotationDialogComponent,
    CustomerdialogComponent,
    FlowerplantdialogComponent,
    UserdialogComponent,
    ChangeNameDialogComponent,
    ConfirmDialogComponent,
    EmployeeprofileComponent,
    EmployeedialogComponent,
    DepartmentdialogComponent,
    InventoryDialogComponent,
    SuppliersdialogComponent,
    PurchaseRedialogComponent,
    PurchaseRenextdialogComponent,
    SupplieritemsComponent,
    SupplieritemsdialogComponent
  ]
})
export class AppModule { }
