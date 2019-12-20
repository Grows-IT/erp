import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AngularFireDatabase, AngularFireList, SnapshotAction } from '@angular/fire/database';
import 'rxjs/add/operator/map';
import { map, tap, concatMap, toArray, switchMap } from 'rxjs/operators';
import { BehaviorSubject, from, of } from 'rxjs';
import { Quotation, Item } from './sales.model';

@Injectable({
  providedIn: 'root'
})
export class SalesService {
  quotationList: AngularFireList<any>;
  private _quotations = new BehaviorSubject<Quotation[]>(null);

  get quotations() {
    return this._quotations.asObservable();
  }

  constructor(private http: HttpClient, private db: AngularFireDatabase) {
    this.quotationList = db.list('quotation');
  }

  addQuotation(quotation: any) {
    console.log(quotation);

    const data = {
      addressTo: quotation.addressTo,
      date: quotation.date,
      expirationDate: quotation.expirationDate,
      item: quotation.item,
      quantity: quotation.quantity
    };
    return this.http.post(environment.siteUrl + '/quotation.json', data);
  }

  getQuotation() {
    return this.quotationList.snapshotChanges().map(actions => {
      return actions.map(action => {
        const item = new Item(action.payload.val().item, action.payload.val().quantity);
        const quotation = new Quotation(
          action.key, action.payload.val().addressTo, action.payload.val().date, action.payload.val().expirationDate, [item]);
        return quotation;
      });
    }).pipe(tap(data => {
      this._quotations.next(data);
    }));
  }

  deleteQuotation(id: string) {
    return this.http.delete(environment.siteUrl + '/quotation/' + id + '.json');
  }
}
