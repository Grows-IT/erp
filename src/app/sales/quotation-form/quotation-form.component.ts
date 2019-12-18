import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SalesService } from '../sales.service';
import { QuotationDialogComponent } from '../quotation-dialog/quotation-dialog.component';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-quotation-form',
  templateUrl: './quotation-form.component.html',
  styleUrls: ['./quotation-form.component.scss']
})
export class QuotationFormComponent implements OnInit {
  quotation = new FormGroup({
    addressTo: new FormControl('', [
      Validators.required
    ]),
    date: new FormControl('', [
      Validators.required,
    ]),
    expriationDate: new FormControl('', [
      Validators.required,
    ]),
    type: new FormControl('', [
      Validators.required,
    ]),
    quantity: new FormControl('', [
      Validators.required,
    ]),
  });

  constructor(private salesService: SalesService, private dialogRef: MatDialogRef<QuotationDialogComponent>) { }

  ngOnInit() {

  }

  onConfirmClick() {
    this.salesService.submitQuotation(this.quotation.value).subscribe();
    this.dialogRef.close(true);
  }
}
