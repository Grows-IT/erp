import { Component, OnInit } from '@angular/core';
import { ItemsService } from 'src/app/items/items.service';
import { Item } from '../items/items.model';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { FlowerplantdialogComponent } from './flowerplantdialog/flowerplantdialog.component';
import { switchMap } from 'rxjs/operators';
import { ConfirmDialogComponent } from '../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-flowerplant',
  templateUrl: './flowerplant.component.html',
  styleUrls: ['./flowerplant.component.scss']
})
export class FlowerplantComponent implements OnInit {

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
    const dialogRef = this.dialog.open(FlowerplantdialogComponent, {
      panelClass: 'nopadding-dialog',
      width: '30vw',
      height: '65vh',
      disableClose: false,
      autoFocus: false,
    });
  }

  editFlowerplant(item) {
    const dialogRef = this.dialog.open(FlowerplantdialogComponent, {
      panelClass: 'nopadding-dialog',
      width: '30vw',
      height: '65vh',
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
    // this.itemsService.deleteItem(id).pipe(
    //   switchMap(() => this.itemsService.getAllItems())
    // ).subscribe();
  }
}
