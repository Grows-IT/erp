import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject } from "rxjs";
import { environment } from "src/environments/environment";
import { map, tap } from "rxjs/operators";
import { SupplierItems } from './supplieritems.model';

interface SupplierItemResData {
  type: string;
  name: string;
  price: string;
  description: string;
}

@Injectable({
  providedIn: "root"
})

export class SupplierItemService {
  private _supplieritems = new BehaviorSubject<SupplierItems[]>(null);

  get supplieritem() {
    return this._supplieritems.asObservable();
  }

  constructor(private http: HttpClient) {}

  addSupItem(values: any){
    const value = {
      type: values.type,
      name: values.name,
      price: values.price,
      description: values.description
    };
    return this.http.post(environment.erpUrl + '/supplieritem', value);
  }
  getSupItem(){
    return this.http.get(environment.erpUrl + '/supplieritem').pipe(
      map(resItem => {
        // console.log(resItem);
        const suppliersitems: SupplierItems[] = [];

        for (const key in resItem) {
          if (resItem.hasOwnProperty(key)) {
            const supplierIt = new SupplierItems(
              resItem[key].SiId,
              resItem[key].SId,
              resItem[key].type,
              resItem[key].name,
              resItem[key].price,
              resItem[key].description
            );
            suppliersitems.push(supplierIt);
          }
        }
        return suppliersitems;
      }),
      tap(supplieritem => {
        this._supplieritems.next(supplieritem);
      })
    );
  }

  updateSupIt(info: any, id: any) {
    const data = {
      type: info.type,
      name: info.name,
      price: info.price,
      description: info.description,
      SiId: id
    };
    // console.log(user.role);

    return this.http.patch(environment.erpUrl + '/supplieritem', data);
  }

  deleteSupIt(id: string) {
    let data;
    data = {
      SiId: id
    };
    console.log(id);

    return this.http.post(environment.erpUrl + '/deletesupIt', data);
  }
}
