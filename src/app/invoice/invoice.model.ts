import { Item } from '../sales/sales.model';

export class Invoice {
  constructor(
    public id: string,
    // public groupId: string,
    // public parrentId: string,
    public quotationId: string,
    public customer: Customer,
    public items: Item[],
    public subInvoices?: any[]
  ) { }
}

export class Customer {
  constructor(
    public id: string,
    public name: string,
    public address: string,
  ) { }
}
