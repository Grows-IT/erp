import { Component, OnInit, Inject } from '@angular/core';
import { Invoice, InvoiceGroup, Group } from '../invoice.model';
import { InvoiceService } from '../invoice.service';
import { MAT_DIALOG_DATA } from '@angular/material';
import { MatDialog } from '@angular/material';
import { Subscription } from 'rxjs';
import { CustomerService } from 'src/app/customer/customer.service';
import { Customer } from 'src/app/customer/customer.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { InvoiceDetailComponent } from '../invoice-detail/invoice-detail.component';
import { SharedService } from 'src/app/shared/shared.service';
import { switchMap, map } from 'rxjs/operators';
import { ChangeNameDialogComponent } from '../change-name-dialog/change-name-dialog.component';

@Component({
  selector: 'app-invoicegroup',
  templateUrl: './invoicegroup.component.html',
  styleUrls: ['./invoicegroup.component.scss']
})
export class InvoicegroupComponent implements OnInit {
  invoice: Invoice;
  invoiceSubscription: Subscription;
  customerSubscription: Subscription;
  groupSubscription: Subscription;
  customers: Customer[];
  addGroup: FormGroup;
  listGroupName: any;

  constructor(@Inject(MAT_DIALOG_DATA) public invoiceId: any, private invoiceService: InvoiceService, private cService: CustomerService,
    public dialog: MatDialog, private sharedService: SharedService) {
    this.addGroup = new FormGroup({
      name: new FormControl(null, [Validators.required]),
    });
  }

  ngOnInit() {
    this.customerSubscription = this.cService.customers.subscribe(customers => {
      this.customers = customers;
    });

    this.groupSubscription = this.invoiceService.groups.subscribe(groups => {
      this.listGroupName = groups;
    });

    this.invoiceSubscription = this.invoiceService.invoices.subscribe(invoices => {
      if (!invoices === null) {
        return;
      }
      this.invoice = invoices.find(i => i.id === this.invoiceId);
    });

    this.invoiceService.getAllInvoice().subscribe();
    this.cService.getAllCustomer().subscribe();
    this.invoiceService.getGroupName(this.invoiceId).subscribe();
  }

  getCustomer(customerId: string) {
    const customer = this.customers.find(cus => cus.id === customerId);
    if (!customer) {
      return null;
    }
    return customer;
  }

  onClickOpenDetail(invoice, item) {
    const dialogRef = this.dialog.open(InvoiceDetailComponent, {
      panelClass: 'nopadding-dialog',
      width: '60vw',
      height: '70vh',
      disableClose: true,
      autoFocus: false,
      data: { invoice, item }
    });

    dialogRef.afterClosed().pipe(
      switchMap(() => {
        return this.invoiceService.getAllInvoice();
      })
    ).subscribe();
  }

  addGroupName(groupName) {
    this.invoiceService.addGroupName(new InvoiceGroup(groupName.value.name, [], 'active'), this.invoiceId).pipe(
      switchMap(() => this.invoiceService.getGroupName(this.invoiceId))
    ).subscribe(() => {

    });
    this.addGroup.reset();
  }

  decode(id) {
    return this.sharedService.decode(id, 'I');
  }

  editGroupName(id) {
    const dialogRef = this.dialog.open(ChangeNameDialogComponent, {
      panelClass: 'nopadding-dialog',
      width: '250px',
      // height: '130px',
      disableClose: false,
      autoFocus: false,
      data: { id }
    });

    dialogRef.afterClosed().pipe(
      switchMap(() => this.invoiceService.getGroupName(this.invoiceId))
    ).subscribe();
  }

  deleteGroupName(index) {
    this.invoiceService.deleteGroupName(index).pipe(
      switchMap(() => this.invoiceService.getGroupName(this.invoiceId))
    ).subscribe();
  }
}
