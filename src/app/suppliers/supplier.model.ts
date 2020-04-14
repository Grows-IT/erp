export class Supplier {
  constructor(
    public id: string,
    public type: string,
    public name: string,
    public contactPerson: string,
    public address: string,
    public taxId: number
  ) { }
}
