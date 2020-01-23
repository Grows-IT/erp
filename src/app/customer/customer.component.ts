import { Component, OnInit } from '@angular/core';
import { CustomerService } from './customer.service';
import { Customer } from './customer.model';
import { switchMap } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { CustomerdialogComponent } from './customerdialog/customerdialog.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})
export class CustomerComponent implements OnInit {

  quotationCol: string[] = ['no', 'customerName', 'address', 'edit', 'delete'];
  customerSubscription: Subscription;
  customers: Customer[];

  constructor(public dialog: MatDialog, private cService: CustomerService) { }

  ngOnInit() {

    this.customerSubscription = this.cService.customers.subscribe(customers => {
      this.customers = customers;
    });
    this.cService.getAllCustomer().subscribe();
  }
  // getCustomer(customerId: string) {
  //   const customer = this.customers.find(cus => cus.id === customerId);
  //   if (!customer) {
  //     return null;
  //   }
  //   return customer;
  // }
  openCustomer() {
    const dialogRef = this.dialog.open(CustomerdialogComponent, {
      panelClass: 'nopadding-dialog',
      width: '40vw',
      height: '70vh',
      disableClose: false,
      autoFocus: false,
    });

    // dialogRef.afterClosed().pipe(
    //   switchMap(() => this.salesService.getQuotation()),
    //   switchMap(() => this.cService.getAllCustomer()),
    // ).subscribe();
  }

  editCustomer(Customer) {
    const dialogRef = this.dialog.open(CustomerdialogComponent, {
      panelClass: 'nopadding-dialog',
      width: '40vw',
      height: '70vh',
      disableClose: false,
      autoFocus: false,
      data: Customer
    });

    // dialogRef.afterClosed().pipe(
    //   switchMap(() => this.salesService.getQuotation()),
    //   switchMap(() => this.cService.getAllCustomer()),
    // ).subscribe();
  }

  delete(id: string) {
    this.cService.deleteCustomer(id).pipe(
      // switchMap(() => this.cService.getCustomer())
    ).subscribe();
  }


}
