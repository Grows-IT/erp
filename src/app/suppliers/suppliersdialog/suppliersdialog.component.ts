import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Subscription } from 'rxjs';
import { Supplier } from '../supplier.model';
import { SupplierService } from '../supplier.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-suppliersdialog',
  templateUrl: './suppliersdialog.component.html',
  styleUrls: ['./suppliersdialog.component.scss']
})
export class SuppliersdialogComponent implements OnInit {

  supplierSubscription: Subscription;
  supplier: Supplier[];
  supplierGroup: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<SuppliersdialogComponent>,
    private sService: SupplierService
  ) { }

  ngOnInit() {

    this.supplierSubscription = this.sService.supplier.subscribe(sup => {
      this.supplier = sup;
    });
    this.sService.getAllSuppliers().subscribe();

    if (this.data !== null && this.data !== undefined) {
      this.supplierGroup = this.fb.group({
        name: [this.data.name, [Validators.required]],
        address: [this.data.address, [Validators.required]],
        contactPerson: [this.data.contactPerson, [Validators.required]],
        taxId: [this.data.taxId, [Validators.required]],
      });
    } else {
      this.supplierGroup = this.fb.group({
        name: ['', [Validators.required]],
        address: ['', [Validators.required]],
        contactPerson: ['', [Validators.required]],
        taxId: ['', [Validators.required]]
      });
    }
  }

  close(): void {
    this.dialogRef.close();
  }

  onConfirmClick(status) {
    if (status === 0) {
      this.sService.addSupplier(this.supplierGroup.value).pipe(
        switchMap(() => this.sService.getAllSuppliers())
      ).subscribe();
    } else if (status === 1) {
      this.sService.updateSupplier(this.supplierGroup.value, this.data.id).pipe(
        switchMap(() => this.sService.getAllSuppliers())
      ).subscribe();
      console.log(this.supplierGroup.value);
      console.log(this.data.id);
      // }
    }
    this.dialogRef.close();
  }
}
