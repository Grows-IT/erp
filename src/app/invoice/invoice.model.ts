export class Invoice {
  constructor(
    public id: string,
    public quotationId: string,
    public customerId: string,
    public sellItemId: string,
    public sellItemQuantity: string,
    public status: string,
    public email: string,
    public createdReceiptDate: Date,
  ) { }
}

export class Group {
  constructor(
    public id: string,
    public subInvoice: number,
    public invoiceId: number,
    public groupName: string,
    public invoiceGroupStatus: string,
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
    public quantity: string
  ) { }
}
