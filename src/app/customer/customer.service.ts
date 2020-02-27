import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { environment } from 'src/environments/environment';
import { map, tap } from 'rxjs/operators';
import { Customer } from './customer.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  customerDetail: AngularFireList<any>;
  private _customers = new BehaviorSubject<Customer[]>(null);

  get customers() {
    return this._customers.asObservable();
  }

  constructor(private http: HttpClient) {
  }

  addCustomer(customer: any) {

    const cus = {
      name: customer.customerName,
      address: customer.addressTo
    };
    return this.http.post('http://localhost:3333/customer', cus);
    // return this.http.post<any>(environment.siteUrl + '/customer.json', cus);
  }

  getAllCustomer() {
    return this.http.get('http://localhost:3333/customer').pipe(
        map((res) => {
          // console.log(Object.keys(res));
          const customers = Object.keys(res).map((id, i) => {
            return new Customer(res[Object.keys(res)[i]].customerId, res[Object.keys(res)[i]].customerName, res[Object.keys(res)[i]].address);
          });
          return customers;
        }),
        tap(customers => {
          this._customers.next(customers);
        })
      );

    // return this.http.get<Customer[]>(environment.siteUrl + '/customer.json').pipe(
    //   map((res) => {
    //     // console.log(Object.keys(res));
    //     const customers = Object.keys(res).map((id, i) => {
    //       return new Customer(id, res[Object.keys(res)[i]].name, res[Object.keys(res)[i]].address);
    //     });
    //     return customers;
    //   }),
    //   tap(customers => {
    //     this._customers.next(customers);
    //   })
    // );
  }

  updateCustomer(customer: any, id: string) {
    let data;
    data = {
      name: customer.customerName,
      address: customer.addressTo,
      cusId: id
    };
    return this.http.patch('http://localhost:3333/customer', data);
    // return this.http.patch(environment.siteUrl + '/customer/' + id + '.json', data);
  }

  deleteCustomer(id: string) {
    let data;
    data = {
      cusId: id
    };
    console.log(data);

    return this.http.post('http://localhost:3333/deletecustomer/', data);
    // return this.http.delete(environment.siteUrl + '/customer/' + id + '.json');
  }
}
