import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder } from '@angular/forms';
import { SalesService } from '../sales.service';
import { QuotationDialogComponent } from '../quotation-dialog/quotation-dialog.component';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-quotation-form',
  templateUrl: './quotation-form.component.html',
  styleUrls: ['./quotation-form.component.scss']
})
export class QuotationFormComponent implements OnInit {
  data: any;
  quotation: FormGroup;
  // rows: FormArray;

  // quotation = new FormGroup({
  //   customerName: new FormControl('', [
  //     Validators.required
  //   ]),
  //   by: new FormControl('', [
  //     Validators.required
  //   ]),
  //   addressTo: new FormControl('', [
  //     Validators.required
  //   ]),
  //   date: new FormControl('', [
  //     Validators.required,
  //   ]),
  //   expirationDate: new FormControl('', [
  //     Validators.required,
  //   ]),
  //   item: new FormControl('', [
  //     Validators.required,
  //   ]),
  //   quantity: new FormControl('', [
  //     Validators.required,
  //   ]),
  // });

  constructor(private salesService: SalesService, private dialogRef: MatDialogRef<QuotationDialogComponent>, private fb: FormBuilder) {
    // this.rows = this.fb.array([]);
  }

  ngOnInit() {
    this.quotation = this.fb.group({
      customerName: ['', [Validators.required]],
      // by: ['', [Validators.required]],
      addressTo: ['', [Validators.required]],
      date: ['', [Validators.required]],
      expirationDate: ['', [Validators.required]],
      allItem: this.fb.array([
        this.createItemFormGroup()
      ])
    });


  }

  private createItemFormGroup() {
    return this.fb.group({
      item: ['', [Validators.required]],
      quantity: ['', [Validators.required]],
    });
  }

  // this.data = this.dialogRef.componentInstance.data;

  //   if (this.data !== null && this.data !== undefined) {
  //     this.quotation = new FormGroup({
  //       customerName: new FormControl(this.data.customerName, [
  //         Validators.required
  //       ]),
  //       by: new FormControl(this.data.by, [
  //         Validators.required
  //       ]),
  //       addressTo: new FormControl(this.data.addressTo, [
  //         Validators.required
  //       ]),
  //       date: new FormControl(this.data.date, [
  //         Validators.required,
  //       ]),
  //       expirationDate: new FormControl(this.data.expirationDate, [
  //         Validators.required,
  //       ]),
  //       // item: new FormControl(this.data.items[0].name, [
  //       //   Validators.required,
  //       // ]),
  //       // quantity: new FormControl(this.data.items[0].quantity, [
  //       //   Validators.required,
  //       // ])
  //       item: new FormControl(
  //         this.createItemFormGroup()
  //       )
  //     });
  //   }
  // }
  close(): void {
    this.dialogRef.close();
  }

  onAddRow() {
    // this.rows.push(this.createItemFormGroup());
    const control = <FormArray>this.quotation.controls['allItem'];
    control.push(this.createItemFormGroup());
  }

  removeUnit(i: number) {
    const control = <FormArray>this.quotation.controls['allItem'];
    control.removeAt(i);
  }

  onConfirmClick(status) {
    // console.log(this.quotation.value);
    if (status === 0) {
      console.log(this.quotation.value);

      this.salesService.addQuotation(this.quotation.value);
    } else if (status === 1) {
      this.salesService.updateQuotation(this.quotation.value, this.data.id).subscribe();
    }
    this.dialogRef.close(true);
  }
}
