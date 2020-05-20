import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map, tap, switchMap } from 'rxjs/operators';
import { PurchaseRe, PurchaseItem, PurchaseItemOnly } from './purchase-re.model';
import { AuthService } from '../signin/auth.service';
import { SupplierItemService } from '../suppliers/supplieritems/supplieritems.service';
import { SupplierService } from '../suppliers/supplier.service';
import { Supplier } from '../suppliers/supplier.model';

interface PurchaseReResData {
  prName: string;
  spName: string;
  spAddress: string;
  desAddress: string;
  addiNote: string;
  type: string;
  itName: string;
  quantity: string;
}

@Injectable({
  providedIn: 'root'
})
export class PRService {
  private _purchasere = new BehaviorSubject<PurchaseRe[]>(null);
  private _purchaseit = new BehaviorSubject<PurchaseItem[]>(null);

  get purchasere() {
    return this._purchasere.asObservable();
  }

  get purchaseit() {
    return this._purchaseit.asObservable();
  }

  constructor(
    private http: HttpClient,
    private SiService: SupplierItemService,
    private auth: AuthService,
    private supplierService: SupplierService
  ) { }

  addPR(data: any) {
    let createdEmail;
    // return this.auth.getCurrentEmail().pipe(
    //   switchMap(res => {
    //     createdEmail = res;

    //     const alldata = {
    //       POid: '',
    //       items: JSON.stringify(data.allPRItem),
    //       prName: data.prName,
    //       spName: data.spName,
    //       createdDate: '', // timestamp
    //       checkedDate: '',
    //       DeliveryAddress: data.desAddress,
    //       status: 'waiting for approved',
    //       addiNote: data.addiNote,
    //       createdBy: createdEmail,
    //       checkedBy: '',
    //       shippingCost: data.shipCost,
    //       // totalPrice: data.allPRItem.totalPrice
    //     };
    //     console.log(alldata);


    //     return this.http.post(environment.erpUrl + '/pr', alldata);
    //   })
    // );

    return this.auth.getCurrentEmail().pipe(
      switchMap(res => {
        createdEmail = res;
        return this.SiService.supplieritem;
      }),
      switchMap(supplieritem => {
        const ItemsId: string[] = [];
        const ItemsQuantity: string[] = [];
        data.allPRItem.forEach(itemInput => {
          const item = supplieritem.find(it => it.name === itemInput.itName);

          ItemsId.push(item.SiId);
          ItemsQuantity.push(itemInput.quantity);
        });

        const purchaseItems: PurchaseItemOnly = new PurchaseItemOnly(
          JSON.stringify(ItemsId).replace(/[\[\]']+/g, ''),
          JSON.stringify(ItemsQuantity).replace(/[\[\]']+/g, '')
        );
        const alldata = {
          POid: '',
          items: purchaseItems,
          prName: data.prName,
          spName: data.spName,
          createdDate: '', // timestamp
          checkedDate: '',
          DeliveryAddress: data.desAddress,
          status: 'waiting for approved',
          addiNote: data.addiNote,
          createdBy: createdEmail,
          checkedBy: '',
          shippingCost: data.shipCost,
          // totalPrice: toltalPrice
        };
        console.log(alldata);


        return this.http.post(environment.erpUrl + '/pr', alldata);
      })
    );
  }

  getPR() {
    return this.http.get(environment.erpUrl + '/pr').pipe(
      map(resItem => {
        // console.log(resItem);
        const purchasere: PurchaseRe[] = [];

        for (const key in resItem) {
          if (resItem.hasOwnProperty(key)) {
            const purRe = new PurchaseRe(
              resItem[key].PRId,
              resItem[key].POId,
              resItem[key].PiId,
              resItem[key].PRName,
              resItem[key].SId,
              resItem[key].CreatedDate,
              resItem[key].CheckedDate,
              resItem[key].DeliveryAddress,
              resItem[key].Status,
              resItem[key].AdditionalNotePR,
              resItem[key].createdBy,
              resItem[key].checkedBy
            );
            purchasere.push(purRe);
          }
        }
        return purchasere;
      }),
      tap(pr => {
        this._purchasere.next(pr);
      })
    );
  }

  getPurchaseItem() {
    return this.http.get(environment.erpUrl + '/purchaseitem').pipe(
      map(resItem => {
        // console.log(resItem);
        const purchaseitem: PurchaseItem[] = [];

        for (const key in resItem) {
          if (resItem.hasOwnProperty(key)) {
            const purIt = new PurchaseItem(
              resItem[key].PiId,
              resItem[key].SiId,
              resItem[key].POId,
              resItem[key].PRId,
              resItem[key].quantity,
              resItem[key].discount,
              resItem[key].shippingCost,
              resItem[key].totalPrice,
            );
            purchaseitem.push(purIt);
          }
        }

        return purchaseitem;
      }),
      tap(pi => {
        this._purchaseit.next(pi);
      })
    );
  }

  updateStatus(upstatus: any, id: number) {
    return this.auth.getCurrentEmail().pipe(
      map(res => {
        const checkedEmail = res;
        const data = {
          status: upstatus,
          PRid: id,
          checkedBy: checkedEmail
        };

        return this.http.patch(environment.erpUrl + '/updateStatusPr', data).subscribe();
      }));
  }

  updatePR(data: any, id: string, PiId: number) {
    let createdEmail;
    return this.auth.getCurrentEmail().pipe(
      switchMap(res => {
        createdEmail = res;
        return this.SiService.supplieritem;
      }),
      switchMap(items => {
        const purchaseItemsId: string[] = [];
        const purchaseItemsQuantity: number[] = [];
        let supplier: Supplier;

        data.allPRItem.forEach(itemInput => {
          const item = items.find(it => it.name === itemInput.itName);
          purchaseItemsId.push(item.SiId);
          purchaseItemsQuantity.push(+itemInput.quantity);
        });

        this.supplierService.supplier.forEach(sups => {
          supplier = sups.find(sup => sup.name === data.spName);
          console.log(supplier);

          if (!supplier) {
            return 'not found supplier';
          }
        });

        const purchaseItems: PurchaseItemOnly = new PurchaseItemOnly(
          JSON.stringify(purchaseItemsId).replace(/[\[\]']+/g, ''),
          JSON.stringify(purchaseItemsQuantity).replace(/[\[\]']+/g, '')
        );
        // console.log(data);
        const alldata = {
          PRid: id,
          items: purchaseItems,
          prName: data.prName,
          spName: data.spName,
          DeliveryAddress: data.desAddress,
          addiNote: data.addiNote,
          shippingCost: data.shipCost,
          piId: PiId,
          sId: supplier.id
        };
        // console.log(alldata);

        return this.http.patch(environment.erpUrl + '/pr', alldata);
      })
    );
  }

  deletePR(id: string) {
    const data = {
      prId: id
    };
    return this.http.post(environment.erpUrl + '/deletepr', data);
  }
}
