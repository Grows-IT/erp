import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { Subscription } from "rxjs";
import { ItemsService } from "src/app/items/items.service";
import { Item } from "src/app/items/items.model";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { switchMap } from 'rxjs/operators';

@Component({
  selector: "app-flowerplantdialog",
  templateUrl: "./flowerplantdialog.component.html",
  styleUrls: ["./flowerplantdialog.component.scss"]
})
export class FlowerplantdialogComponent implements OnInit {
  items: Item[];
  itemSubscription: Subscription;
  item: FormGroup;

  // tslint:disable-next-line: max-line-length
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private itemsService: ItemsService,
    public dialogRef: MatDialogRef<FlowerplantdialogComponent>
  ) {}

  ngOnInit() {
    this.itemSubscription = this.itemsService.items.subscribe(items => {
      this.items = items;
    });
    this.itemsService.getAllItems().subscribe();

    if (this.data !== null && this.data !== undefined) {
      this.item = this.fb.group({
        name: [this.data.name, [Validators.required]],
        price: [this.data.price, [Validators.required]],
        quantity: [this.data.availableQuantity, [Validators.required]]
      });
    } else {
      this.item = this.fb.group({
        name: ['', [Validators.required]],
        price: ['', [Validators.required]],
        quantity: ['', [Validators.required]]
      });
    }
  }

  close(): void {
    this.dialogRef.close();
  }

  onConfirmClick(status) {
    if (status === 0) {
      console.log(this.items.values);
      this.itemsService.addItem(this.item.value).pipe(
        switchMap(() => this.itemsService.getAllItems())
      ).subscribe();
    } else if (status === 1) {
      this.itemsService.updateItem(this.item.value, this.data.id).pipe(
        switchMap(() => this.itemsService.getAllItems())
      ).subscribe();
      console.log(this.item.value);
      console.log(this.data.id);


      // }
    }
    this.dialogRef.close();
  }
}
