import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SalesService {

  constructor(private http: HttpClient) { }

  submitQuotation(quotation: any) {
    console.log(quotation);

    const data = {
      addressTo: quotation.addressTo,
      date: quotation.date,
      expriationDate: quotation.expriationDate,
      type: quotation.type,
      quantity: quotation.quantity
    };
    return this.http.post(environment.siteUrl + '/quatation.json', data);
  }

  getQuotation() {
    return this.http.get(environment.siteUrl + '/quatation.json');
  }
}
