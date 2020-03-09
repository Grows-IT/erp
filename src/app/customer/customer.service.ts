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
    return this.http.post(environment.erpUrl + '/customer', cus);
  }

  getAllCustomer() {
    return this.http.get(environment.erpUrl + '/customer').pipe(
      map((res) => {
        const customers = Object.keys(res).map((id, i) => {
          return new Customer(res[Object.keys(res)[i]].customerId, res[Object.keys(res)[i]].customerName, res[Object.keys(res)[i]].address);
        });
        return customers;
      }),
      tap(customers => {
        this._customers.next(customers);
      })
    );
  }

  updateCustomer(customer: any, id: string) {
    const data = {
      name: customer.customerName,
      address: customer.addressTo,
      cusId: id
    };
    return this.http.patch(environment.erpUrl + '/customer', data);
  }

  deleteCustomer(id: string) {
    const data = {
      cusId: id
    };
    return this.http.post(environment.erpUrl + '/deletecustomer/', data);
  }
}
