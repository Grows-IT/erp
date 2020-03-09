import { Component, OnInit } from '@angular/core';
import { Item } from '../items/items.model';
import { Subscription } from 'rxjs';
import { ItemsService } from '../items/items.service';
import { MatDialog } from '@angular/material';
import { switchMap } from 'rxjs/operators';
import { ConfirmDialogComponent } from '../shared/confirm-dialog/confirm-dialog.component';
import { InventoryDialogComponent } from './inventory-dialog/inventory-dialog.component';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss']
})
export class InventoryComponent implements OnInit {

  flowerCol: string[] = ['no', 'name', 'price', 'availableQuantity', 'edit', 'delete'];
  items: Item[];
  itemSubscription: Subscription;

  constructor(private itemsService: ItemsService, public dialog: MatDialog) { }

  ngOnInit() {

    this.itemSubscription = this.itemsService.items.subscribe(items => {
      this.items = items;
    });
    this.itemsService.getAllItems().subscribe();
  }

  openFlowerplant() {
    const dialogRef = this.dialog.open(InventoryDialogComponent, {
      panelClass: 'nopadding-dialog',
      width: '30vw',
      height: '80vh',
      disableClose: false,
      autoFocus: false,
    });
  }

  editFlowerplant(item) {
    const dialogRef = this.dialog.open(InventoryDialogComponent, {
      panelClass: 'nopadding-dialog',
      width: '30vw',
      height: '80vh',
      disableClose: false,
      autoFocus: false,
      data: item,
    });

    dialogRef.afterClosed().pipe(
      switchMap(() => {
        return this.itemsService.getAllItems();
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
      data: { id, 'from': 'flowerPlant' }
    });
    dialogRef.beforeClosed();
  }

}
