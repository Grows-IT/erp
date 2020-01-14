import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder } from '@angular/forms';
import { SalesService } from '../sales.service';
import { QuotationDialogComponent } from '../quotation-dialog/quotation-dialog.component';
import { MatDialogRef } from '@angular/material';
import { CustomerService } from 'src/app/customer/customer.service';
import { Subscription } from 'rxjs';
import { Customer } from 'src/app/customer/customer.model';
import { tap, map } from 'rxjs/operators';

@Component({
  selector: 'app-quotation-form',
  templateUrl: './quotation-form.component.html',
  styleUrls: ['./quotation-form.component.scss']
})
export class QuotationFormComponent implements OnInit {
  customerSubscription: Subscription;
  customers: Customer[];
  data: any;
  quotation: FormGroup;

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

  constructor(private salesService: SalesService, private dialogRef: MatDialogRef<QuotationDialogComponent>, private fb: FormBuilder, private cService: CustomerService) {
  }

  ngOnInit() {
    this.customerSubscription = this.cService.customers.subscribe(customers => {
      this.customers = customers;
    });
    this.cService.getAllCustomer().subscribe();

    this.data = this.dialogRef.componentInstance.data;
    if (this.data !== null && this.data !== undefined) {
    this.quotation = this.fb.group({
      customerName: [this.getCustomerName(this.data.customerId).name, [Validators.required]],
      // by: ['', [Validators.required]],
      addressTo: [this.getCustomerName(this.data.customerId).address, [Validators.required]],
      date: [this.data.date, [Validators.required]],
      expirationDate: [this.data.expirationDate, [Validators.required]],
      allItem: this.fb.array([
        // this.createItemFormGroup()
      ])
    });
    for (let a = 0; a < this.data.items.length; a++) {
    const control = <FormArray>this.quotation.controls['allItem'];
    control.push(this.viewItemFormGroup(a));
  }


  } else {
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
  }

  getCustomerName(customerId: string) {
    const customer = this.customers.find(cus => cus.id === customerId);
    if (!customer) {
      return null;
    }
    return customer;
  }

  private viewItemFormGroup(a) {
    this.data = this.dialogRef.componentInstance.data;
    // if (this.data !== null && this.data !== undefined) {
    return this.fb.group({
        item: [this.data.items[a].item, [Validators.required]],
        quantity: [this.data.items[a].quantity, [Validators.required]],
      });

    // } else {
    //   return this.fb.group({
    //   item: ['', [Validators.required]],
    //   quantity: ['', [Validators.required]],
    // });
    // }
  }

  private createItemFormGroup(){
    return this.fb.group({
      item: ['', [Validators.required]],
      quantity: ['', [Validators.required]],
    });
  }

  // this.data = this.dialogRef.componentInstance.data;

    // if (this.data !== null && this.data !== undefined) {
    //   this.quotation = new FormGroup({
    //     customerName: new FormControl(this.data.customerName, [
    //       Validators.required
    //     ]),
    //     by: new FormControl(this.data.by, [
    //       Validators.required
    //     ]),
    //     addressTo: new FormControl(this.data.addressTo, [
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
      const control = <FormArray>this.quotation.controls['allItem'];
      control.push(this.createItemFormGroup());
  }

  removeUnit(i: number) {
    const control = <FormArray>this.quotation.controls['allItem'];
    control.removeAt(i);
  }

  onConfirmClick(status) {
    if (status === 0) {
      console.log(this.quotation.value);
      this.salesService.addQuotation(this.quotation.value);
    } else if (status === 1) {
      this.salesService.updateQuotation(this.quotation.value, this.data.id).subscribe();
      console.log(this.quotation.value);

    }
  }
}
