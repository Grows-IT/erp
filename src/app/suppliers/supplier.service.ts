import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject } from "rxjs";
import { environment } from "src/environments/environment";
import { map, tap } from "rxjs/operators";
import { Supplier } from "./supplier.model";

interface SupplierResData {
  type: string;
  name: string;
  contactPerson: string;
  address: string;
  taxId: number;
}

@Injectable({
  providedIn: "root"
})
export class SupplierService {
  private _supplier = new BehaviorSubject<Supplier[]>(null);

  get supplier() {
    return this._supplier.asObservable();
  }

  constructor(private http: HttpClient) {}

  addSupplier(value: any) {
    console.log(value);

    const values = {
      type: value.type,
      name: value.name,
      address: value.address,
      contactPerson: value.contactPerson,
      taxId: value.taxId
    };
    return this.http.post(environment.erpUrl + '/supplier', values);
  }

  getAllSuppliers() {
    return this.http.get(environment.erpUrl + '/supplier').pipe(
      map(resItem => {
        // console.log(resItem);
        const suppliers: Supplier[] = [];

        for (const key in resItem) {
          if (resItem.hasOwnProperty(key)) {
            const supplier = new Supplier(
              resItem[key].supplierId,
              resItem[key].type,
              resItem[key].name,
              resItem[key].address,
              resItem[key].contactPerson,
              resItem[key].taxId
            );
            suppliers.push(supplier);
          }
        }
        return suppliers;
      }),
      tap(suppliers => {
        this._supplier.next(suppliers);
      })
    );
  }

  updateSupplier(value: any, id: string) {
    const data = {
      type: value.type,
      name: value.name,
      address: value.address,
      contactPerson: value.contactPerson,
      taxId: value.taxId,
      supplierId: id,
    }
    return this.http.patch(environment.erpUrl + '/supplier', data);
  }

  deleteSupplier(id: string) {
    const data = {
      supplierId: id
    };
    console.log(data);
    return this.http.post(environment.erpUrl + "/deletesupplier/", data);
  }
}
