import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Validators, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { PRService } from '../purchase-re.service';
import { Subscription, Observable } from 'rxjs';
import { PurchaseRe, PurchaseItem } from '../purchase-re.model';
import { switchMap, startWith, map } from 'rxjs/operators';
import { SupplierService } from 'src/app/suppliers/supplier.service';
import { Supplier } from 'src/app/suppliers/supplier.model';
import { SupplierItemService } from 'src/app/suppliers/supplieritems/supplieritems.service';
import { SupplierItems } from 'src/app/suppliers/supplieritems/supplieritems.model';

@Component({
  selector: 'app-purchase-redialog',
  templateUrl: './purchase-redialog.component.html',
  styleUrls: ['./purchase-redialog.component.scss'],
})
export class PurchaseRedialogComponent implements OnInit, OnDestroy {
  prInfo: FormGroup;
  prSubscription: Subscription;
  spSubscription: Subscription;
  spiSubscription: Subscription;
  piSubscription: Subscription;
  purRe: PurchaseRe[];
  supplier: Supplier[];
  supplierItem: SupplierItems[];
  purchaseItem: PurchaseItem[];
  filteredType: Observable<string[]>;
  price: number;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<PurchaseRedialogComponent>,
    private PRservice: PRService,
    private SPservice: SupplierService,
    private SPIservice: SupplierItemService
  ) { }

  ngOnInit() {
    this.data = this.dialogRef.componentInstance.data;

    this.prSubscription = this.PRservice.purchasere.subscribe((pr) => {
      this.purRe = pr;
    });
    this.PRservice.getPR().subscribe();
    this.piSubscription = this.PRservice.purchaseit.subscribe((pi) => {
      this.purchaseItem = pi;
    });
    this.PRservice.getPurchaseItem().subscribe();

    this.spSubscription = this.SPservice.supplier.subscribe((sp) => {
      this.supplier = sp;
    });
    this.SPservice.getAllSuppliers().subscribe();

    this.spiSubscription = this.SPIservice.supplieritem.subscribe((spi) => {
      this.supplierItem = spi;
    });
    this.SPIservice.getSupItem().subscribe(
      () => {
        if (this.data) {
          this.prInfo = this.fb.group({
            prName: [this.data.prName, [Validators.required]],
            spName: [this.getSupInfo(this.data.spId).name, [Validators.required]],
            spAddress: [this.getSupInfo(this.data.spId).address, [Validators.required]],
            desAddress: [this.data.DeliveryAddress, [Validators.required]],
            addiNote: [this.data.addiNote, [Validators.required]],
            shipCost: [this.getShipCost(this.data.PIid), [Validators.required]],
            allPRItem: this.fb.array([]),
          });

          for (let i = 0; i < this.getItems().length; i++) {
            const control = <FormArray>this.prInfo.controls['allPRItem'];
            control.push(this.viewItemFormGroup(i));
          }
        } else {
          this.prInfo = this.fb.group({
            prName: ['', [Validators.required]],
            spName: ['', [Validators.required]],
            spAddress: ['', [Validators.required]],
            desAddress: ['', [Validators.required]],
            addiNote: ['', [Validators.required]],
            shipCost: ['', [Validators.required]],
            allPRItem: this.fb.array([this.addMoreItems()]),
          });

          console.log(this);

        }
      }
    );
  }

  ngOnDestroy() {
    this.spiSubscription.unsubscribe();
    this.prSubscription.unsubscribe();
    this.spSubscription.unsubscribe();
    this.piSubscription.unsubscribe();
  }

  getSupInfo(spId: any) {
    if (!this.supplier) {
      return;
    }
    const supinfo = this.supplier.find((sp) => sp.id === spId);
    return supinfo;
  }

  getShipCost(PIid: any) {
    if (!this.purchaseItem) {
      return;
    }
    const shipcost = this.purchaseItem.find((pi) => pi.id === PIid);
    return shipcost.shippingCost;
  }

  getItems() {
    if (!this.purchaseItem) {
      return;
    }
    const product1 = this.purchaseItem.find((pro2) => pro2.id === this.data.PIid);
    const siIdArr = product1.siId.split(',');
    const quantityArr = product1.quantity.split(',');
    const allPRItem = [];

    for (let i = 0; i < siIdArr.length; i++) {
      const product2 = this.supplierItem.find((pro2) => pro2.SiId == siIdArr[i].replace(/['"]+/g, ''));
      product2['quantity'] = quantityArr[i].replace(/['"]+/g, '');
      product2['price'] = product2.price;
      allPRItem.push(product2);
    }
    return allPRItem;
  }

  setPriceItem(item, i) {
    const control = <FormArray>this.prInfo.controls.allPRItem['controls'];
    control[i].controls['price'].setValue(item.price);
    this.getTotalPrice();
  }

  private addMoreItems() {
    return this.fb.group({
      itName: ['', [Validators.required]],
      quantity: ['', [Validators.required]],
      price: ['', [Validators.required]]
    });
  }

  private viewItemFormGroup(i) {
    return this.fb.group({
      itName: [this.getItems()[i].name, [Validators.required]],
      quantity: [this.getItems()[i].quantity, [Validators.required]],
      price: [this.getItems()[i].price, [Validators.required]],
    });
  }

  onAddRow() {
    const control = <FormArray>this.prInfo.controls['allPRItem'];
    control.push(this.addMoreItems());
  }

  removeUnit(i: number) {
    const control = <FormArray>this.prInfo.controls['allPRItem'];
    control.removeAt(i);
  }

  close(): void {
    this.dialogRef.close();
  }

  getTotalPrice() {
    let total: number = 0;
    for (let i = 0; i < this.prInfo.controls.allPRItem['controls'].length; i++) {
      // console.log(this.prInfo.controls.allPRItem['controls'][i].value);
      total += +this.prInfo.controls.allPRItem['controls'][i].value.quantity * +this.prInfo.controls.allPRItem['controls'][i].value.price;
    }
    if (total === NaN) {
      total = 0;
    }
    // console.log(total);
    return total;
  }

  onConfirmClick(status) {
    if (status === 0) {
      this.PRservice.addPR(this.prInfo.value)
        .pipe(switchMap(() => this.PRservice.getPR()))
        .subscribe()
        .unsubscribe();
    } else if (status === 1) {
      this.PRservice.updatePR(
        this.prInfo.value,
        this.data.id,
        this.data.PIid,
      ).pipe(switchMap(() => this.PRservice.getPR()))
        .subscribe();
    }
    this.dialogRef.close();
  }
}
