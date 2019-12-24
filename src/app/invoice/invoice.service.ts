import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { SalesService } from '../sales/sales.service';
import { map } from 'rxjs-compat/operator/map';
import { first, switchMap, filter } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  invoiceList: any[];

  constructor(private http: HttpClient, private salesService: SalesService) {
  }

  deleteInvoice(id: string) {
    const data = {
      isInvoice: false
    };
    return this.http.patch(environment.siteUrl + '/quotation/' + id + '.json', data);
  }

}
