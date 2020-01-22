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
    public subInvoices: SubInvoice[]
  ) { }

  toObject() {
    return {
      name: this.name,
      subInvoices: []
    };
  }
}

export class SubInvoice {
  constructor(
    public sellItems: SellItem[]
  ) { }
}

export class SellItem {
  constructor(
    public itemId: string,
    public quantity: number
  ) { }
}
