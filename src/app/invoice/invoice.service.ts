import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Invoice } from './invoice.model';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  invoiceList: any[];

  constructor(private http: HttpClient, private activatedRoute: ActivatedRoute) {
  }

  deleteInvoice(id: string) {
    const data = {
      isInvoice: false
    };
    return this.http.patch(environment.siteUrl + '/quotation/' + id + '.json', data);
  }

  getSubInvioce(id) {
    return this.http.get<Invoice>(environment.siteUrl + '/invoices/-LxZdDePB4WEbHuNNoeU' + '.json');
  }
}
