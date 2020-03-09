import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "src/environments/environment";
import "rxjs/add/operator/map";
import { map, tap, switchMap } from "rxjs/operators";
import { BehaviorSubject } from "rxjs";
import { Quotation } from "./sales.model";
import { SellItem } from "../invoice/invoice.model";
import { ItemsService } from "../items/items.service";
import { InvoiceService } from "../invoice/invoice.service";
import { Customer } from "src/app/customer/customer.model";
import { CustomerService } from "src/app/customer/customer.service";
import { AuthService } from "../signin/auth.service";
import { UserService } from "../usersmanagement/user.service";
import { SharedService } from "../shared/shared.service";

interface QuototationResData {
  status: string;
  addressTo: string;
  customerId: string;
  date: Date;
  email: string;
  expirationDate: Date;
  invoiceId: string;
  items: SellItem;
  quantity: number;
}

interface InvoiceResData {
  customerId: string;
  id: string;
  item: SellItem;
  quotationId: string;
  subInvoice: string;
}

interface QuotationCount {
  count: number;
}

@Injectable({
  providedIn: 'root'
})
export class SalesService {
  email: string;
  role: string;
  private _quotations = new BehaviorSubject<Quotation[]>(null);

  get quotations() {
    return this._quotations.asObservable();
  }

  constructor(
    private http: HttpClient,
    private itemsService: ItemsService,
    private cService: CustomerService,
    private auth: AuthService,
  ) {
    this.auth.getCurrentEmail().subscribe(email => (this.email = email));
  }

  addQuotation(inputs: any) {
    let createdEmail;
    let customer;
    return this.auth.getCurrentEmail().pipe(
      switchMap(res => {
        createdEmail = res;
        return this.cService.customers;
      }),
      switchMap(customers => {
        customer = customers.find(cus => cus.name === inputs.customerName);
        return this.itemsService.items;
      }),
      switchMap(items => {
        const sellItemsId: string[] = [];
        const sellItemsQuantity: string[] = [];
        inputs.allItem.forEach(itemInput => {
          const item = items.find(it => it.name === itemInput.item);
          sellItemsId.push(item.id);
          sellItemsQuantity.push(itemInput.quantity);
        });
        // console.log(sellItemsQuantity);
        // console.log(sellItemsId);

        const sellItems: SellItem = new SellItem(
          JSON.stringify(sellItemsId).replace(/[\[\]']+/g, ""),
          JSON.stringify(sellItemsQuantity).replace(/[\[\]']+/g, "")
        );
        const data = {
          status: 'active',
          email: createdEmail,
          customerId: customer.id,
          date: inputs.date,
          expirationDate: inputs.expirationDate,
          items: sellItems,
          invoiceId: ''
        };
        return this.http.post(environment.erpUrl + '/quotation', data);
      })
    );
  }

  getQuotation() {
    const quotations: Quotation[] = [];
    return this.http.get<any>(environment.erpUrl + '/quotation').pipe(
      map(res => {
        for (let i = 0; i < res.length; i++) {
          // console.log(res);
          const quotation = new Quotation(
            res[i].quotationStatus,
            res[i].customerId,
            res[i].sellItemId,
            res[i].itemId,
            res[i].sellQuantity,
            res[i].userId,
            res[i].companyId,
            res[i].email,
            res[i].quotationId,
            res[i].date,
            res[i].expirationDate,
            // allItem,
            res[i].invoiceId
          );
          // console.log(quotation);

          quotations.push(quotation);
        }
        return quotations;
      }),
      tap(quotations => {
        this._quotations.next(quotations);
      })
    );
  }

  deleteQuotation(id: string, invId: string) {
    const data = {
      quotationId: id,
      invoiceId: invId
    };
    return this.http.patch(environment.erpUrl + '/deletequotation', data);
  }

  updateQuotation(quotation: any, id: string, sellId: string) {
    let cus;
    return this.cService.customers.pipe(
      switchMap(customers => {
        cus = customers.find(cus => cus.name === quotation.customerName);
        return this.itemsService.items;
      }),
      switchMap(items => {
        const sellItemsId: string[] = [];
        const sellItemsQuantity: string[] = [];
        quotation.allItem.forEach(itemInput => {
          const item = items.find(it => it.name === itemInput.item);
          sellItemsId.push(item.id);
          sellItemsQuantity.push(itemInput.quantity);
        });
        const sellItems: SellItem = new SellItem(
          JSON.stringify(sellItemsId).replace(/[\[\]']+/g, ''),
          JSON.stringify(sellItemsQuantity).replace(/[\[\]"']+/g, '')
        );

        const data = {
          quotationId: id,
          customerId: cus.id,
          items: sellItems,
          sellItemId: sellId,
          date: quotation.date,
          expirationDate: quotation.expirationDate
        };
        // console.log(data);

        return this.http.patch(environment.erpUrl + '/quotation', data);
      })
    );
  }
}
