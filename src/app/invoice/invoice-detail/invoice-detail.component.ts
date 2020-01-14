import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { InvoiceService } from '../invoice.service';
import { MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormArray, FormControl, Validators, FormBuilder } from '@angular/forms';
import { CustomerService } from 'src/app/customer/customer.service';
import { Subscription } from 'rxjs';
import { Customer } from 'src/app/customer/customer.model';


@Component({
  selector: 'app-invoice-detail',
  templateUrl: './invoice-detail.component.html',
  styleUrls: ['./invoice-detail.component.scss']
})
export class InvoiceDetailComponent implements OnInit, OnDestroy {
  expandedElement;
  invoiceCol: string[] = ['item', 'quantity', 'price'];
  customerSubscription: Subscription;
  customers: Customer[];
  mainInvoices: any;
  subInvoice: any = [];
  addForm: FormGroup;
  rows: FormArray;
  isShowing: boolean;
  // this.data is id
  id = this.data;
  isShow = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private cService: CustomerService,
    private invoiceService: InvoiceService, private fb: FormBuilder) {
    this.addForm = new FormGroup({
      groupName: new FormControl(null, [Validators.required])
    });
    this.rows = this.fb.array([]);
    this.isShowing = false;
  }

  ngOnInit() {
    this.addForm.addControl('rows', this.rows);

    this.customerSubscription = this.cService.customers.subscribe(customers => {
      this.customers = customers;
    });
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
    this.cService.getAllCustomer().subscribe();
  }

  ngOnDestroy(): void {
    this.customerSubscription.unsubscribe();
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

  showItem() {
    this.isShow = !this.isShow;
  }

  allShow(){
    this.addForm.reset();
    this.rows.clear();
    this.isShowing = !this.isShowing;
    this.isShow = !this.isShow;
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