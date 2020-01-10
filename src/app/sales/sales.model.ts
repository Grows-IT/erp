import { Customer } from '../customer/customer.model';

export class Quotation {
  constructor(
    public totalPrice: number,
    public status: string,
    public customer: Customer,
    public by: string,
    public id: string,
    public date: Date,
    public expirationDate: Date,
    public items: Item[],
    public isInvoice: boolean,
  ) { }
}

export class Item {
  constructor(
    public name: string,
    public quantity: number
  ) { }
}

