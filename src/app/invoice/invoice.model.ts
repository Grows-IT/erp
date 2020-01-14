import { Item } from '../sales/sales.model';
import { Customer } from '../customer/customer.model';

export class Invoice {
  constructor(
    public id: string,
    public quotationId: string,
    public customer: Customer,
    public items: Item[],
    public subInvoices: Item[]
  ) { }
}


export class SellItem {
  constructor(
    public itemId: string,
    public quantity: number
  ) { }
}
