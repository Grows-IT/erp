export class Quotation {
  constructor(
    public totalPrice: number,
    public status: string,
    public customerName: string,
    public by: string,
    public id: string,
    public addressTo: string,
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

