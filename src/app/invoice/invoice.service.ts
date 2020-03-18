import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Invoice, SellItem, InvoiceGroup, SubInvoice } from './invoice.model';
import { BehaviorSubject, of } from 'rxjs';
import { tap, map, switchMap } from 'rxjs/operators';
import { SharedService } from '../shared/shared.service';
import { UserService } from '../usersmanagement/user.service';
import { AuthService } from '../signin/auth.service';

interface InvoiceResData {
  id: string;
  quotationId: string;
  customerId: string;
  items: SellItem[];
  subInvoice: string;
  status: string;
  email: string;
  isReceipt: boolean;
  createReceiptDate: Date;
}

interface GroupName {
  invoiceGroupId: number;
  subInvoice: number;
  invoiceId: number;
  groupName: string;
  invoiceStatus: string;
}

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  private _invoice = new BehaviorSubject<Invoice[]>(null);
  private _groupName = new BehaviorSubject<GroupName>(null);
  email: string;
  role: string;

  get invoices() {
    return this._invoice.asObservable();
  }

  get groups() {
    return this._groupName.asObservable();
  }

  constructor(private http: HttpClient, private userService: UserService, private sharedService: SharedService, private authService: AuthService) {
    this.sharedService.getEmail().subscribe(email => (this.email = email));
  }

  getAllInvoice() {
    const invoices: Invoice[] = [];
    return this.sharedService.getRole().pipe(
      switchMap(role => {
        this.role = role[0].role;
        return this.http.get<any>(environment.erpUrl + '/invoice');
      }),
      map(res => {
        for (let i = 0; i < res.length; i++) {
          const invoice = new Invoice(
            res[i].invoiceId,
            res[i].quotationId,
            res[i].customerId,
            res[i].itemId,
            res[i].sellQuantity,
            res[i].invoiceStatus,
            res[i].creator,
            res[i].createReceiptDate,
          );
          // console.log(res[i].creator);
          // console.log(this.email);
          if (this.role === 'admin' || (this.email === res[i].creator && this.role === 'user')) {
            invoices.push(invoice);
          }
        }
        return invoices;
      }),
      tap((invoices) => {
        this._invoice.next(invoices);
      })
    );
  }

  createInvoice(quotation: any) {
    const data = {
      quotationId: quotation.quotationId,
      customerId: quotation.customerId,
      items: quotation.itemId,
      status: 'active',
      email: quotation.email,
      companyId: quotation.companyId,
      userId: quotation.userId,
      sellItemId: quotation.sellItemId,
      createReceiptDate: null
    };
    const check = {
      itemId: quotation.itemId.split(','),
      itemQuantity: quotation.itemQuantity.split(','),
      itemType: 'Flower'
    };

    return this.http.post(environment.erpUrl + '/invoice', { data, check }).pipe(
      switchMap((inv: any) => {
        if (inv.err) {
          return of(inv);
        }
        return this.http.patch(environment.erpUrl + '/updateQuotation', { 'invoiceId': inv.insertId, 'quotationId': quotation.quotationId });
      })
    );
  }

  deleteInvoice(invoiceId: string, quotationId: string) {
    // console.log(invoiceId, quotationId);
    return this.http.patch(environment.erpUrl + '/invoice', { invoiceId, quotationId });
  }

  addGroupName(groupName, invId) {
    // console.log(groupName);
    return this.http.post(environment.erpUrl + '/invoiceGroup', { data: groupName, invoiceId: invId });
  }

  getGroupName(invId) {
    return this.http.get<GroupName>(environment.erpUrl + '/invoiceGroup?id=' + invId).pipe(
      map((data) => {
        return this._groupName.next(data);
      })
    );
  }

  updateInvoice(invoice: Invoice) {
    const inv = Object.assign({}, invoice);
    delete inv.id;

    return this.http.patch(environment.siteUrl + '/invoices/' + invoice.id + '.json', inv);
  }

  deleteTableSubInvoice(subInvoicesId) {
    return this.http.patch(environment.erpUrl + '/subInvoice', { subInvoicesId });
  }

  deleteGroupName(index) {
    // console.log(index);
    return this.http.patch(environment.erpUrl + '/invoiceGroup', { index });
  }

  changeGroupName(id, newName) {
    return this.http.patch(environment.erpUrl + '/changeGroupName', { id, newName });
  }

  addReceipt(id) {
    const data = {
      invId: id,
      createReceiptDate: new Date()
    };
    return this.http.post(environment.erpUrl + '/addReceipt', data);
    // return this.http.patch(environment.siteUrl + '/invoices/' + id + '.json', data);
  }

  getListItem(invoiceId) {
    return this.http.get(environment.erpUrl + '/getListItem?id=' + invoiceId);
  }

  addSubInvoice(data: string, name: string, groupId: number) {
    return this.http.post(environment.erpUrl + '/subInvoice', { data, name, groupId });
  }

  getSubInvoice(groupId) {
    // console.log(groupId);
    return this.http.get(environment.erpUrl + '/subInvoice?groupId=' + groupId);
  }
}


