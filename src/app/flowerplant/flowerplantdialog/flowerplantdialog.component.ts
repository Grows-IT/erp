import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Subscription } from 'rxjs';
import { ItemsService } from 'src/app/items/items.service';
import { Item } from 'src/app/items/items.model';

@Component({
  selector: 'app-flowerplantdialog',
  templateUrl: './flowerplantdialog.component.html',
  styleUrls: ['./flowerplantdialog.component.scss']
})
export class FlowerplantdialogComponent implements OnInit {

  items: Item[];
  itemSubscription: Subscription;

  constructor(private itemsService: ItemsService, public dialogRef: MatDialogRef<FlowerplantdialogComponent>) { }

  ngOnInit() {
    this.itemSubscription = this.itemsService.items.subscribe(items => {
      this.items = items;
    });
    this.itemsService.getAllItems().subscribe();
  }

  close(): void {
    this.dialogRef.close();
  }

  }

