import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder } from '@angular/forms';
import { SalesService } from '../sales.service';
import { QuotationDialogComponent } from '../quotation-dialog/quotation-dialog.component';
import { MatDialogRef } from '@angular/material';
import { element } from 'protractor';

@Component({
  selector: 'app-quotation-form',
  templateUrl: './quotation-form.component.html',
  styleUrls: ['./quotation-form.component.scss']
})
export class QuotationFormComponent implements OnInit {
  data: any;

  quotation = new FormGroup({
    customerName: new FormControl('', [
      Validators.required
    ]),
    by: new FormControl('', [
      Validators.required
    ]),
    addressTo: new FormControl('', [
      Validators.required
    ]),
    date: new FormControl('', [
      Validators.required,
    ]),
    expirationDate: new FormControl('', [
      Validators.required,
    ]),
    item: new FormControl('', [
      Validators.required,
    ]),
    quantity: new FormControl('', [
      Validators.required,
    ]),
  });

  constructor(private salesService: SalesService, private dialogRef: MatDialogRef<QuotationDialogComponent>) { }

  ngOnInit() {
    this.data = this.dialogRef.componentInstance.data;

    if (this.data !== null && this.data !== undefined) {
      this.quotation = new FormGroup({
        customerName: new FormControl(this.data.customerName, [
          Validators.required
        ]),
        by: new FormControl(this.data.by, [
          Validators.required
        ]),
        addressTo: new FormControl(this.data.addressTo, [
          Validators.required
        ]),
        date: new FormControl(this.data.date, [
          Validators.required,
        ]),
        expirationDate: new FormControl(this.data.expirationDate, [
          Validators.required,
        ]),
        item: new FormControl(this.data.items[0].name, [
          Validators.required,
        ]),
        quantity: new FormControl(this.data.items[0].quantity, [
          Validators.required,
        ]),
      });
    }
  }
  close(): void {
    this.dialogRef.close();
  }


  onConfirmClick(status) {
    console.log(this.quotation.value);
    if (status === 0) {
      this.salesService.addQuotation(this.quotation.value).subscribe();
    } else if (status === 1) {
      this.salesService.updateQuotation(this.quotation.value, this.data.id).subscribe();
    }
    this.dialogRef.close(true);
  }
}
