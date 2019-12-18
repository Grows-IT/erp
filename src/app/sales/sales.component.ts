import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { QuotationDialogComponent } from './quotation-dialog/quotation-dialog.component';
import { SalesService } from './sales.service';
import { LOADIPHLPAPI } from 'dns';

export interface DialogData {
  animal: string;
  name: string;
}

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.scss']
})
export class SalesComponent implements OnInit {
  quotation: any;

  constructor(public dialog: MatDialog, private salesService: SalesService) { }

  ngOnInit() {
    this.salesService.getQuotation().subscribe(data => {
      this.quotation = data;
      console.log(this.quotation);
    });

  }

  openInvoice() {
    const dialogRef = this.dialog.open(QuotationDialogComponent, {
      width: '60vw',
      height: '70vh',
      disableClose: true,
      autoFocus: false
    });
    // dialogRef.afterClosed().subscribe(result => {
    //   console.log('The dialog was closed');
    // });
  }

}
