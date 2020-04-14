import { Component, OnInit, Inject } from "@angular/core";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { SupplierItems } from "./supplieritems.model";
import { Subscription } from "rxjs";
import { SupplierItemService } from "./supplieritems.service";
import { switchMap } from 'rxjs/operators';

@Component({
  selector: "app-supplieritems",
  templateUrl: "./supplieritems.component.html",
  styleUrls: ["./supplieritems.component.scss"]
})
export class SupplieritemsComponent implements OnInit {
  supplierG: FormGroup;
  supplierItems: SupplierItems[];
  supplierItemSubscription: Subscription;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<SupplieritemsComponent>,
    private SiService: SupplierItemService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.supplierItemSubscription = this.SiService.supplieritem.subscribe(
      sup => {
        this.supplierItems = sup;
      }
    );
    this.SiService.getSupItem().subscribe();
    console.log(this.data);


    if (this.data !== null && this.data !== undefined) {
      this.supplierG = this.fb.group({
        type: [this.data.type, [Validators.required]],
        name: [this.data.name, [Validators.required]],
        price: [this.data.price, [Validators.required]],
        description: [this.data.description, [Validators.required]]
      });
    } else {
      this.supplierG = this.fb.group({
        type: ["", [Validators.required]],
        name: ["", [Validators.required]],
        price: ["", [Validators.required]],
        description: ["", [Validators.required]]
      });
    }
  }

  close(): void {
    this.dialogRef.close();
  }

  onConfirmClick(status) {
    if (status === 0) {
      console.log(this.supplierG.value);
      this.SiService.addSupItem(this.supplierG.value).pipe(
        switchMap(() => this.SiService.getSupItem())
      ).subscribe();
    } else if (status === 1) {
      this.SiService.updateSupIt(this.supplierG.value, this.data.id).pipe(
        switchMap(() => this.SiService.getSupItem())
      ).subscribe();
      console.log(this.supplierG.value);
      console.log(this.data.id);


      // }
    }
    this.dialogRef.close();
  }
}
