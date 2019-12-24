import { Component, OnInit } from '@angular/core';
import { InvoiceService } from './invoice.service';
import { SalesService } from '../sales/sales.service';
import { Quotation } from '../sales/sales.model';

export interface InvoiceList {
  addressTo: string;
  date: Date;
  expirationDate: Date;
  item: string;
  quantity: number;
}

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss']
})
export class InvoiceComponent implements OnInit {
  invoices: Quotation[];
  invoicesCol: string[] = ['addressTo', 'date', 'expirationDate', 'item', 'quantity', 'pdf', 'delete'];

  constructor(private invoiceService: InvoiceService, private salesService: SalesService) { }

  ngOnInit() {
    this.salesService.quotations.subscribe(invoices => {
      if (invoices === null) {
        return;
      }

      this.invoices = invoices.filter(val => {
        return val.isInvoice === true;
      });
    });
    this.salesService.getQuotation().subscribe();
  }

  delete(id) {
    this.invoiceService.deleteInvoice(id).subscribe();
  }

  opnePdf() {

  }

}
