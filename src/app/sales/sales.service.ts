import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import "rxjs/add/operator/map";
import { map, tap, switchMap, withLatestFrom, reduce } from "rxjs/operators";
import { BehaviorSubject, of } from "rxjs";
import { Quotation } from "./sales.model";
import { SellItem, Invoice } from "../invoice/invoice.model";
import { ItemsService } from "../items/items.service";
import { InvoiceService } from "../invoice/invoice.service";
import { Customer } from "src/app/customer/customer.model";
import { CustomerService } from "src/app/customer/customer.service";
import { AuthService } from "../signin/auth.service";
import { UserService } from "../usersmanagement/user.service";
import { User } from "../usersmanagement/user.model";

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
  providedIn: "root"
})
export class SalesService {
  email: string;
  role: string;
  private _quotations = new BehaviorSubject<Quotation[]>(null);

  get quotations() {
    return this._quotations.asObservable();
  }

  constructor(
    private http: HttpClient,
    private itemsService: ItemsService,
    private invoiceService: InvoiceService,
    private cService: CustomerService,
    private auth: AuthService,
    private uService: UserService
  ) {
    this.auth.getCurrentEmail().subscribe(email => this.email = email);
    this.uService.getUser().pipe(
      map(users => {
        return users.find(user => {
          if (user.email === this.email) {
            this.role = user.role;
            console.log(user);

          }
        });
      })
    ).subscribe();
  }

  addQuotation(inputs: any) {
    let data;
    let cusEmail: string;
    let count: number;
    let customer: Customer;
    return this.auth.getCurrentEmail().pipe(
      switchMap(res => {
        cusEmail = res;
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
          status: "active",
          email: cusEmail,
          customerId: customer.id,
          date: inputs.date,
          expirationDate: inputs.expirationDate,
          items: sellItems,
          count,
          invoiceId: ""
        };
        return this.http.post(environment.siteUrl + "/quotation.json", data);
      })
    );
  }

  getQuotation() {
    return this.http
      .get<{ [key: string]: QuototationResData }>(
        environment.siteUrl + "/quotation.json"
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
              if (this.role === 'Admin') {
                quotations.push(quotation);
              }
              console.log(this.role);

              if (this.email === resData[key].email && this.role !== 'Admin') {
                quotations.push(quotation);
              }
              // if (resData[key].email === this.email) {
              // }
            }
          }
          return quotations;
        }),
        tap(quotations => {
          this._quotations.next(quotations);
        })
      );
  }

  // getQuote(role: any) {
  //   return this.http
  //     .get<{ [key: string]: QuototationResData }>(
  //       environment.siteUrl + "/quotation.json"
  //     )
  //     .pipe(
  //       withLatestFrom(this.itemsService.items),
  //       map(([resData, items]) => {
  //         const quotations: Quotation[] = [];
  //         for (const key in resData) {
  //           if (resData.hasOwnProperty(key)) {
  //             const allItem: SellItem[] = [];
  //             for (let i = 0; i < resData[key].items.length; i++) {
  //               const item = new SellItem(
  //                 resData[key].items[i].itemId,
  //                 resData[key].items[i].quantity
  //               );
  //               allItem.push(item);
  //             }

  //             const quotation = new Quotation(
  //               null,
  //               resData[key].status,
  //               resData[key].customerId,
  //               resData[key].email,
  //               key,
  //               resData[key].date,
  //               resData[key].expirationDate,
  //               allItem,
  //               resData[key].invoiceId,
  //               resData[key].count
  //             );
  //             if (resData[key].email === this.email || role === 'Admin') {
  //               quotations.push(quotation);
  //             }
  //           }
  //         }
  //         return quotations;
  //       }),
  //       tap(quotations => {
  //         this._quotations.next(quotations);
  //       })
  //     );
  // }

  deleteQuotation(id: string, invoiceId: string) {
    const data = { status: "canceled" };
    return this.http
      .patch(environment.siteUrl + "/quotation/" + id + ".json", data)
      .pipe(
        switchMap(() => {
          return this.http.patch(
            environment.siteUrl + "/invoices/" + invoiceId + ".json",
            data
          );
        })
      );
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
          customerId: cusId,
          date: quotation.date,
          expirationDate: quotation.expirationDate,
          items: sellItems,
          invoiceId: ""
        };
        return this.http.patch(
          environment.siteUrl + "/quotation/" + id + ".json",
          data
        );
      })
    );
  }

  getCountQuotation() {
    return this.http.get<QuotationCount>(
      environment.siteUrl + "/quotationCount.json"
    );
  }

  updateCountQuotation() {
    return this.getCountQuotation().pipe(
      switchMap(c => {
        if (!c) {
          return this.http.put<QuotationCount>(
            environment.siteUrl + "/quotationCount.json",
            { count: 1 }
          );
        } else {
          const count = {
            count: c.count + 1
          };
          return this.http.patch<QuotationCount>(
            environment.siteUrl + "/quotationCount.json",
            count
          );
        }
      })
    );
  }
}
