import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Invoice, SellItem, InvoiceGroup, SubInvoice } from './invoice.model';
import { BehaviorSubject } from 'rxjs';
import { tap, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { ItemsService } from '../items/items.service';

interface InvoiceResData {
  id: string;
  quotationId: string;
  customerId: string;
  type: string;
  items: SellItem[];
  subInvoice: string;
  group?: InvoiceGroup[];
}

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  // invoiceList: any[];
  private _invoice = new BehaviorSubject<Invoice[]>(null);

  get invoices() {
    return this._invoice.asObservable();
  }

  constructor(private http: HttpClient, private itemsService: ItemsService) {
  }

  getAllInvoice() {
    return this.http.get<{ [key: string]: InvoiceResData }>(environment.siteUrl + '/invoices.json').pipe(
      withLatestFrom(this.itemsService.items),
      map(([resData, items]) => {
        const invoices: Invoice[] = [];
        for (const key in resData) {
          if (resData.hasOwnProperty(key)) {
            const allItem: SellItem[] = [];
            for (let i = 0; i < resData[key].items.length; i++) {
              const item = new SellItem(resData[key].items[i].itemId, resData[key].items[i].quantity);
              allItem.push(item);
            }
            let groups = [];
            if (resData[key].group && resData[key].group.length > 0) {
              groups = resData[key].group.map(groupData => {
                if (groupData.subInvoices && groupData.subInvoices.length > 0) {
                  const subInvoices = groupData.subInvoices.map(subinvoiceData => {
                    const sellItems = subinvoiceData.sellItems.map(sellItemData => {
                      return new SellItem(sellItemData.itemId, sellItemData.quantity);
                    });
                    return new SubInvoice(subinvoiceData.name, sellItems);
                  });
                  return new InvoiceGroup(groupData.name, subInvoices);
                }
                return new InvoiceGroup(groupData.name, []);
              });
            }


            const invoice = new Invoice(
              key,
              resData[key].quotationId,
              resData[key].customerId,
              resData[key].type,
              allItem,
              groups
            );
            invoices.push(invoice);
          }
        }
        return invoices;
      }),
      tap(invoices => {
        this._invoice.next(invoices);
      })
    );
  }

  createInvoice(quotation: any, type: string) {
    const data = {
      'quotationId': quotation.id,
      'customerId': quotation.customerId,
      'items': quotation.items,
      'type': type,
      // 'group': null
    };

    return this.http.post<{ [key: string]: InvoiceResData }>(environment.siteUrl + '/invoices.json', data).pipe(
      switchMap((key) => {
        return this.http.patch(environment.siteUrl + '/quotation/' + quotation.id + '.json', { 'invoiceId': key.name });
      })
    );
  }

  deleteInvoice(invoiceId: string, quotationId: string) {
    return this.http.delete(environment.siteUrl + '/invoices/' + invoiceId + '.json').pipe(
      switchMap(() => {
        return this.http.patch(environment.siteUrl + '/quotation/' + quotationId + '.json', { 'invoiceId': '' });
      })
    );
  }

  addSubInvoice(data, invoiceId, groupId) {
    return this.http.post(environment.siteUrl + '/invoices/' + invoiceId + '/group/' + groupId + '/subInvoices/.json', data);
  }

  addGroupName(id, groupName) {
    return this.http.patch(environment.siteUrl + '/invoices/' + id + '/group.json', groupName.value);
  }

  getAllGroupName(id) {
    return this.http.get(environment.siteUrl + '/invoices/' + id + '/group.json');
  }

  updateInvoice(invoice: Invoice) {
    console.log(invoice);
    return this.http.patch(environment.siteUrl + '/invoices/' + invoice.id + '.json', invoice);
  }
}


