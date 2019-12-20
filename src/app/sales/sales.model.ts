export class Quotation {
  constructor(
    public id: string,
    public addressTo: string,
    public date: Date,
    public expirationDate: Date,
    public items: Item[]
  ) { }
}

export class Item {
  constructor(
    public name: string,
    public quantity: number
  ) { }
}
