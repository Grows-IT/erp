import { Component, OnInit, Inject } from '@angular/core';
import { InvoiceService } from '../invoice.service';
import { Invoice, Customer } from '../invoice.model';
import { Item } from 'src/app/sales/sales.model';
import { ActivatedRoute } from '@angular/router';
// import { InvoiceDialogComponent } from '../invoice-dialog/invoice-dialog.component';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormGroup, FormArray, FormControl, Validators, FormBuilder } from '@angular/forms';
import { TOUCH_BUFFER_MS } from '@angular/cdk/a11y';

@Component({
  selector: 'app-invoice-detail',
  templateUrl: './invoice-detail.component.html',
  styleUrls: ['./invoice-detail.component.scss']
})
export class InvoiceDetailComponent implements OnInit {
  expandedElement;
  invoiceCol: string[] = ['item', 'quantity', 'price'];
  mainInvoices: any;
  subInvoice: any = [];
  addForm: FormGroup;
  rows: FormArray;
  isShowing: boolean;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<InvoiceDetailComponent>, private invoiceService: InvoiceService, private activatedRoute: ActivatedRoute, private fb: FormBuilder) {
    this.addForm = this.fb.group({
      items: [null, Validators.required],
      items_value: ['no', Validators.required]
    });
    this.rows = this.fb.array([]);
    this.isShowing = false;
  }

  ngOnInit() {
    console.log(this.data);

    // const id = this.activatedRoute.snapshot.paramMap.get('id');

    const id = this.data;

    this.addForm.addControl('rows', this.rows);
    this.invoiceService.getSubInvioce(id).subscribe((res) => {
      console.log(res);

      if (res.subInvoices !== null && res.subInvoices !== undefined) {
        Object.keys(res.subInvoices).map(key => {
          this.subInvoice.push(res.subInvoices[key]);
        });
      }
      console.log(this.subInvoice);
      this.mainInvoices = res;
    });
  }

  toggleShoing() {
    this.isShowing = !this.isShowing;
    this.rows.clear();
  }

  openPdf(id) {

  }

  onAddRow() {
    this.rows.push(this.createItemFormGroup());
  }

  onRemoveRow(rowIndex: number) {
    this.rows.removeAt(rowIndex);
  }

  createItemFormGroup(): FormGroup {
    return this.fb.group({
      name: new FormControl(null, [Validators.required]),
      quantity: new FormControl(null, [Validators.required]),
      price: new FormControl(null, [Validators.required])
    });
  }

  onConfirmClick() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');

    if (this.mainInvoices.subInvoices === undefined || this.mainInvoices.subInvoices === null) {
      this.invoiceService.addSubInvoice(this.rows.value, id).subscribe();
    } else {
      this.invoiceService.addSubInvoice(this.rows.value, id).subscribe(() => {
        this.subInvoice.push(this.rows.value);
        this.toggleShoing();
        this.rows.clear();
      });
    }
  }
}
