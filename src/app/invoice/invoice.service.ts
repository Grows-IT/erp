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
  items: SellItem[];
  subInvoice: string;
  status: string;
  email: string;
  isReceipt: boolean;
  createdReceiptDate: Date;
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
    this.sharedService.getEmail().subscribe(email => {
      this.email = email;
    });
  }

  getAllInvoice() {
    const invoices: Invoice[] = [];
    return this.http.get<any>('http://localhost:3333/invoice').pipe(
      map(res => {
        console.log(res);
        for (let i = 0; i < res.length; i++) {
          const invoice = new Invoice(
            res[i].invoiceId,
            res[i].quotationId,
            res[i].customerId,
            res[i].itemId,
            res[i].sellQuantity,
            res[i].invoiceStatus,
            res[i].creator,
            res[i].createdReceiptDate,
          );
          invoices.push(invoice);
        }
        return invoices;
      }),
      tap((invoices) => {
        this._invoice.next(invoices);
      })
    );
  }

  createInvoice(quotation: any) {
    console.log(quotation);

    const data = {
      'quotationId': quotation.quotationId,
      'customerId': quotation.customerId,
      'items': quotation.itemId,
      'status': "active",
      'email': quotation.email,
      'companyId': quotation.companyId,
      'userId': quotation.userId,
      'sellItemId': quotation.sellItemId,
      'createReceiptDate': null
    };
    return this.http.post('http://localhost:3333/invoice', data).pipe(
      switchMap((inv: any) => {
        return this.http.patch('http://localhost:3333/updateQuotation', { 'invoiceId': inv.insertId, 'quotationId': quotation.quotationId });
      })
    );
  }

  deleteInvoice(invoiceId: string, quotationId: string) {
    // console.log(invoiceId, quotationId);
    return this.http.patch('http://localhost:3333/invoice', { invoiceId, quotationId });
  }

  addGroupName(groupName, invId) {
    // console.log(groupName);
    return this.http.post('http://localhost:3333/invoiceGroup', { data: groupName, invoiceId: invId });
  }

  getGroupName(invId) {
    return this.http.get<GroupName>('http://localhost:3333/invoiceGroup?id=' + invId).pipe(
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
    return this.http.patch('http://localhost:3333/subInvoice', { subInvoicesId });
  }

  deleteGroupName(index) {
    // console.log(index);
    return this.http.patch('http://localhost:3333/invoiceGroup', { index });
  }

  changeGroupName(id, newName) {
    return this.http.patch('http://localhost:3333/changeGroupName', { id, newName });
  }

  addReceipt(id) {
    const data = {
      // isReceipt: true,
      createdReceiptDate: new Date()
    };
    return this.http.post('http://localhost/addReceipt', data);
    // return this.http.patch(environment.siteUrl + '/invoices/' + id + '.json', data);
  }

  getListItem(invoiceId) {
    return this.http.get('http://localhost:3333/getListItem?id=' + invoiceId);
  }

  addSubInvoice(data: string, name: string, groupId: number) {
    return this.http.post('http://localhost:3333/subInvoice', { data, name, groupId });
  }

  getSubInvoice(groupId) {
    // console.log(groupId);
    return this.http.get('http://localhost:3333/subInvoice?groupId=' + groupId);
  }
}


