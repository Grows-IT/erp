import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "src/environments/environment";
import "rxjs/add/operator/map";
import { map, tap, switchMap } from "rxjs/operators";
import { BehaviorSubject } from "rxjs";
import { Quotation } from "./sales.model";
import { SellItem } from "../invoice/invoice.model";
import { ItemsService } from "../items/items.service";
import { InvoiceService } from "../invoice/invoice.service";
import { Customer } from "src/app/customer/customer.model";
import { CustomerService } from "src/app/customer/customer.service";
import { AuthService } from "../signin/auth.service";
import { UserService } from "../usersmanagement/user.service";
import { SharedService } from "../shared/shared.service";

interface QuototationResData {
  status: string;
  addressTo: string;
  customerId: string;
  date: Date;
  email: string;
  expirationDate: Date;
  invoiceId: string;
  items: SellItem;
  quantity: number;
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
    private uService: UserService,
    private sharedService: SharedService
  ) {
    this.auth.getCurrentEmail().subscribe(email => (this.email = email));
    // this.sharedService.role.subscribe(role => { this.role = role; });
    // this.sharedService.getRole().subscribe();
    // this.uService.getUser().subscribe();
    // this.sharedService.getEmail().subscribe(email => (this.email = email));
  }

  // addQuotation(inputs: any) {
  //   let data;
  //   let cusEmail: string;
  //   let count: number;
  //   let customer: Customer;
  //   return this.auth.getCurrentEmail().pipe(
  //     switchMap(res => {
  //       cusEmail = res;
  //       return this.updateCountQuotation();
  //     }),
  //     switchMap(quotationCount => {
  //       count = quotationCount.count;
  //       return this.cService.customers;
  //     }),
  //     switchMap(customers => {
  //       customer = customers.find(cus => cus.name === inputs.customerName);

  //       return this.itemsService.items;
  //     }),
  //     switchMap(items => {
  //       // console.log(customer);
  //       if (customer === undefined) {
  //         return;
  //       } else {
  //         const sellItems: SellItem[] = [];
  //         inputs.allItem.forEach(itemInput => {
  //           const item = items.find(it => it.name === itemInput.item);
  //           const sellItem = new SellItem(item.id, itemInput.quantity);
  //           sellItems.push(sellItem);
  //         });
  //         data = {
  //           status: 'active',
  //           email: cusEmail,
  //           customerId: customer.id,
  //           date: inputs.date,
  //           expirationDate: inputs.expirationDate,
  //           items: sellItems,
  //           count,
  //           invoiceId: ''
  //         };
  //         return this.http.post(environment.siteUrl + '/quotation.json', data);
  //       }
  //     })
  //   );
  // }

  addQuotation(inputs: any) {
    let createdEmail;
    let customer;
    return this.auth.getCurrentEmail().pipe(
      switchMap(res => {
        createdEmail = res;
        return this.cService.customers;
      }),
      switchMap(customers => {
        customer = customers.find(cus => cus.name === inputs.customerName);
        return this.itemsService.items;
      }),
      switchMap(items => {
        const sellItemsId: string[] = [];
        const sellItemsQuantity: string[] = [];
        inputs.allItem.forEach(itemInput => {
          const item = items.find(it => it.name === itemInput.item);
          sellItemsId.push(item.id);
          sellItemsQuantity.push(itemInput.quantity);
        });
        // console.log(sellItemsQuantity);
        // console.log(sellItemsId);

        const sellItems: SellItem = new SellItem(
          JSON.stringify(sellItemsId).replace(/[\[\]']+/g, ""),
          JSON.stringify(sellItemsQuantity).replace(/[\[\]']+/g, "")
        );
        const data = {
          status: "active",
          email: createdEmail,
          customerId: customer.id,
          date: inputs.date,
          expirationDate: inputs.expirationDate,
          items: sellItems,
          invoiceId: ""
        };
        return this.http.post("http://localhost:3333/quotation", data);
      })
    );

    // let data;
    // let cusEmail: string;
    // let count: number;
    // let customer: Customer;
    // return this.auth.getCurrentEmail().pipe(
    //   switchMap(res => {
    //     cusEmail = res;
    //     return this.updateCountQuotation();
    //   }),
    //   switchMap(quotationCount => {
    //     count = quotationCount.count;
    //     return this.cService.customers;
    //   }),
    //   switchMap(customers => {
    //     customer = customers.find(cus => cus.name === inputs.customerName);

    //     return this.itemsService.items;
    //   }),
    //   switchMap(items => {
    //     // console.log(customer);
    //     if (customer === undefined) {
    //       return;
    //     } else {
    //       const sellItems: SellItem[] = [];
    //       inputs.allItem.forEach(itemInput => {
    //         const item = items.find(it => it.name === itemInput.item);
    //         const sellItem = new SellItem(item.id, itemInput.quantity);
    //         sellItems.push(sellItem);
    //       });
    //       data = {
    //         status: 'active',
    //         email: cusEmail,
    //         customerId: customer.id,
    //         date: inputs.date,
    //         expirationDate: inputs.expirationDate,
    //         items: sellItems,
    //         count,
    //         invoiceId: ''
    //       };
    //       return this.http.post(environment.siteUrl + '/quotation.json', data);
    //     }
    //   })
    // );
  }

  getQuotation() {
    const quotations: Quotation[] = [];
    return this.http.get<any>("http://localhost:3333/quotation").pipe(
      map(res => {
        for (let i = 0; i < res.length; i++) {
          // console.log(res);
          const quotation = new Quotation(
            res[i].quotationStatus,
            res[i].customerId,
            res[i].sellItemId,
            res[i].itemId,
            res[i].sellQuantity,
            res[i].userId,
            res[i].companyId,
            res[i].email,
            res[i].quotationId,
            res[i].date,
            res[i].expirationDate,
            // allItem,
            res[i].invoiceId
          );
          // console.log(quotation);

          quotations.push(quotation);
        }
        return quotations;
      }),
      tap(quotations => {
        this._quotations.next(quotations);
      })
    );
  }

  // getQuotation() {
  //   return this.http.get<{ [key: string]: QuototationResData }>(environment.siteUrl + '/quotation.json')
  //     .pipe(
  //       map(resData => {
  //         this.auth.getRoleFormStorage().subscribe(role => {
  //           this.role = role;
  //         });
  //         return resData;
  //       }),
  //       // withLatestFrom(this.uService.users),
  //       map(resData => {
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
  //             // console.log(this.role);
  //             // console.log(resData[key]);
  //             if (this.role === '4e7afebcfbae000b22c7c85e5560f89a2a0280b4') {
  //               quotations.push(quotation);
  //             } else if (
  //               this.email === resData[key].email &&
  //               this.role !== '4e7afebcfbae000b22c7c85e5560f89a2a0280b4'
  //             ) {
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
    const data = {
      // status: canceled',
      quotationId: id
    };
    return this.http.patch("http://localhost:3333/deletequotation", data);
    // if (invoiceId === '') {
    //   return this.http.patch(environment.siteUrl + '/quotation/' + id + '.json', data);
    // } else {
    //   return this.http.patch(environment.siteUrl + '/quotation/' + id + '.json', data).pipe(
    //     switchMap(() => {
    //       return this.http.patch(environment.siteUrl + '/invoices/' + invoiceId + '.json', data);
    //     })
    //   );
    // }
  }

  updateQuotation(quotation: any, id: string, sellId: string) {
    let cus;
    return this.cService.customers.pipe(
      switchMap(customers => {
        cus = customers.find(cus => cus.name === quotation.customerName);
        return this.itemsService.items;
      }),
      switchMap(items => {
        const sellItemsId: string[] = [];
        const sellItemsQuantity: string[] = [];
        quotation.allItem.forEach(itemInput => {
          const item = items.find(it => it.name === itemInput.item);
          sellItemsId.push(item.id);
          sellItemsQuantity.push(itemInput.quantity);
        });
        const sellItems: SellItem = new SellItem(
          JSON.stringify(sellItemsId).replace(/[\[\]']+/g, ""),
          JSON.stringify(sellItemsQuantity).replace(/[\[\]"']+/g, "")
        );

        const data = {
          quotationId: id,
          customerId: cus.id,
          items: sellItems,
          sellItemId: sellId,
          date: quotation.date,
          expirationDate: quotation.expirationDate
        };
        console.log(data);

        return this.http.patch("http://localhost:3333/quotation", data);
      })
    );
  }
}

// updateQuotation(quotation: any, id: string, cusId: string) {
//   let data;
//   return this.itemsService.items.pipe(
//     switchMap(items => {
//       const sellItems: SellItem[] = [];
//       quotation.allItem.forEach(itemInput => {
//         const item = items.find(it => it.name === itemInput.item);
//         const sellItem = new SellItem(item.id, itemInput.quantity);
//         sellItems.push(sellItem);
//       });
//       data = {
//         totalPrice: quotation.totalPrice,
//         customerId: cusId,
//         date: quotation.date,
//         expirationDate: quotation.expirationDate,
//         items: sellItems,
//         invoiceId: ''
//       };
//       return this.http.patch(
//         environment.siteUrl + '/quotation/' + id + '.json',
//         data
//       );
//     })
//   );
// }

// getCountQuotation() {
//   return this.http.get<QuotationCount>(
//     environment.siteUrl + '/quotationCount.json'
//   );
// }

// updateCountQuotation() {
//   return this.getCountQuotation().pipe(
//     switchMap(c => {
//       if (!c) {
//         return this.http.put<QuotationCount>(
//           environment.siteUrl + '/quotationCount.json',
//           { count: 1 }
//         );
//       } else {
//         const count = {
//           count: c.count + 1
//         };
//         return this.http.patch<QuotationCount>(
//           environment.siteUrl + '/quotationCount.json',
//           count
//         );
//       }
//     })
//   );
// }
