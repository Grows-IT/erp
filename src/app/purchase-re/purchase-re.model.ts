export class PurchaseRe {
  constructor(
    public id: string,
    public POid: string,
    public PIid: string,
    public prName: string,
    public spId: string,
    public createdDate: string,
    public checkedDate: string,
    public DeliveryAddress: string,
    public status: string,
    public addiNote: string,
    public CreatedBy: string,
    public checkedBy: string
  ) { }
}

export class PurchaseItemOnly {
  constructor(
    public SiId: string,
    public quantity: string
  ) { }
}

export class PurchaseItem {
  constructor(
    public id: string,
    public siId: string,
    public POid: string,
    public PRid: string,
    public quantity: string,
    public discount: string,
    public shippingCost: string,
    public totalPrice: string
  ) { }
}
