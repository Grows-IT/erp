import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';

@Component({
  selector: 'app-purchase-renextdialog',
  templateUrl: './purchase-renextdialog.component.html',
  styleUrls: ['./purchase-renextdialog.component.scss']
})
export class PurchaseRenextdialogComponent implements OnInit {
  prItem: FormGroup;

  constructor(private fb: FormBuilder, public dialog: MatDialog, public dialogRef: MatDialogRef<PurchaseRenextdialogComponent>) { }

  ngOnInit() {
    this.prItem = this.fb.group({
      allPRItem: this.fb.array([this.addMoreItems()]),
      shipCost: ['', [Validators.required]]
    });
  }

  close(): void {
    this.dialogRef.close();
  }

  private addMoreItems() {
    return this.fb.group({
      type: ['', [Validators.required]],
      itName: ['', [Validators.required]],
      quantity: ['', [Validators.required]],
      despriceAddress: ['', [Validators.required]],
    });
  }

  onAddRow() {
    const control = <FormArray>this.prItem.controls["allItem"];
    control.push(this.addMoreItems());
  }

}
