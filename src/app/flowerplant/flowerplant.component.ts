import { Component, OnInit } from '@angular/core';
import { ItemsService } from 'src/app/items/items.service';
import { Item } from '../items/items.model';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { FlowerplantdialogComponent } from './flowerplantdialog/flowerplantdialog.component';
import { switchMap } from 'rxjs/operators';

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
      width: '40vw',
      height: '70vh',
      disableClose: false,
      autoFocus: false,
    });
  }

  delete(id: string) {
    this.itemsService.deleteItem(id).pipe(
      switchMap(() => this.itemsService.getAllItems())
    ).subscribe();
  }
}
