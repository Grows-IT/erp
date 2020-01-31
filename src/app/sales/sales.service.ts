import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import 'rxjs/add/operator/map';
import { map, tap, switchMap, withLatestFrom, reduce } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { Quotation } from './sales.model';
import { SellItem, Invoice } from '../invoice/invoice.model';
import { ItemsService } from '../items/items.service';
import { InvoiceService } from '../invoice/invoice.service';
import { Customer } from 'src/app/customer/customer.model';
import { CustomerService } from 'src/app/customer/customer.service';
import { AuthService } from '../signin/auth.service';

interface QuototationResData {
  status: string;
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

  constructor(
    private http: HttpClient,
    private itemsService: ItemsService,
    private invoiceService: InvoiceService,
    private cService: CustomerService,
    private auth: AuthService
  ) {
    this.invoiceService.getAllInvoice().subscribe();
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
          status: 'active',
          email: cusEmail,
          customerId: customer.id,
          date: inputs.date,
          expirationDate: inputs.expirationDate,
          items: sellItems,
          count,
          invoiceId: ''
        };
        return this.http.post(environment.siteUrl + '/quotation.json', data);
      })
    );
  }

  getQuotation() {
    return this.http
      .get<{ [key: string]: QuototationResData }>(
        environment.siteUrl + '/quotation.json'
      )
      .pipe(
        withLatestFrom(this.itemsService.items),
        map(([resData, items]) => {
          const quotations: Quotation[] = [];
          for (const key in resData) {
            if (resData.hasOwnProperty(key)) {
              const allItem: SellItem[] = [];
              for (let i = 0; i < resData[key].items.length; i++) {
                const item = new SellItem(
                  resData[key].items[i].itemId,
                  resData[key].items[i].quantity
                );
                allItem.push(item);
              }

              const quotation = new Quotation(
                null,
                resData[key].status,
                resData[key].customerId,
                resData[key].email,
                key,
                resData[key].date,
                resData[key].expirationDate,
                allItem,
                resData[key].invoiceId,
                resData[key].count
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

  deleteQuotation(id: string, invoiceId: string) {
    const data = { status: 'canceled' };
    return this.http.patch(
      environment.siteUrl + '/quotation/' + id + '.json',
      data
    ).pipe(
    switchMap(() => {
      return this.http.patch(
        environment.siteUrl + '/invoices/' + invoiceId + '.json',
        data
      );
    })
    );
  }
  //   if (!invoiceId) {
  //     return;
  //   }
  //   return this.http.delete(
  //     environment.siteUrl + "/invoices/" + invoiceId + ".json"
  //   );
  // }

    // return this.invoiceService.invoices.pipe(
    //   switchMap(invoices => {
    //     const invoice = invoices.find(inv => inv.quotationId === id);
    //     console.log(invoice);
    //     if (invoice !== null && invoice !== undefined) {
    //       return this.http.delete(
    //         environment.siteUrl + "/invoices/" + invoice.id + ".json"
    //       );
    //     }
    //     return;
    //   })
    //   switchMap(() => {
    //     return this.http.delete(environment.siteUrl + '/quotation/' + id + '.json');
    //   })
    // );
  // }

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
        return this.http.patch(
          environment.siteUrl + '/quotation/' + id + '.json',
          data
        );
      })
    );
  }

  getCountQuotation() {
    return this.http.get<QuotationCount>(
      environment.siteUrl + '/quotationCount.json'
    );
  }

  updateCountQuotation() {
    return this.getCountQuotation().pipe(
      switchMap(c => {
        if (!c) {
          return this.http.put<QuotationCount>(
            environment.siteUrl + '/quotationCount.json',
            { count: 1 }
          );
        } else {
          const count = {
            count: c.count + 1
          };
          return this.http.patch<QuotationCount>(
            environment.siteUrl + '/quotationCount.json',
            count
          );
        }
      })
    );
  }
}
