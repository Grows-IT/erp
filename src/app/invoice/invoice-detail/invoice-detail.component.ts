import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { InvoiceService } from '../invoice.service';
import { MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormArray, FormControl, Validators, FormBuilder } from '@angular/forms';
import { CustomerService } from 'src/app/customer/customer.service';
import { Subscription } from 'rxjs';
import { Customer } from 'src/app/customer/customer.model';
import { Invoice } from '../invoice.model';


@Component({
  selector: 'app-invoice-detail',
  templateUrl: './invoice-detail.component.html',
  styleUrls: ['./invoice-detail.component.scss']
})
export class InvoiceDetailComponent implements OnInit, OnDestroy {
  expandedElement;
  invoiceCol: string[] = ['item', 'quantity', 'price'];
  invoiceSubscription: Subscription;
  customerSubscription: Subscription;
  customers: Customer[];
  invoices: Invoice[];
  mainInvoices: any;
  subInvoice: any = [];
  addForm: FormGroup;
  rows: FormArray;
  isShowing: boolean;
  invoiceDetial: any;
  // this.data is id
  dataInvoiceGroup = this.data;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private cService: CustomerService,
    private invoiceService: InvoiceService, private fb: FormBuilder) {
    this.addForm = new FormGroup({
      invoiceName: new FormControl(null, [Validators.required]),
      sellItem: this.fb.array([

      ])
    });
    this.rows = this.fb.array([]);
    this.isShowing = false;
  }

  ngOnInit() {

    this.addForm.addControl('rows', this.rows);

    this.customerSubscription = this.cService.customers.subscribe(customers => {
      this.customers = customers;
    });

    this.invoiceSubscription = this.invoiceService.invoices.subscribe(invoices => {
      if (!invoices === null) {
        return;
      }
      this.invoices = invoices;
    });
    this.cService.getAllCustomer().subscribe();
    this.invoiceService.getAllInvoice().subscribe();
  }

  ngOnDestroy(): void {
    this.customerSubscription.unsubscribe();
  }

  getInvoiceDetail(invoiceId: string) {
    const invoice = this.invoices.find(inv => inv.id === invoiceId);
    if (!invoice) {
      return null;
    }
    return invoice;
  }

  getGroupName() {

  }

  getCustomer(customerId: string) {
    const customer = this.customers.find(cus => cus.id === customerId);
    if (!customer) {
      return null;
    }
    return customer;
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
      invoiceName: this.addForm.value.invoiceName,
      sellItem: this.rows.value
    };

    this.invoiceService.addSubInvoice(data, this.dataInvoiceGroup.invoiceId, this.dataInvoiceGroup.groupId).subscribe();
    this.subInvoice.push(data);
    this.toggleShoing();
  }
}



// constructor(@Inject(MAT_DIALOG_DATA) public data: any, private cService: CustomerService,
// private invoiceService: InvoiceService, private fb: FormBuilder) {
// this.addForm = new FormGroup({
//   groupName: new FormControl(null, [Validators.required])
// });
// this.rows = this.fb.array([]);
// this.isShowing = false;
// }

// ngOnInit() {

// this.addForm.addControl('rows', this.rows);

// this.customerSubscription = this.cService.customers.subscribe(customers => {
//   this.customers = customers;
// });

// this.invoiceSubscription = this.invoiceService.invoices.subscribe( invoices => {
//  if(!invoices === null){
//    return;
//  }
//  this.invoices = invoices.find(i => i.id === this.data);
// });
// console.log(this.invoices);
// this.invoiceService.getSubInvioce(this.id).subscribe((res) => {
//   if (res.subInvoices !== null && res.subInvoices !== undefined) {
//     Object.keys(res.subInvoices).map(key => {
//       this.subInvoice.push(res.subInvoices[key]);
//     });
//   } else {
//     return;
//   }
//   // console.log(this.subInvoice);
//   this.mainInvoices = res;
// });
// this.cService.getAllCustomer().subscribe();
// this.invoiceService.getAllInvoice().subscribe();
// }

// ngOnDestroy(): void {
// this.customerSubscription.unsubscribe();
// }


// getCustomer(customerId: string) {
// const customer = this.customers.find(cus => cus.id === customerId);
// if (!customer) {
//   return null;
// }
// return customer;
// }

// toggleShoing() {
// this.addForm.reset();
// this.rows.clear();
// this.isShowing = !this.isShowing;
// }

// openPdf(id) {

// }

// // allShow(){
// //   this.addForm.reset();
// //   this.rows.clear();
// //   this.isShowing = !this.isShowing;
// //   this.isShow = !this.isShow;
// // }

// onAddRow() {
// this.rows.push(this.createItemFormGroup());
// }

// onRemoveRow(rowIndex: number) {
// this.rows.removeAt(rowIndex);
// }

// createItemFormGroup(): FormGroup {
// return new FormGroup({
//   name: new FormControl(null, [Validators.required]),
//   quantity: new FormControl(null, [Validators.required]),
//   price: new FormControl(null, [Validators.required])
// });
// }

// onConfirmClick() {
// if (!this.rows.dirty) {
//   return;
// }

// const data = {
//   groupName: this.addForm.value.groupName,
//   row: this.rows.value
// };

// this.invoiceService.addSubInvoice(data, this.id).subscribe();
// this.subInvoice.push(data);
// this.toggleShoing();
// }
// }
