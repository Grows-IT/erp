import { Component, OnInit } from '@angular/core';
import { InvoiceService } from '../invoice.service';
import { SalesService } from 'src/app/sales/sales.service';
import { Invoice, Customer } from '../invoice.model';
import { Item } from 'src/app/sales/sales.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-invoice-detail',
  templateUrl: './invoice-detail.component.html',
  styleUrls: ['./invoice-detail.component.scss']
})
export class InvoiceDetailComponent implements OnInit {
  expandedElement;
  invoiceCol: string[] = ['item', 'quantity'];
  mainInvoices: Invoice;
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

  constructor(private invoiceService: InvoiceService, private salesService: SalesService, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    this.invoiceService.getSubInvioce(id).subscribe((val) => {
      this.mainInvoices = val;
    });
  }

  opnePdf(id) {

  }


}
