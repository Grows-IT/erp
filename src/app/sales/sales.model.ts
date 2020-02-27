import { SellItem } from '../invoice/invoice.model';

export class Quotation {
  constructor(
    public status: string,
    public customerName: string,
    public email: string,
    public quotationId: string,
    public date: Date,
    public expirationDate: Date,
    // public items: SellItem[],
    public invoiceId: string,
    // public count: number,
  ) { }
}

// export class Item {
//   constructor(
//     public name: string,
//     public quantity: number,
//     public price: number
//   ) { }
// }

// export class Item {
//   constructor(
//     public id: string,
//     public name: string,
//     public price: number,
//     public availableQuntity: number
//   ) { }
// }



