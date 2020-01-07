// import { Component, OnInit, Inject } from '@angular/core';
// import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
// import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';

// @Component({
//   selector: 'app-invoice-dialog',
//   templateUrl: './invoice-dialog.component.html',
//   styleUrls: ['./invoice-dialog.component.scss']
// })
// export class InvoiceDialogComponent implements OnInit {
//   addForm: FormGroup;
//   rows: FormArray;

//   constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<InvoiceDialogComponent>, private fb: FormBuilder) {
//     this.addForm = this.fb.group({
//       items: [null, Validators.required],
//       items_value: ['no', Validators.required]
//     });
//     this.rows = this.fb.array([]);
//   }

//   ngOnInit() {
//     this.addForm.addControl('rows', this.rows);
//   }

//   onAddRow() {
//     this.rows.push(this.createItemFormGroup());
//   }

//   onRemoveRow(rowIndex: number) {
//     this.rows.removeAt(rowIndex);
//   }

//   createItemFormGroup(): FormGroup {
//     return this.fb.group({
//       name: new FormControl(null, [Validators.required]),
//       quantity: new FormControl(null, [Validators.required]),
//       price: new FormControl(null, [Validators.required])
//     });

//   }

//   onConfirmClick(status) {
//     // if (status === 0) {
//     //   this.createTable();
//     // }
//     console.log(this.rows.value);

//     this.dialogRef.close(this.rows.value);
//   }
// }
