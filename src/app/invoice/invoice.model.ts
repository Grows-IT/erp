export class Invoice {
  constructor(
    public id: string,
    public quotationId: string,
    public customerId: string,
    public type: string,
    public items: SellItem[],
    public group?: InvoiceGroup[]
  ) { }
}

export class InvoiceGroup {
  constructor(
    public name: string,
    public subInvoiceIds: string[]
  ) { }
}

export class SellItem {
  constructor(
    public itemId: string,
    public quantity: number
  ) { }
}
