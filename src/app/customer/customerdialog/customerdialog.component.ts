import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Subscription } from 'rxjs';
import { CustomerService } from '../customer.service';
import { Customer } from '../customer.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { switchMap } from 'rxjs/operators';


@Component({
  selector: 'app-customerdialog',
  templateUrl: './customerdialog.component.html',
  styleUrls: ['./customerdialog.component.scss']
})
export class CustomerdialogComponent implements OnInit {
  customerSubscription: Subscription;
  customers: Customer[];
  customer: FormGroup;
  // data: any;

  // tslint:disable-next-line: max-line-length
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder, public dialogRef: MatDialogRef<CustomerdialogComponent>, private cService: CustomerService) { }

  ngOnInit() {
    this.customerSubscription = this.cService.customers.subscribe(customers => {
      this.customers = customers;
    });
    this.cService.getAllCustomer().subscribe();


    // this.data = this.dialogRef.componentInstance.data;

    if (this.data !== null && this.data !== undefined) {
      this.customer = this.fb.group({
        customerName: [this.data.name, [Validators.required]],
        addressTo: [this.data.address, [Validators.required]]
      });
    } else {

      this.customer = this.fb.group({
        customerName: ['', [Validators.required]],
        addressTo: ['', [Validators.required]]
      });
    }
  }

  close(): void {
    this.dialogRef.close();
  }

  onConfirmClick(status) {
    if (status === 0) {
      this.cService.addCustomer(this.customer.value).pipe(
        switchMap(() => this.cService.getAllCustomer())
      ).subscribe();
    } else if (status === 1) {
      this.cService.updateCustomer(this.customer.value, this.data.id).pipe(
        switchMap(() => this.cService.getAllCustomer())
      ).subscribe();
    }
    this.dialogRef.close();
  }
}
