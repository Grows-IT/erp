import { Component, OnInit, Inject } from '@angular/core';
import { InvoiceService } from '../invoice.service';
import { MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormArray, FormControl, Validators, FormBuilder } from '@angular/forms';

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
  // this.data is id
  id = this.data;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private invoiceService: InvoiceService, private fb: FormBuilder) {
    this.addForm = new FormGroup({
      groupName: new FormControl(null, [Validators.required])
    });
    this.rows = this.fb.array([]);
    this.isShowing = false;
  }

  ngOnInit() {
    this.addForm.addControl('rows', this.rows);
    this.invoiceService.getSubInvioce(this.id).subscribe((res) => {
      // console.log(res);

      if (res.subInvoices !== null && res.subInvoices !== undefined) {
        Object.keys(res.subInvoices).map(key => {
          this.subInvoice.push(res.subInvoices[key]);
        });
      }
      // console.log(this.subInvoice);
      this.mainInvoices = res;
    });
  }

  toggleShoing() {
    this.addForm.reset();
    this.rows.clear();
    this.isShowing = !this.isShowing;
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
    return new FormGroup({
      name: new FormControl(null, [Validators.required]),
      quantity: new FormControl(null, [Validators.required]),
      price: new FormControl(null, [Validators.required])
    });
  }

  onConfirmClick() {
    if (!this.rows.dirty) {
      return;
    }

    const data = {
      groupName: this.addForm.value.groupName,
      row: this.rows.value
    };

    this.invoiceService.addSubInvoice(data, this.id).subscribe();
    this.subInvoice.push(data);
    this.toggleShoing();
  }
}
