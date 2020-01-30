import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import 'rxjs/add/operator/map';
import { map, tap, switchMap, withLatestFrom } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { Quotation } from './sales.model';
import { SellItem } from '../invoice/invoice.model';
import { ItemsService } from '../items/items.service';
import { InvoiceService } from '../invoice/invoice.service';
import { Customer } from 'src/app/customer/customer.model';
import { CustomerService } from 'src/app/customer/customer.service';
import { AuthService } from '../signin/auth.service';
import { throwMatDialogContentAlreadyAttachedError } from '@angular/material';

interface QuototationResData {
  addressTo: string;
  customerId: string;
  date: Date;
  email: string;
  expirationDate: Date;
  invoiceId: string;
  items: SellItem[];
  quantity: number;
  count: number;
}

interface InvoiceResData {
  customerId: string;
  id: string;
  item: SellItem;
  quotationId: string;
  subInvoice: string;
}

interface QuotationCount {
  count: number;
}

@Injectable({
  providedIn: 'root'
})
export class SalesService {
  private _quotations = new BehaviorSubject<Quotation[]>(null);

  get quotations() {
    return this._quotations.asObservable();
  }

  constructor(private http: HttpClient, private itemsService: ItemsService, private invoiceService: InvoiceService, private cService: CustomerService, private auth: AuthService) {
  }

  addQuotation(inputs: any) {
    let data;
    let cusEmail: string;
    let count: number;
    let customer: Customer;
    return this.auth.getUserFormStorage().pipe(
      switchMap(res => {
        cusEmail = res.email;
        return this.updateCountQuotation();
      }),
      switchMap(quotationCount => {
        count = quotationCount.count;
        return this.cService.customers;
      }),
      switchMap(customers => {
        customer = customers.find(cus => cus.name === inputs.customerName);
        return this.itemsService.items;
      }),
      switchMap(items => {
        const sellItems: SellItem[] = [];
        inputs.allItem.forEach(itemInput => {
          const item = items.find(it => it.name === itemInput.item);
          const sellItem = new SellItem(item.id, itemInput.quantity);
          sellItems.push(sellItem);
        });
        data = {
          email: cusEmail,
          customerId: customer.id,
          date: inputs.date,
          expirationDate: inputs.expirationDate,
          items: sellItems,
          count: count,
          invoiceId: ''
        };
        return this.http.post(environment.siteUrl + '/quotation.json', data);
      })
    );
  }

  // addQuotation(quotation: any) {
  //   let data;

  //   const customer = {
  //     name: quotation.customerName,
  //     address: quotation.addressTo
  //   };
  //   let customerKey: string;
  //   return this.http.post<any>(environment.siteUrl + '/customer.json', customer).pipe(
  //     switchMap(res => {
  //       customerKey = res.name;
  //       return this.updateCountQuotation();
  //     }),
  //     withLatestFrom(this.itemsService.items),
  //     switchMap(([quotationCount, items]) => {
  //       const sellItems: SellItem[] = [];
  //       quotation.allItem.forEach(itemInput => {
  //         const item = items.find(it => it.name === itemInput.item);
  //         const sellItem = new SellItem(item.id, itemInput.quantity);
  //         sellItems.push(sellItem);
  //       });
  //       data = {
  //         totalPrice: quotation.totalPrice,
  //         staff: quotation.staff,
  //         customerId: customerKey,
  //         date: quotation.date,
  //         expirationDate: quotation.expirationDate,
  //         items: sellItems,
  //         count: quotationCount.count,
  //         invoiceId: ''
  //       };
  //       return this.http.post(environment.siteUrl + '/quotation.json', data);
  //     })
  //   );
  // }

  getQuotation() {
    return this.http.get<{ [key: string]: QuototationResData }>(environment.siteUrl + '/quotation.json').pipe(
      withLatestFrom(this.itemsService.items),
      map(([resData, items]) => {
        const quotations: Quotation[] = [];
        for (const key in resData) {
          if (resData.hasOwnProperty(key)) {
            const allItem: SellItem[] = [];
            for (let i = 0; i < resData[key].items.length; i++) {
              const item = new SellItem(resData[key].items[i].itemId, resData[key].items[i].quantity);
              allItem.push(item);
            }

            const quotation = new Quotation(
              null,
              null,
              resData[key].customerId,
              resData[key].email,
              key,
              resData[key].date,
              resData[key].expirationDate,
              allItem,
              resData[key].invoiceId,
              resData[key].count,
            );
            quotations.push(quotation);
          }
        }
        return quotations;
      }),
      tap(quotations => {
        // console.log(quotations);
        this._quotations.next(quotations);
      })
    );
  }

  // deleteQuotation(id: string) {
  //   return this.http.delete(environment.siteUrl + '/quotation/' + id + '.json')
  //   .pipe(
  //     withLatestFrom(this.invoiceService.invoices),
  //     map(invoices => {
  //       const invoice = invoices.find(quo => quo.id === id);
  //       return this.http.delete(environment.siteUrl + '/invoices/' + invoice.id + '.json');
  //     }));
      // map(([resData, invoices]) => {
      //   const invoice = invoices.find(inv => inv.id === id);
      //   return this.http.delete(environment.siteUrl + '/invoices/' + invoice.id + '.json')
      // }

  // }

  deleteQuotation(id: string) {
    return this.http.delete(environment.siteUrl + '/quotation/' + id + '.json')
  }

  updateQuotation(quotation: any, id: string, cusId: string) {
    let data;
    return this.itemsService.items.pipe(
      switchMap(items => {
        const sellItems: SellItem[] = [];
        quotation.allItem.forEach(itemInput => {
          const item = items.find(it => it.name === itemInput.item);
          const sellItem = new SellItem(item.id, itemInput.quantity);
          sellItems.push(sellItem);
        });
        data = {
          totalPrice: quotation.totalPrice,
          // by: quotation.by,
          customerId: cusId,
          date: quotation.date,
          expirationDate: quotation.expirationDate,
          items: sellItems,
          invoiceId: ''
        };
        return this.http.patch(environment.siteUrl + '/quotation/' + id + '.json', data);
      })
    );
  }

  getCountInvoice() {
    return this.http.get<QuotationCount>(environment.siteUrl + '/quotationCount.json');
  }

  updateCountQuotation() {
    return this.getCountInvoice().pipe(
      switchMap((c) => {
        if (!c) {
          return this.http.put<QuotationCount>(environment.siteUrl + '/quotationCount.json', { count: 1 });
        } else {
          const count = {
            'count': c.count + 1
          };
          return this.http.patch<QuotationCount>(environment.siteUrl + '/quotationCount.json', count);
        }
      })
    );
  }
}



  // updateQuotation(quotation: any, id: string) {
  //   let data;

  //   const customer = {
  //     name: quotation.customerName,
  //     address: quotation.addressTo
  //   };
  //   return this.http.patch<any>(environment.siteUrl + '/customer.json', customer).pipe(
  //     withLatestFrom(this.itemsService.items),
  //     switchMap(([res, items]) => {
  //       const sellItems: SellItem[] = [];
  //       quotation.allItem.forEach(itemInput => {
  //         const item = items.find(it => it.name === itemInput.item);
  //         const sellItem = new SellItem(item.id, itemInput.quantity);
  //         sellItems.push(sellItem);
  //       });
  //       data = {
  //         totalPrice: quotation.totalPrice,
  //         // by: quotation.by,
  //         customerId: res.name,
  //         date: quotation.date,
  //         expirationDate: quotation.expirationDate,
  //         items: sellItems,
  //         invoiceId: ''
  //       };
  //       return this.http.patch(environment.siteUrl + '/quotation/' + id + '.json', data);
  //     })
  //   );
  //   const data = {
  //     addressTo: quotation.addressTo,
  //     date: quotation.date,
  //     expirationDate: quotation.expirationDate,
  //     item: quotation.allItem,
  //     quantity: quotation.quantity
  //   };
  //   return this.http.patch(environment.siteUrl + '/quotation/' + id + '.json', data);
//   }
// }
