import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SalesComponent } from './sales/sales.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './home/home.component';
import { QuotationDialogComponent } from './sales/quotation-dialog/quotation-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { QuotationFormComponent } from './sales/quotation-form/quotation-form.component';
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';

import {
  MatDialogModule, MatGridListModule, MatButtonModule, MatButtonToggleModule, MatFormFieldModule, MatInputModule,
  MatDatepickerModule, MatNativeDateModule, MatListModule, MatCardModule, MatTableDataSource, MatSort
} from '@angular/material';
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
];

@NgModule({
  declarations: [
    AppComponent,
    SalesComponent,
    HomeComponent,
    QuotationDialogComponent,
    QuotationFormComponent,
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
