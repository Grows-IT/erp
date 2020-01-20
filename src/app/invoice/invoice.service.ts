import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Invoice, SellItem, InvoiceGroup } from './invoice.model';
import { BehaviorSubject } from 'rxjs';
import { tap, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { ItemsService } from '../items/items.service';
import { Quotation } from '../sales/sales.model';

interface InvoiceResData {
  id: string;
  quotationId: string;
  customerId: string;
  type: string;
  items: SellItem[];
  subInvoice: string;
  group?: InvoiceGroup[];
}

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  // invoiceList: any[];
  private _invoice = new BehaviorSubject<Invoice[]>(null);

  get invoices() {
    return this._invoice.asObservable();
  }

  constructor(private http: HttpClient, private itemsService: ItemsService) {
  }

  // get all แล้วก็ส่ง id sub invoice ให้ถูก

  getAllInvoice() {
    return this.http.get<{ [key: string]: InvoiceResData }>(environment.siteUrl + '/invoices.json').pipe(
      withLatestFrom(this.itemsService.items),
      map(([resData, items]) => {
        const invoices: Invoice[] = [];
        for (const key in resData) {
          if (resData.hasOwnProperty(key)) {
            const allItem: SellItem[] = [];
            for (let i = 0; i < resData[key].items.length; i++) {
              const item = new SellItem(resData[key].items[i].itemId, resData[key].items[i].quantity);
              allItem.push(item);
            }
            const invoice = new Invoice(
              key,
              resData[key].quotationId,
              resData[key].customerId,
              resData[key].type,
              allItem,
              null
            );
            invoices.push(invoice);
          }
        }
        return invoices;
      }),
      tap(invoices => {
        console.log(invoices);
        this._invoice.next(invoices);
      })
    );

    // map(resData => {
    //   console.log(resData);

    // const invoices: Invoice[] = [];
    // for (const key in resData) {
    //   if (resData.hasOwnProperty(key)) {
    //     const item = new SellItem(resData[key].item, resData[key].quantity);
    //     const invoice = new Invoice(
    //       key,
    //       resData[key].quotationId,
    //       resData[key].customerId,
    //       resData[key].item,
    //     );
    //     invoices.push(invoice);
    //   }
    // }
    // console.log(invoices);
    // return invoices;
    //   }),
    //   tap(invoices => {
    //     console.log(invoices);

    //     // this._invoice.next(invoices);
    //   })
    // );
    //     )
  }

  createInvoice(quotation: any, type: string) {
    const data = {
      'quotationId': quotation.id,
      'customerId': quotation.customerId,
      'items': quotation.items,
      'type': type,
    };

    return this.http.post<{ [key: string]: InvoiceResData }>(environment.siteUrl + '/invoices.json', data).pipe(
      switchMap((key) => {
        return this.http.patch(environment.siteUrl + '/quotation/' + quotation.id + '.json', { 'invoiceId': key.name });
      })
    );
  }

  deleteInvoice(invoiceId: string, quotationId: string) {
    return this.http.delete(environment.siteUrl + '/invoices/' + invoiceId + '.json').pipe(
      switchMap(() => {
        return this.http.patch(environment.siteUrl + '/quotation/' + quotationId + '.json', { 'invoiceId': '' });
      })
    );
  }

  // getSubInvioce(id) {
  //   return this.http.get<Invoice>(environment.siteUrl + '/invoices/' + id + '.json')
  //     .pipe(tap(data => {
  //       this._subInvoice.next(data);
  //     }));
  //   // return this.http.get<Invoice>(environment.siteUrl + '/invoices/-LxZdDePB4WEbHuNNoeU' + '.json');
  // }

  addSubInvoice(data, id) {
    console.log(data);

    // return this.http.put(environment.siteUrl + '/invoices/' + id + '/subInvoices/.json', [data]);
    return this.http.post(environment.siteUrl + '/invoices/' + id + '/subInvoices/.json', data);
  }

  addGroupName() {

  }

}


