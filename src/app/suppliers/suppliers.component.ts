import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SuppliersdialogComponent } from './suppliersdialog/suppliersdialog.component';
import { SupplierService } from './supplier.service';
import { Subscription } from 'rxjs';
import { Supplier } from './supplier.model';
import { ConfirmDialogComponent } from '../shared/confirm-dialog/confirm-dialog.component';
import { switchMap } from 'rxjs/operators';
import { SupplieritemsdialogComponent } from './supplieritems/supplieritemsdialog/supplieritemsdialog.component';

@Component({
  selector: 'app-suppliers',
  templateUrl: './suppliers.component.html',
  styleUrls: ['./suppliers.component.scss']
})
export class SuppliersComponent implements OnInit {

  supplierCol: string[] = ['no', 'type', 'name', 'items', 'edit', 'delete'];
  supplierSubscription: Subscription;
  supplier: Supplier[];

  constructor(public dialog: MatDialog, private sService: SupplierService) { }

  ngOnInit() {
    this.supplierSubscription = this.sService.supplier.subscribe(sup => {
      this.supplier = sup;
    });
    this.sService.getAllSuppliers().subscribe();
  }

  openSupplier() {
    const dialogRef = this.dialog.open(SuppliersdialogComponent, {
      panelClass: 'nopadding-dialog',
      width: '50vw',
      height: '70vh',
      disableClose: false,
      autoFocus: false,
    });
  }

  openSupplierItem(data: any) {
    const dialogRef = this.dialog.open(SupplieritemsdialogComponent, {
      panelClass: 'nopadding-dialog',
      width: '60vw',
      height: '80vh',
      disableClose: false,
      autoFocus: false,
      data: data
    });
  }

  editSupplier(item) {
    const dialogRef = this.dialog.open(SuppliersdialogComponent, {
      panelClass: 'nopadding-dialog',
      width: '50vw',
      height: '70vh',
      disableClose: false,
      autoFocus: false,
      data: item,
    });

    dialogRef.afterClosed().pipe(
      switchMap(() => {
        return this.sService.getAllSuppliers();
      })
    ).subscribe();
  }

  delete(id: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      panelClass: 'nopadding-dialog',
      width: '400px',
      height: '200px',
      disableClose: true,
      autoFocus: false,
      data: { id, 'from': 'supplier' }
    });
    dialogRef.beforeClosed();
    // this.itemsService.deleteItem(id).pipe(
    //   switchMap(() => this.itemsService.getAllItems())
    // ).subscribe();
  }

}
