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
  count: number;
  group?: InvoiceGroup[];
}

interface Count {
  count: number;
}

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
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
                    return new SubInvoice(subinvoiceData.subInvoiceId, subinvoiceData.name, sellItems);
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
              resData[key].count,
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
    return this.updateCountInvoice().pipe(
      map((count) => {
        const data = {
          'quotationId': quotation.id,
          'customerId': quotation.customerId,
          'items': quotation.items,
          'type': type,
          'count': count.count
        };
        return data;
      }),
      switchMap((data) => {
        return this.http.post<{ [key: string]: InvoiceResData }>(environment.siteUrl + '/invoices.json', data);
      }),
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

  addGroupName(id, groupName) {
    return this.http.patch(environment.siteUrl + '/invoices/' + id + '/group.json', groupName.value);
  }

  updateInvoice(invoice: Invoice) {
    const inv = Object.assign({}, invoice);
    delete inv.id;

    return this.http.patch(environment.siteUrl + '/invoices/' + invoice.id + '.json', inv);
  }

  getCountInvoice() {
    return this.http.get<Count>(environment.siteUrl + '/invoiceCount.json');
  }

  updateCountInvoice() {
    return this.getCountInvoice().pipe(
      switchMap((c) => {
        if (!c) {
          return this.http.put<Count>(environment.siteUrl + '/invoiceCount.json', { count: 1 });
        } else {
          const count = {
            'count': c.count + 1
          };
          return this.http.patch<Count>(environment.siteUrl + '/invoiceCount.json', count);
        }
      })
    );
  }

  getCountSubInvoice() {
    return this.http.get<Count>(environment.siteUrl + '/subInvoiceCount.json');
  }

  updateCountSubInvoice() {
    return this.getCountSubInvoice().pipe(
      switchMap((c) => {
        if (!c) {
          return this.http.put<Count>(environment.siteUrl + '/subInvoiceCount.json', { count: 1 });
        } else {
          const count = {
            'count': c.count + 1
          };
          return this.http.patch<Count>(environment.siteUrl + '/subInvoiceCount.json', count);
        }
      })
    );
  }

  deleteTableSubInvoice(id, invoice) {
    const inv = Object.assign({}, invoice);
    delete inv.id;

    return this.http.patch(environment.siteUrl + '/invoices/' + id + '.json', inv);
  }
}


