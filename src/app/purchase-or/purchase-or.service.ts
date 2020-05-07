import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject } from "rxjs";
import { environment } from "src/environments/environment";
import { map, tap, switchMap } from "rxjs/operators";
import { PurchaseOr } from './purchase-or.model';

interface PurchaseOrResData {
  prName: string;
  spName: string;
}

@Injectable({
  providedIn: "root"
})

export class POService {
  private _purchaseor = new BehaviorSubject<PurchaseOr[]>(null);

  get purchaseor() {
    return this._purchaseor.asObservable();
  }

  constructor(
    private http: HttpClient,
  ) {}

  // createPO(data: any){
  //   const alldata = {
  //     PRid : data.id,
  //     SId: data.spId,
  //     prName: data.prName,
  //     status: "contacting vendor",
  //   }
  //   return this.http.post(environment.erpUrl + "/createpo", alldata);
  // }

  getPO() {
    return this.http.get(environment.erpUrl + "/po").pipe(
      map(resItem => {
        // console.log(resItem);
        const purchaseor: PurchaseOr[] = [];

        for (const key in resItem) {
          if (resItem.hasOwnProperty(key)) {
            const purOr = new PurchaseOr(
              resItem[key].POId,
              resItem[key].PRId,
              resItem[key].SId,
              resItem[key].PRName,
              resItem[key].createdDate,
              resItem[key].finishedDate,
              resItem[key].Status,
              resItem[key].additionalNotePO,
            );
            purchaseor.push(purOr);
          }
        }
        return purchaseor;
      }),
      tap(po => {
        this._purchaseor.next(po);
      })
    );
  }

  updateStatus(upstatus: any, id: any){
    const data = {
      status: upstatus,
      POid: id
    };
    console.log(data);

    return this.http.patch(environment.erpUrl + "/updatestatuspo", data);
  }

}
