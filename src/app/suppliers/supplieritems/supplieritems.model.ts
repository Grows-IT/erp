export class SupplierItems {
  constructor(
    public SiId: string,
    public supplierId: string,
    public type: string,
    public name: string,
    public price: string,
    public description: string
  ) { }
}
