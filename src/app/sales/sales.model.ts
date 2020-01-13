export class Quotation {
  constructor(
    public totalPrice: number,
    public status: string,
    public customerId: string,
    public by: string,
    public id: string,
    public date: Date,
    public expirationDate: Date,
    public items: string,
    public isInvoice: boolean,
  ) { }
}

export class Item {
  constructor(
    public name: string,
    public quantity: number,
    public price: number
  ) { }
}

// export class Item {
//   constructor(
//     public id: string,
//     public name: string,
//     public price: number,
//     public availableQuntity: number
//   ) { }
// }



