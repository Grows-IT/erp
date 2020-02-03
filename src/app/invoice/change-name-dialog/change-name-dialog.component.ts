import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { InvoiceService } from '../invoice.service';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-change-name-dialog',
  templateUrl: './change-name-dialog.component.html',
  styleUrls: ['./change-name-dialog.component.scss']
})
export class ChangeNameDialogComponent implements OnInit {
  newNameGroup: FormGroup;
  _data: any;

  constructor(public dialogRef: MatDialogRef<ChangeNameDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
    private invoiceService: InvoiceService) {
    this._data = data;
  }

  ngOnInit() {
    this.newNameGroup = new FormGroup({
      name: new FormControl(null, [Validators.required]),
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  changeGroupName(newName) {
    this.invoiceService.changeGroupName(this._data.id, this._data.index, newName).pipe(
      tap(() => this.dialogRef.close())
    ).subscribe();
  }

}
