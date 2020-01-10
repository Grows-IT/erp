import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AngularFireDatabase } from '@angular/fire/database';
import { environment } from 'src/environments/environment';
import { map, tap } from 'rxjs/operators';
import { Customer } from './customer.model';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(private http: HttpClient, private db: AngularFireDatabase) { }

  getAllCustomer() {
    return this.http.get<Customer[]>(environment.siteUrl + '/customer.json').pipe(
      map((res) => {
        // console.log(Object.keys(res));
        const customers = Object.keys(res).map((id, i) => {
          return new Customer(id, res[Object.keys(res)[i]].name, res[Object.keys(res)[i]].address);
        });
        return customers;
      })
    );
  }

  getCustomer(id) {
    return this.http.get<Customer>(environment.siteUrl + '/customer/' + id + '.json').pipe(
      map(res => {
        // console.log(res);
        return new Customer(id, res.name, res.address);
      })
    );
  }
}
