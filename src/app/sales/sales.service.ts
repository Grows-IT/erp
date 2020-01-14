import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import 'rxjs/add/operator/map';
import { map, tap, switchMap } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { Quotation } from './sales.model';
import { SellItem } from '../invoice/invoice.model';

interface QutotationResData {
  addressTo: string;
  customerId: string;
  date: Date;
  expirationDate: Date;
  invoiceId: string;
  item: string;
  quantity: number;
}

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
export class SalesService {
  private _quotations = new BehaviorSubject<Quotation[]>(null);

  get quotations() {
    return this._quotations.asObservable();
  }

  constructor(private http: HttpClient) {
  }

  addQuotation(quotation: any) {
    let data;

    const customer = {
      name: quotation.customerName,
      address: quotation.addressTo
    };
    return this.http.post<any>(environment.siteUrl + '/customer.json', customer).pipe(
      switchMap(res => {
        console.log(res);
        data = {
          totalPrice: quotation.totalPrice,
          // by: quotation.by,
          customerId: res.name,
          date: quotation.date,
          expirationDate: quotation.expirationDate,
          item: quotation.allItem,
          invoiceId: ''
        };
        return this.http.post(environment.siteUrl + '/quotation.json', data);
      })
    );
  }

  getQuotation() {
    return this.http.get<{ [key: string]: QutotationResData }>(environment.siteUrl + '/quotation.json').pipe(
      map(resData => {
        const quotations: Quotation[] = [];
        for (const key in resData) {
          if (resData.hasOwnProperty(key)) {
            const item = new SellItem(resData[key].item, resData[key].quantity);
            const quotation = new Quotation(
              null,
              null,
              resData[key].customerId,
              null,
              key,
              resData[key].date,
              resData[key].expirationDate,
              resData[key].item,
              resData[key].invoiceId
            );
            quotations.push(quotation);
          }
        }
        return quotations;
      }),
      tap(quotations => {
        this._quotations.next(quotations);
      })
    );
  }

  deleteQuotation(id: string) {
    return this.http.delete(environment.siteUrl + '/quotation/' + id + '.json');
  }

  updateQuotation(quotation: any, id: string) {
    const data = {
      addressTo: quotation.addressTo,
      date: quotation.date,
      expirationDate: quotation.expirationDate,
      item: quotation.allItem,
      quantity: quotation.quantity
    };
    return this.http.patch(environment.siteUrl + '/quotation/' + id + '.json', data);
  }
}
