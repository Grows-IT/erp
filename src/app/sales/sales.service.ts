import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import 'rxjs/add/operator/map';
import { map, tap, concatMap, toArray, switchMap, first } from 'rxjs/operators';
import { BehaviorSubject, from, of } from 'rxjs';
import { Quotation, Item } from './sales.model';
import { CustomerService } from '../customer/customer.service';
import { Customer } from '../customer/customer.model';

@Injectable({
  providedIn: 'root'
})
export class SalesService {
  quotationList: AngularFireList<any>;
  customerDetail: AngularFireList<any>;
  private _quotations = new BehaviorSubject<Quotation[]>(null);

  get quotations() {
    return this._quotations.asObservable();
  }

  constructor(private http: HttpClient, private db: AngularFireDatabase, private cService: CustomerService) {
    this.quotationList = db.list('quotation');
    this.customerDetail = db.list('quotation');
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
          by: quotation.by,
          customerId: res.name,
          date: quotation.date,
          expirationDate: quotation.expirationDate,
          item: quotation.item,
          quantity: quotation.quantity,
          isInvoice: false
        };
        return this.http.post(environment.siteUrl + '/quotation.json', data).subscribe();
      });

    // this.http.post(environment.siteUrl + '/customer.json', customer).subscribe(val => {
    //   data = {
    //     totalPrice: quotation.totalPrice,
    //     by: quotation.by,
    //     customerId: val,
    //     date: quotation.date,
    //     expirationDate: quotation.expirationDate,
    //     item: quotation.item,
    //     quantity: quotation.quantity,
    //     isInvoice: false
    //   };
    // });
    // return this.http.post(environment.siteUrl + '/quotation.json', data);
  }

  getQuotation() {
    return this.http.get(environment.siteUrl + '/quotation.json').pipe(
      map((val, index) => {
        console.log(val);
        let customer;
        const quotation = Object.keys(val).map((id, i) => {
          const item = new Item(val[id].item, val[id].quantity);
          this.cService.getCustomer(val[id].customerId).subscribe(cus => {
            customer = cus;
          });

          return new Quotation(
            val[id].totalPrice, val[id].status, val[id].customer, val[id].by,
            customer, val[id].date, val[id].expirationDate, [item], val[id].isInvoice);
          // console.log(customer);


        });
        console.log(quotation);
        return quotation;
      }),
      tap(data => {
        this._quotations.next(data);
      })

    );


    // return this.quotationList.snapshotChanges().map(actions => {
    //   return actions.map(action => {
    //     const item = new Item(action.payload.val().item, action.payload.val().quantity);
    //     console.log(action.payload.val().customerId);

    //     return this.cService.getCustomer(action.payload.val().customerId).pipe(
    //       map((cus) => {
    //         console.log(cus);

    //         const quotation = new Quotation(
    //           action.payload.val().totalPrice, action.payload.val().status, cus, action.payload.val().by, action.key,
    //           action.payload.val().date, action.payload.val().expirationDate, [item], action.payload.val().isInvoice);
    //         return quotation;
    //       })
    //     );
    //   });
    // }).pipe(tap(data => {
    //   console.log(data);
    //   this._quotations.next(data);
    // }));
  }

  deleteQuotation(id: string) {
    return this.http.delete(environment.siteUrl + '/quotation/' + id + '.json');
  }

  updateQuotation(quotation: any, id: string) {
    const data = {
      addressTo: quotation.addressTo,
      date: quotation.date,
      expirationDate: quotation.expirationDate,
      item: quotation.item,
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
