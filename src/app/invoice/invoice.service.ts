import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Invoice, SellItem, InvoiceGroup, SubInvoice } from './invoice.model';
import { BehaviorSubject } from 'rxjs';
import { tap, map, switchMap } from 'rxjs/operators';
import { SharedService } from '../shared/shared.service';
import { UserService } from '../usersmanagement/user.service';
import { AuthService } from '../signin/auth.service';

interface InvoiceResData {
  id: string;
  quotationId: string;
  customerId: string;
  type: string;
  items: SellItem[];
  subInvoice: string;
  count: number;
  status: string;
  email: string;
  isReceipt: boolean;
  createdReceiptDate: Date;
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
  email: string;
  role: string;

  get invoices() {
    return this._invoice.asObservable();
  }

  constructor(private http: HttpClient, private userService: UserService, private sharedService: SharedService, private authService: AuthService) {
    this.sharedService.getEmail().subscribe(email => {
      this.email = email;
    });
  }

  getAllInvoice() {
    return this.http.get<{ [key: string]: InvoiceResData }>(environment.siteUrl + '/invoices.json').pipe(
      map(resData => {
        this.authService.getRoleFormStorage().subscribe(role => {
          this.role = role;
        });

        return resData;
      }),
      map((resData) => {
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
                    return new SubInvoice(subinvoiceData.subInvoiceId, subinvoiceData.name, sellItems, subinvoiceData.status);
                  });
                  return new InvoiceGroup(groupData.name, subInvoices, groupData.status);
                }
                return new InvoiceGroup(groupData.name, [], groupData.status);
              });
            }

            const invoice = new Invoice(
              key,
              resData[key].quotationId,
              resData[key].customerId,
              resData[key].type,
              allItem,
              resData[key].count,
              resData[key].status,
              resData[key].email,
              resData[key].isReceipt,
              resData[key].createdReceiptDate,
              groups
            );
            console.log(this.role);


            if (this.role === '4e7afebcfbae000b22c7c85e5560f89a2a0280b4') {
              invoices.push(invoice);
            } else if (this.email === resData[key].email && this.role !== '4e7afebcfbae000b22c7c85e5560f89a2a0280b4') {
              invoices.push(invoice);
            }
          }
        }
        return invoices;
      }),
      tap((invoices) => {
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
          'count': count.count,
          'status': "active",
          'email': quotation.email,
          'isReceipt': false
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
    // const inv = Object.assign({}, invoice);
    // delete inv.id;
    return this.http.patch(environment.siteUrl + '/invoices/' + id + '.json', invoice);
  }

  deleteGroupName(id, index) {
    return this.http.patch(environment.siteUrl + '/invoices/' + id + '/group/' + index + '.json', { status: 'cancel' });
  }

  changeGroupName(id, index, newName) {
    return this.http.patch(environment.siteUrl + '/invoices/' + id + '/group/' + index + '.json', newName);
  }

  addReceipt(id) {
    const data = {
      isReceipt: true,
      createdReceiptDate: new Date()
    };
    return this.http.patch(environment.siteUrl + '/invoices/' + id + '.json', data);
  }
}


