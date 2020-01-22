import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder } from '@angular/forms';
import { SalesService } from '../sales.service';
import { QuotationDialogComponent } from '../quotation-dialog/quotation-dialog.component';
import { MatDialogRef } from '@angular/material';
import { ItemsService } from 'src/app/items/items.service';
import { Item } from 'src/app/items/items.model';
import { CustomerService } from 'src/app/customer/customer.service';
import { Customer } from 'src/app/customer/customer.model';
import { Subscription, Observable } from 'rxjs';
import { registerLocaleData } from '@angular/common';
import { switchMap, debounceTime, startWith, map } from 'rxjs/operators';

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
  items: Item[];
  itemName: string;
  Total: number;
  filteredOptions: Observable<string[]>;

  options = [
    'One',
    'Two',
    'Three'
  ];

  // rows: FormArray;

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

  constructor(private salesService: SalesService, private dialogRef: MatDialogRef<QuotationDialogComponent>, private fb: FormBuilder, private itemsService: ItemsService, private cService: CustomerService) {
    // this.rows = this.fb.array([]);
  }

  ngOnInit() {
    this.customerSubscription = this.cService.customers.subscribe(customers => {
      this.customers = customers;
    });
    this.cService.getAllCustomer().subscribe();

    this.itemsService.items.subscribe(items => {
      this.items = items;
    });
    this.itemsService.getAllItems().subscribe();

    this.data = this.dialogRef.componentInstance.data;
    if (this.data !== null && this.data !== undefined) {
      this.quotation = this.fb.group({
        customerName: [this.getCustomer(this.data.customerId).name, [Validators.required]],
        // by: ['', [Validators.required]],
        addressTo: [this.getCustomer(this.data.customerId).address, [Validators.required]],
        date: [this.data.date, [Validators.required]],
        expirationDate: [this.data.expirationDate, [Validators.required]],
        allItem: this.fb.array([
          // this.createItemFormGroup()
        ])
      });
      console.log(this.data.items);

      for (let i = 0; i < this.data.items.length; i++) {
        const control = <FormArray>this.quotation.controls['allItem'];
        control.push(this.viewItemFormGroup(i));
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
    console.log(this.customers);
    this.filteredOptions = this.quotation.get('customerName').valueChanges
      .pipe(
        startWith(''),
        map(val => this.filter(val))
      );
  }

  filter(val: string): string[] {
    const customersNames = this.customers.map(cus => cus.name);
    return customersNames.filter(cus =>
      cus.toLowerCase().indexOf(val.toLowerCase()) === 0);
  }

  autoAddress() {
    const cusNames = this.quotation.get('customerName').value;
    const findCus = this.customers.find(cus => cus.name === cusNames );
    if (!findCus) {
      return null;
    }
    return findCus.address;
  }

  getCustomer(customerId: string) {
    const customer = this.customers.find(cus => cus.id === customerId);
    if (!customer) {
      return null;
    }
    return customer;
  }

  getItems(itemId: string) {
    const product = this.items.find(pro => pro.id === itemId);
    if (!product) {
      return null;
    }
    return product;
  }

  private viewItemFormGroup(i) {
    this.data = this.dialogRef.componentInstance.data;
    console.log(this.data.items[i].itemId);

    // if (this.data !== null && this.data !== undefined) {
    return this.fb.group({
      item: [this.getItems(this.data.items[i].itemId).name, [Validators.required]],
      quantity: [this.data.items[i].quantity, [Validators.required]],
    });

    // } else {
    //   return this.fb.group({
    //   item: ['', [Validators.required]],
    //   quantity: ['', [Validators.required]],
    // });
    // }
  }

  private createItemFormGroup() {
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
    const control = <FormArray> this.quotation.controls['allItem'];
    control.push(this.createItemFormGroup());
  }

  removeUnit(i: number) {
    const control = <FormArray>this.quotation.controls['allItem'];
    control.removeAt(i);
  }

  onConfirmClick(status) {
    if (status === 0) {
      console.log(this.quotation.value);
      this.salesService.addQuotation(this.quotation.value).pipe(
        switchMap(() => this.salesService.getQuotation())
      ).subscribe();
    } else if (status === 1) {
      this.salesService.updateQuotation(this.quotation.value, this.data.id).pipe(
        switchMap(() => this.salesService.getQuotation())
      ).subscribe();
      console.log(this.quotation.value);
    }
    this.dialogRef.close();
  }
}
