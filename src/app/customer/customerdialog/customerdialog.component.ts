import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { Subscription } from 'rxjs';
import { CustomerService } from '../customer.service';
import { Customer } from '../customer.model';


@Component({
  selector: 'app-customerdialog',
  templateUrl: './customerdialog.component.html',
  styleUrls: ['./customerdialog.component.scss']
})
export class CustomerdialogComponent implements OnInit {
  customerSubscription: Subscription;
  customers: Customer[];

  constructor(public dialogRef: MatDialogRef<CustomerdialogComponent>, private cService: CustomerService) { }

  ngOnInit() {
    this.customerSubscription = this.cService.customers.subscribe(customers => {
      this.customers = customers;
    });
    this.cService.getAllCustomer().subscribe();
  }

  close(): void {
    this.dialogRef.close();
  }

  onConfirmClick(status) {

    // if (status === 0) {
    //   console.log(this.customers.values);
    //   this.cService.addQuotation(this.quotation.value).pipe(
    //     switchMap(() => this.salesService.getQuotation())
    //   ).subscribe();
    // } else if (status === 1) {
    //   this.salesService.updateQuotation(this.quotation.value, this.data.id, findCus.id).pipe(
    //     switchMap(() => this.salesService.getQuotation())
    //   ).subscribe();
    //   console.log(this.quotation.value);
    // }
    this.dialogRef.close();
  }

}
