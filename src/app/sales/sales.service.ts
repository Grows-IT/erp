import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import 'rxjs/add/operator/map';
import { map, tap } from 'rxjs/operators';
import { BehaviorSubject, from, of } from 'rxjs';
import { Quotation, Item } from './sales.model';

interface QutotationResData {
  addressTo: string;
  customerId: string;
  date: Date;
  expirationDate: Date;
  isInvoice: boolean;
  item: string;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class SalesService {
  quotationList: AngularFireList<any>;
  private _quotations = new BehaviorSubject<Quotation[]>(null);

  get quotations() {
    return this._quotations.asObservable();
  }

  constructor(private http: HttpClient, private db: AngularFireDatabase) {
    this.quotationList = db.list('quotation');
  }

  addQuotation(quotation: any) {
    let data;

    const customer = {
      name: quotation.customerName,
      address: quotation.addressTo
    };
    this.http.post<any>(environment.siteUrl + '/customer.json', customer)
      .toPromise()
      .then(res => {
        console.log(res);
        data = {
          totalPrice: quotation.totalPrice,
          // by: quotation.by,
          customerId: res.name,
          date: quotation.date,
          expirationDate: quotation.expirationDate,
          item: quotation.allItem,
          isInvoice: false
        };
        return this.http.post(environment.siteUrl + '/quotation.json', data).subscribe();
      });
  }

  getQuotation() {
    return this.http.get<{ [key: string]: QutotationResData }>(environment.siteUrl + '/quotation.json').pipe(
      map(resData => {
        const quotations: Quotation[] = [];
        for (const key in resData) {
          if (resData.hasOwnProperty(key)) {
            const item = new Item(resData[key].item, resData[key].quantity, 200);
            const quotation = new Quotation(
              null,
              null,
              resData[key].customerId,
              null,
              key,
              resData[key].date,
              resData[key].expirationDate,
              resData[key].item,
              resData[key].isInvoice
            );
            quotations.push(quotation);
          }
        }
        console.log(quotations);

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

  createInvoice(quotation: any) {
    console.log(quotation);

    const data = {
      'id': '1',
      'quotationId': quotation.id,
      'customer': {
        'id': quotation.customerId,
        // 'name': quotation.customerName,
        // 'address': quotation.addressTo
      },
      'item': quotation.items,
      // {
      // 'name': 'apple',
      // 'quantity': '50'
      // },
      'subInvoices': ''
    };
    this.isInvoice(quotation.id);
    return this.http.put(environment.siteUrl + '/invoices/' + quotation.id + '.json', data);
  }

  isInvoice(id) {
    const data = {
      isInvoice: true
    };
    return this.http.patch(environment.siteUrl + '/quotation/' + id + '.json', data).subscribe();
  }
}
