import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { InvoiceService } from '../invoice.service';
import { MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormArray, FormControl, Validators, FormBuilder } from '@angular/forms';
import { CustomerService } from 'src/app/customer/customer.service';
import { Subscription } from 'rxjs';
import { Customer } from 'src/app/customer/customer.model';
import { Invoice, SubInvoice, SellItem } from '../invoice.model';
import { ItemsService } from 'src/app/items/items.service';
import { Item } from 'src/app/items/items.model';

@Component({
  selector: 'app-invoice-detail',
  templateUrl: './invoice-detail.component.html',
  styleUrls: ['./invoice-detail.component.scss']
})
export class InvoiceDetailComponent implements OnInit, OnDestroy {
  expandedElement;
  invoiceCol: string[] = ['item', 'quantity'];
  invoiceSubscription: Subscription;
  customerSubscription: Subscription;
  customers: Customer[];
  invoices: Invoice[];
  mainInvoices: any;
  addForm: FormGroup;
  rows: FormArray;
  isShowing: boolean;
  invoiceDetial: any;
  // this.data is id
  items: Item[];
  dataInvoiceGroup = this.data;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private cService: CustomerService,
    private invoiceService: InvoiceService, private fb: FormBuilder, private itemsService: ItemsService) {
    this.addForm = new FormGroup({
      name: new FormControl(null, [Validators.required]),
      sellItem: this.fb.array([])
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

    this.itemsService.items.subscribe(items => {
      this.items = items;
    });

    this.cService.getAllCustomer().subscribe();
    this.invoiceService.getAllInvoice().subscribe();
    this.itemsService.getAllItems().subscribe();
    this.invoiceService.updateCountInvoice().subscribe();
  }

  ngOnDestroy(): void {
    this.customerSubscription.unsubscribe();
  }

  getItems(itemId: string) {
    const product = this.items.find(pro => pro.id === itemId);
    if (!product) {
      return null;
    }
    return product;
  }

  getItemsToId(name: string) {
    const item = this.items.find(pro => pro.name === name);
    if (!item) {
      return null;
    }
    return item;
  }

  getInvoiceDetail(invoiceId: string) {
    const invoice = this.invoices.find(inv => inv.id === invoiceId);
    if (!invoice) {
      return null;
    }
    return invoice;
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
    });
  }

  onConfirmClick() {
    if (!this.rows.dirty) {
      return;
    }

    const data = {
      name: this.addForm.value.name,
      sellItem: this.rows.value
    };

    console.log(this.dataInvoiceGroup.invoice);

    const sellItems: SellItem[] = data.sellItem.map(val => new SellItem(this.getItemsToId(val.name).id, val.quantity));
    this.dataInvoiceGroup.invoice.group[this.dataInvoiceGroup.index].subInvoices.push(new SubInvoice(data.name, sellItems));

    this.invoiceService.updateInvoice(this.dataInvoiceGroup.invoice).subscribe();
    this.toggleShoing();
  }

  decode(id) {
    const PUSH_CHARS = "-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz";
    id = id.substring(0, 8);
    let timestamp = 0;
    for (let i = 0; i < id.length; i++) {
      const c = id.charAt(i);
      timestamp = timestamp * 64 + PUSH_CHARS.indexOf(c);
    }
    const date = new Date(timestamp);
    const invoiceId = 'GIT' + date.getDate() + date.getMonth() + 1 + date.getFullYear();
    return invoiceId;
  }
}
