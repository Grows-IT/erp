import { Component, OnInit, Inject } from '@angular/core';
import { Invoice } from '../invoice.model';
import { InvoiceService } from '../invoice.service';
import { MAT_DIALOG_DATA } from '@angular/material';
import { MatDialog } from '@angular/material';
import { Subscription } from 'rxjs';
import { CustomerService } from 'src/app/customer/customer.service';
import { Customer } from 'src/app/customer/customer.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { InvoiceDetailComponent } from '../invoice-detail/invoice-detail.component';

@Component({
  selector: 'app-invoicegroup',
  templateUrl: './invoicegroup.component.html',
  styleUrls: ['./invoicegroup.component.scss']
})
export class InvoicegroupComponent implements OnInit {
  invoices: Invoice;
  invoiceSubscription: Subscription;
  customerSubscription: Subscription;
  customers: Customer[];
  addGroup: FormGroup;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private invoiceService: InvoiceService, private cService: CustomerService, public dialog: MatDialog) {
    this.addGroup = new FormGroup({
      groupName: new FormControl(null, [Validators.required]),
    });
  }

  ngOnInit() {
    this.customerSubscription = this.cService.customers.subscribe(customers => {
      this.customers = customers;
    });

    this.invoiceSubscription = this.invoiceService.invoices.subscribe(invoices => {
      if (!invoices === null) {
        return;
      }
      this.invoices = invoices.find(i => i.id === this.data);
    });

    this.invoiceService.getAllInvoice().subscribe();
    this.cService.getAllCustomer().subscribe();
  }

  getCustomer(customerId: string) {
    const customer = this.customers.find(cus => cus.id === customerId);
    if (!customer) {
      return null;
    }
    return customer;
  }

  onClickadd() {

  }

  onClickopendetail(id) {
    const dialogRef = this.dialog.open(InvoiceDetailComponent, {
      panelClass: 'nopadding-dialog',
      width: '60vw',
      height: '70vh',
      disableClose: true,
      autoFocus: false,
      data: id
    });
  }

  addGroupName(val) {
    console.log(val);
    return this.http.post()
  }
}
