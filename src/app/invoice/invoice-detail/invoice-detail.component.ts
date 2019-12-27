import { Component, OnInit } from '@angular/core';
import { InvoiceService } from '../invoice.service';
import { SalesService } from 'src/app/sales/sales.service';
import { Invoice, Customer } from '../invoice.model';
import { Item } from 'src/app/sales/sales.model';

@Component({
  selector: 'app-invoice-detail',
  templateUrl: './invoice-detail.component.html',
  styleUrls: ['./invoice-detail.component.scss']
})
export class InvoiceDetailComponent implements OnInit {
  expandedElement;
  groupId;
  arr: any[];
  invoiceCol: string[] = ['no', 'customerName'];
  invoices: Invoice[] = [
    new Invoice('1', null, null, '1', new Customer('c1', 'Jeff', 'BKK'), [new Item('apple', 50)]),
    new Invoice('2', 'a', '1', '1', new Customer('c1', 'Jeff', 'BKK'), [new Item('banana', 1)]),
    new Invoice('3', 'a', '1', '1', new Customer('c1', 'Jeff', 'BKK'), [new Item('carrot', 1)]),

    new Invoice('4', 'b', '1', '1', new Customer('c1', 'Jeff', 'BKK'), [new Item('banana', 11)]),
    new Invoice('5', 'b', '1', '1', new Customer('c1', 'Jeff', 'BKK'), [new Item('carrot', 12)]),
  ];
  groupBy;

  constructor(private invoiceService: InvoiceService, private salesService: SalesService) { }

  ngOnInit() {
    // const key = 'filter';
    this.groupId = this.invoices.reduce((obj, item) => {
      obj[item.groupId] = obj[item.groupId] || [];
      obj[item.groupId].push(item);
      // console.log(obj[item.groupId]);

      // obj[key].isArray(obj[item.groupId]);

      // this.arr.push(item.groupId);
      // === this.arr[this.arr.length] ? [] : item.groupId
      return obj;
    });

    console.log(this.groupId);
    this.groupBy = this.groupId.a;
  }

  opnePdf(id) {

  }


}
