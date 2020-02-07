export class Invoice {
  constructor(
    public id: string,
    public quotationId: string,
    public customerId: string,
    public type: string,
    public items: SellItem[],
    public count: number,
    public status: string,
    public email: string,
    public receip: Date,
    public group?: InvoiceGroup[],
  ) { }
}

export class InvoiceGroup {
  constructor(
    public name: string,
    public subInvoices: SubInvoice[],
    public status: string
  ) { }

  toObject() {
    return {
      name: this.name,
      subInvoices: [],
    };
  }
}

export class SubInvoice {
  constructor(
    public subInvoiceId: string,
    public name: string,
    public sellItems: SellItem[],
    public status: string
  ) { }
}

export class SellItem {
  constructor(
    public itemId: string,
    public quantity: number
  ) { }
}
