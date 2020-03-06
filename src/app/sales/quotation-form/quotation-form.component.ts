import { Component, OnInit } from "@angular/core";
import { FormGroup, Validators, FormArray, FormBuilder } from "@angular/forms";
import { SalesService } from "../sales.service";
import { QuotationDialogComponent } from "../quotation-dialog/quotation-dialog.component";
import { MatDialogRef } from "@angular/material";
import { ItemsService } from "src/app/items/items.service";
import { Item } from "src/app/items/items.model";
import { CustomerService } from "src/app/customer/customer.service";
import { Customer } from "src/app/customer/customer.model";
import { Subscription, Observable } from "rxjs";
import { switchMap, startWith, map } from "rxjs/operators";
import { UserService } from "src/app/usersmanagement/user.service";
import { AuthService } from "src/app/signin/auth.service";
import { ChangeDetectorRef } from "@angular/core";
import { SharedService } from "src/app/shared/shared.service";

interface SellItemsResData {
  sellItemId: string;
  itemId: string;
  sellQuantity: string;
}

@Component({
  selector: "app-quotation-form",
  templateUrl: "./quotation-form.component.html",
  styleUrls: ["./quotation-form.component.scss"]
})
export class QuotationFormComponent implements OnInit {
  customerSubscription: Subscription;
  customers: Customer[];
  data: any;
  quotation: FormGroup;
  sellItem: SellItemsResData[];
  items: Item[];
  itemName: string;
  Total: number;
  filteredOptions: Observable<string[]>;
  addQ: Subscription;
  address: string;
  shareSubscription: Subscription;

  constructor(
    private salesService: SalesService,
    private dialogRef: MatDialogRef<QuotationDialogComponent>,
    private fb: FormBuilder,
    private itemsService: ItemsService,
    private cService: CustomerService,
    private cdRef: ChangeDetectorRef,
  ) { }

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
        customerName: [
          this.getCustomer(this.data.customerId).name,
          [Validators.required]
        ],
        addressTo: [
          this.getCustomer(this.data.customerId).address,
          [Validators.required]
        ],
        date: [this.data.date, [Validators.required]],
        expirationDate: [this.data.expirationDate, [Validators.required]],
        allItem: this.fb.array([])
      });

      for (let i = 0; i < this.getItems().length; i++) {
        const control = <FormArray>this.quotation.controls["allItem"];
        control.push(this.viewItemFormGroup(i));
      }
    } else {
      this.quotation = this.fb.group({
        customerName: ["", [Validators.required]],
        addressTo: ["", [Validators.required]],
        date: ["", [Validators.required]],
        expirationDate: ["", [Validators.required]],
        allItem: this.fb.array([this.createItemFormGroup()])
      });
    }
    this.filteredOptions = this.quotation.get("customerName").valueChanges.pipe(
      startWith(""),
      map(val => this.filter(val))
    );
  }

  // tslint:disable-next-line: use-lifecycle-interface
  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  filter(val: string): string[] {
    const customersNames = this.customers.map(cus => cus.name);
    return customersNames.filter(
      cus => cus.toLowerCase().indexOf(val.toLowerCase()) === 0
    );
  }

  autoAddress() {
    const cusNames = this.quotation.get("customerName").value;
    const findCus = this.customers.find(cus => cus.name === cusNames);
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

  getItems() {
    this.data = this.dialogRef.componentInstance.data;

    const prod = this.data.itemId.split(",");

    let items = [];
    for (let i = 0; i < prod.length; i++) {
      const product2 = this.items.find(pro2 => pro2.id == prod[i]);
      items.push(product2);
    }
    if (!this.data.itemId) {
      return null;
    }

    return items;
  }

  getQuantity() {
    this.data = this.dialogRef.componentInstance.data;
    const cutquan = this.data.itemQuantity.split(",");
    if (!this.data.itemQuantity) {
      return null;
    }

    return cutquan;
  }

  private viewItemFormGroup(i) {
    this.data = this.dialogRef.componentInstance.data;

    return this.fb.group({
      item: [
        this.getItems()[i].name,
        [Validators.required]
      ],
      quantity: [
        this.getQuantity()[i],
        [Validators.required]
      ]
    });
  }

  private createItemFormGroup() {
    return this.fb.group({
      item: ["", [Validators.required]],
      quantity: ["", [Validators.required]]
    });
  }

  close(): void {
    this.dialogRef.close();
  }

  onAddRow() {
    const control = <FormArray>this.quotation.controls["allItem"];
    control.push(this.createItemFormGroup());
  }

  removeUnit(i: number) {
    const control = <FormArray>this.quotation.controls["allItem"];
    control.removeAt(i);
  }

  onConfirmClick(status) {
    this.data = this.dialogRef.componentInstance.data;

    if (status === 0) {
      this.salesService
        .addQuotation(this.quotation.value)
        .pipe(switchMap(() => this.salesService.getQuotation()))
        .subscribe()
        .unsubscribe();
    } else if (status === 1) {
      this.salesService
        .updateQuotation(this.quotation.value, this.data.quotationId, this.data.sellItemId)
        .pipe(switchMap(() => this.salesService.getQuotation()))
        .subscribe();
    }
    this.dialogRef.close();
  }
}
