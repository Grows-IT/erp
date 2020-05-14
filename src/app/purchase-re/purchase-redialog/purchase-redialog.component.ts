import { Component, OnInit, Inject } from "@angular/core";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { PurchaseRenextdialogComponent } from "../purchase-renextdialog/purchase-renextdialog.component";
import { Validators, FormGroup, FormBuilder, FormArray } from "@angular/forms";
import { PRService } from "../purchase-re.service";
import { Subscription, Observable } from "rxjs";
import { PurchaseRe, PurchaseItem } from "../purchase-re.model";
import { switchMap, startWith, map } from "rxjs/operators";
import { SupplierService } from "src/app/suppliers/supplier.service";
import { Supplier } from "src/app/suppliers/supplier.model";
import { SupplierItemService } from "src/app/suppliers/supplieritems/supplieritems.service";
import { SupplierItems } from "src/app/suppliers/supplieritems/supplieritems.model";

@Component({
  selector: "app-purchase-redialog",
  templateUrl: "./purchase-redialog.component.html",
  styleUrls: ["./purchase-redialog.component.scss"],
})
export class PurchaseRedialogComponent implements OnInit {
  prInfo: FormGroup;
  prSubscription: Subscription;
  purRe: PurchaseRe[];
  spSubscription: Subscription;
  supplier: Supplier[];
  spiSubscription: Subscription;
  supplierItem: SupplierItems[];
  purchaseItem: PurchaseItem[];
  piSubscription: Subscription;
  filteredType: Observable<string[]>;

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
          console.log(this.data);
          this.prInfo = this.fb.group({
            prName: [this.data.prName, [Validators.required]],
            spName: [this.getSupInfo(this.data.spId).name, [Validators.required]],
            spAddress: [this.getSupInfo(this.data.spId).address, [Validators.required],
            ],
            desAddress: [this.data.DeliveryAddress, [Validators.required]],
            addiNote: [this.data.addiNote, [Validators.required]],
            shipCost: [this.getShipCost(this.data.PIid), [Validators.required]],
            allPRItem: this.fb.array([this.addMoreItems()]),
          });
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
        }
      }
    );

    // console.log(this.purchaseItem);

    // if (this.data) {
    //   console.log(this.data);
    //   const a = this.getSupInfo(this.data.spId);
    //   console.log(a);

    //   this.prInfo = this.fb.group({
    //     prName: [this.data.prName, [Validators.required]],
    //     // spName: ['', [Validators.required]],
    //     spName: [a.name, [Validators.required]],
    //     spAddress: [a.address, [Validators.required],
    //     ],
    //     // spAddress: ['', [Validators.required]],
    //     desAddress: [this.data.DeliveryAddress, [Validators.required]],
    //     addiNote: [this.data.addiNote, [Validators.required]],
    //     // shipCost: ['', [Validators.required]],
    //     shipCost: [this.getShipCost(this.data.PIid), [Validators.required]],
    //     allPRItem: this.fb.array([this.addMoreItems()]),
    //   });
    //   // for (let i = 0; i < this.getItems().length; i++) {
    //   //   const control = <FormArray>this.prInfo.controls["allPRItem"];
    //   //   control.push(this.viewItemFormGroup(i));
    //   // }
    // } else {
    //   this.prInfo = this.fb.group({
    //     prName: ['', [Validators.required]],
    //     spName: ['', [Validators.required]],
    //     spAddress: ['', [Validators.required]],
    //     desAddress: ['', [Validators.required]],
    //     addiNote: ['', [Validators.required]],
    //     shipCost: ['', [Validators.required]],
    //     allPRItem: this.fb.array([this.addMoreItems()]),
    //   });
    // }
  }

  getSupInfo(spId: any) {
    if (!this.supplier) {
      return;
    }
    const supinfo = this.supplier.find((sp) => sp.id === spId);
    console.log(supinfo);
    // if (!supinfo) {
    //   return;
    // }
    return supinfo;
  }

  getShipCost(PIid: any) {
    if (!this.purchaseItem) {
      return;
    }
    const shipcost = this.purchaseItem.find((pi) => pi.id === PIid);
    console.log(shipcost);

    // if (!shipcost) {
    //   return;
    // }
    return shipcost.shippingCost;
  }

  getItems() {
    this.data = this.dialogRef.componentInstance.data;

    const prod = this.data.PIid.split(',');

    const items = [];
    for (let i = 0; i < prod.length; i++) {
      const product2 = this.purchaseItem.find((pro2) => pro2.id == prod[i]);
      items.push(product2);
    }
    if (!this.data.PIid) {
      return null;
    }

    return items;
  }

  private addMoreItems() {
    return this.fb.group({
      // type: ['', [Validators.required]],
      itName: ['', [Validators.required]],
      quantity: ['', [Validators.required]],
    });
  }

  private viewItemFormGroup(i) {
    this.data = this.dialogRef.componentInstance.data;

    return this.fb.group({
      item: [this.getItems()[i].name, [Validators.required]],
      quantity: [this.getItems()[i].quantity, [Validators.required]],
    });
  }

  onAddRow() {
    const control = <FormArray>this.prInfo.controls["allPRItem"];
    control.push(this.addMoreItems());
  }

  removeUnit(i: number) {
    const control = <FormArray>this.prInfo.controls["allPRItem"];
    control.removeAt(i);
  }

  close(): void {
    this.dialogRef.close();
  }

  onConfirmClick(status) {
    this.data = this.dialogRef.componentInstance.data;

    if (status === 0) {
      this.PRservice.addPR(this.prInfo.value)
        .pipe(switchMap(() => this.PRservice.getPR()))
        .subscribe()
        .unsubscribe();
    } else if (status === 1) {
      this.PRservice.updatePR(
        this.prInfo.value,
        this.data.id,
        this.data.allPRItem
      )
        .pipe(switchMap(() => this.PRservice.getPR()))
        .subscribe();
    }
    this.dialogRef.close();
  }
}
