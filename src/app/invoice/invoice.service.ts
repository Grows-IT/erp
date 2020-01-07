import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Invoice } from './invoice.model';
import { BehaviorSubject } from 'rxjs';
import { AngularFireList, AngularFireDatabase } from '@angular/fire/database';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  // invoiceList: any[];
  invoiceList: AngularFireList<any>;
  private _invoice = new BehaviorSubject<Invoice>(null);

  get invoices() {
    return this._invoice.asObservable();
  }

  constructor(private http: HttpClient, private db: AngularFireDatabase) {
    this.invoiceList = db.list('invoice');
  }


  deleteInvoice(id: string) {
    this.isInvoice(id);
    return this.http.delete(environment.siteUrl + '/invoices/' + id + '.json');
  }

  isInvoice(id) {
    const data = {
      isInvoice: false
    };

    return this.http.patch(environment.siteUrl + '/quotation/' + id + '.json', data).subscribe();
  }

  getSubInvioce(id) {
    return this.http.get<Invoice>(environment.siteUrl + '/invoices/' + id + '.json')
      .pipe(tap(data => {
        this._invoice.next(data);
      }));
    // return this.http.get<Invoice>(environment.siteUrl + '/invoices/-LxZdDePB4WEbHuNNoeU' + '.json');
  }

  addSubInvoice(data, id) {
    // return this.http.put(environment.siteUrl + '/invoices/' + id + '/subInvoices/.json', [data]);
    return this.http.post(environment.siteUrl + '/invoices/' + id + '/subInvoices/.json', data);
  }

}


