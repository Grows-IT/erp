import { Component, OnInit, Inject } from '@angular/core';
import { Invoice, InvoiceGroup } from '../invoice.model';
import { InvoiceService } from '../invoice.service';
import { MAT_DIALOG_DATA } from '@angular/material';
import { MatDialog } from '@angular/material';
import { Subscription } from 'rxjs';
import { CustomerService } from 'src/app/customer/customer.service';
import { Customer } from 'src/app/customer/customer.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { InvoiceDetailComponent } from '../invoice-detail/invoice-detail.component';
import { SharedService } from 'src/app/shared/shared.service';

@Component({
  selector: 'app-invoicegroup',
  templateUrl: './invoicegroup.component.html',
  styleUrls: ['./invoicegroup.component.scss']
})
export class InvoicegroupComponent implements OnInit {
  invoice: Invoice;
  invoiceSubscription: Subscription;
  customerSubscription: Subscription;
  customers: Customer[];
  addGroup: FormGroup;
  listGroupName: any;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private invoiceService: InvoiceService, private cService: CustomerService,
    public dialog: MatDialog, private sharedService: SharedService) {
    this.addGroup = new FormGroup({
      name: new FormControl(null, [Validators.required]),
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
      this.invoice = invoices.find(i => i.id === this.data);
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

  onClickOpenDetail(invoice, index) {
    const dialogRef = this.dialog.open(InvoiceDetailComponent, {
      panelClass: 'nopadding-dialog',
      width: '60vw',
      height: '70vh',
      disableClose: true,
      autoFocus: false,
      data: { invoice, index }
    });
  }

  addGroupName(groupName) {
    this.invoice.group.push(new InvoiceGroup(groupName.value.name, []));
    this.invoiceService.updateInvoice(this.invoice).subscribe();
  }

  decode(id, count) {
    return this.sharedService.decode(id, count, false);
  }
}
