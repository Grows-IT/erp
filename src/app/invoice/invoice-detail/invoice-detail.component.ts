import { Component, OnInit } from '@angular/core';
import { InvoiceService } from '../invoice.service';
import { Invoice, Customer } from '../invoice.model';
import { Item } from 'src/app/sales/sales.model';
import { ActivatedRoute } from '@angular/router';
import { InvoiceDialogComponent } from '../invoice-dialog/invoice-dialog.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-invoice-detail',
  templateUrl: './invoice-detail.component.html',
  styleUrls: ['./invoice-detail.component.scss']
})
export class InvoiceDetailComponent implements OnInit {
  expandedElement;
  invoiceCol: string[] = ['item', 'quantity', 'price'];
  mainInvoices: any;
  subInvoice: any = [];
  // mainInvoices: Invoice;
  //  = new Invoice('1', '1', new Customer('c1', 'Jeff', 'BKK'), [new Item('apple', 50)],
  //   [
  //     [
  //       new Invoice('2', '1', new Customer('c1', 'Jeff', 'BKK'), [new Item('banana', 1)]),
  //       new Invoice('3', '1', new Customer('c1', 'Jeff', 'BKK'), [new Item('carrot', 1)]),
  //     ],
  //     [
  //       new Invoice('4', '1', new Customer('c1', 'Jeff', 'BKK'), [new Item('banana', 11)]),
  //       new Invoice('5', '1', new Customer('c1', 'Jeff', 'BKK'), [new Item('carrot', 12)]),
  //     ]
  //   ]);

  constructor(private invoiceService: InvoiceService, private activatedRoute: ActivatedRoute, public dialog: MatDialog) { }

  ngOnInit() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    this.invoiceService.getSubInvioce(id).subscribe((res) => {
      console.log(res);

      if (res.subInvoices !== null && res.subInvoices !== undefined) {
        Object.keys(res.subInvoices).map(key => {
          this.subInvoice.push(res.subInvoices[key]);
        });
      }
      console.log(this.subInvoice);

      this.mainInvoices = res;
    });
  }

  opnePdf(id) {

  }

  openAddDialog() {
    const dialogRef = this.dialog.open(InvoiceDialogComponent, {
      width: '60vw',
      height: '70vh',
      disableClose: true,
      autoFocus: false,
      // data: item
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.length === 0) {
        return;
      }

      const id = this.activatedRoute.snapshot.paramMap.get('id');

      if (this.mainInvoices.subInvoices === undefined || this.mainInvoices.subInvoices === null) {
        this.invoiceService.addSubInvoice(result, id).subscribe();
      } else {
        this.invoiceService.addSubInvoice(result, id).subscribe(() => {
          this.subInvoice.push(result);
        });
      }
    });
  }
}
