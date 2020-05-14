import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Subscription } from 'rxjs';
import { SupplierItems } from '../supplieritems.model';
import { SupplierItemService } from '../supplieritems.service';
import { switchMap, map } from 'rxjs/operators';
import { SupplieritemsComponent } from '../supplieritems.component';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-supplieritemsdialog',
  templateUrl: './supplieritemsdialog.component.html',
  styleUrls: ['./supplieritemsdialog.component.scss']
})
export class SupplieritemsdialogComponent implements OnInit {
  supplierItemCol: string[] = [
    'no',
    'type',
    'name',
    'price',
    'description',
    'edit',
    'delete'
  ];
  supplierItemSubscription: Subscription;
  supplierItem: SupplierItems[];
  type: string;
  name: string;
  price: string;
  description: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<SupplieritemsdialogComponent>,
    private SiService: SupplierItemService
  ) { }

  ngOnInit() {
    this.supplierItemSubscription = this.SiService.supplieritem.subscribe(sup => {
      this.supplierItem = sup;
    });
    this.SiService.getSupItem().subscribe();
  }

  addItem() {
    const dialogRef = this.dialog.open(SupplieritemsComponent, {
      panelClass: 'nopadding-dialog',
      width: '60vw',
      height: '80vh',
      disableClose: false,
      autoFocus: false,
    });
  }

  editItem(item) {
    const dialogRef = this.dialog.open(SupplieritemsComponent, {
      panelClass: 'nopadding-dialog',
      width: '60vw',
      height: '80vh',
      disableClose: false,
      autoFocus: false,
      data: item
    });
    dialogRef
      .afterClosed()
      .pipe(
        switchMap(() => {
          return this.SiService.getSupItem();
        })
      )
      .subscribe();
  }

  delete(id: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      panelClass: 'nopadding-dialog',
      width: '400px',
      height: '200px',
      disableClose: true,
      autoFocus: false,
      data: { id, from: 'supplieritems' }
    });
    dialogRef.beforeClosed();
    // this.itemsService.deleteItem(id).pipe(
    //   switchMap(() => this.itemsService.getAllItems())
    // ).subscribe();
  }

  close(): void {
    this.dialogRef.close();
  }
}
