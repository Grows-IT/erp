import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import 'rxjs/add/operator/map';
import { map, tap, switchMap, withLatestFrom } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { Quotation } from './sales.model';
import { SellItem } from '../invoice/invoice.model';
import { ItemsService } from '../items/items.service';

interface QutotationResData {
  addressTo: string;
  customerId: string;
  date: Date;
  expirationDate: Date;
  invoiceId: string;
  items: SellItem[];
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

  constructor(private http: HttpClient, private itemsService: ItemsService) {
  }

  addQuotation(quotation: any) {
    let data;

    const customer = {
      name: quotation.customerName,
      address: quotation.addressTo
    };
    return this.http.post<any>(environment.siteUrl + '/customer.json', customer).pipe(
      withLatestFrom(this.itemsService.items),
      switchMap(([res, items]) => {
        const sellItems: SellItem[] = [];
        quotation.allItem.forEach(itemInput => {
          const item = items.find(it => it.name === itemInput.item);
          const sellItem = new SellItem(item.id, itemInput.quantity);
          sellItems.push(sellItem);
        });
        data = {
          totalPrice: quotation.totalPrice,
          // by: quotation.by,
          customerId: res.name,
          date: quotation.date,
          expirationDate: quotation.expirationDate,
          items: sellItems,
          invoiceId: ''
        };
        return this.http.post(environment.siteUrl + '/quotation.json', data);
      })
    );
  }

  getQuotation() {
    return this.http.get<{ [key: string]: QutotationResData }>(environment.siteUrl + '/quotation.json').pipe(
      withLatestFrom(this.itemsService.items),
      map(([resData, items]) => {
        const quotations: Quotation[] = [];
        for (const key in resData) {
          if (resData.hasOwnProperty(key)) {
            const allItem: SellItem[] = [];
            // const resItems = resData[key].items;
            // resData[key].items.forEach(itemInput => {
            //   const findItem = items.find(it => it.id === itemInput.itemId);
            //   const item = new SellItem(findItem.name, itemInput.quantity);
            //   allItem.push(item);
            // });
            // for (let i = 0; i < resData[key].items.length; i++) {
            //   const findItem = items.find(it => it.id === resItems[i].itemId);
            //   const item = new SellItem(findItem.name, resData[key].items[i].quantity);
            //   allItem.push(item);
            // }

            for (let i = 0; i < resData[key].items.length; i++) {
              const item = new SellItem(resData[key].items[i].itemId, resData[key].items[i].quantity);
              allItem.push(item);
            }

            const quotation = new Quotation(
              null,
              null,
              resData[key].customerId,
              null,
              key,
              resData[key].date,
              resData[key].expirationDate,
              allItem,
              resData[key].invoiceId
            );
            quotations.push(quotation);
          }
        }
        return quotations;
      }),
      tap(quotations => {
        console.log(quotations);
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
