import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Invoice, SellItem } from './invoice.model';
import { BehaviorSubject } from 'rxjs';
import { tap, map } from 'rxjs/operators';

interface InvoiceResData {
  customerId: string;
  id: string;
  item: SellItem;
  quotationId: string;
  subInvoice: string;
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

  constructor(private http: HttpClient) {
  }

  // get all แล้วก็ส่ง id sub invoice ให้ถูก

  getAllInvoice() {
    return this.http.get<{ [key: string]: InvoiceResData }>(environment.siteUrl + '/invoices.json').pipe(
      map(resData => {
        console.log(resData);

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
      }),
      tap(invoices => {
        console.log(invoices);

        // this._invoice.next(invoices);
      })
    );
  }

  createInvoice(quotation: any, type: string) {
    const data = {
      'quotationId': quotation.id,
      'customerId': quotation.customerId,
      'items': quotation.items,
      'type': type,
    };
    // const item = {
    //   items: new SellItem(quotation.items)
    // }
    // return this.http.post(environment.siteUrl + 'items.json', )
    // return this.http.put(environment.siteUrl + '/invoices.json', data);
    return this.http.post<{ [key: string]: InvoiceResData }>(environment.siteUrl + '/invoices.json', data);
  }

  deleteInvoice(invoiceId: string, quotationId: string) {
    return this.http.delete(environment.siteUrl + '/invoices/' + invoiceId + '.json').pipe(
      map(() => {
        return this.http.patch(environment.siteUrl + '/quotation/' + quotationId + '.json', { invoiceId: '' }).subscribe();
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

}


