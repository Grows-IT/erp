import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AngularFireList } from '@angular/fire/database';
import { BehaviorSubject } from 'rxjs';
import { Item } from './items.model';
import { environment } from 'src/environments/environment';
import { map, tap } from 'rxjs/operators';

interface ItemResData {
  id: string;
  name: string;
  price: number;
  availableQuntity: number;
}

@Injectable({
  providedIn: 'root'
})
export class ItemsService {
  private _item = new BehaviorSubject<Item[]>(null);

  get items() {
    return this._item.asObservable();
  }

  constructor(private http: HttpClient) {
  }

  getAllItems() {
    return this.http.get<{ [key: string]: ItemResData }>(environment.siteUrl + '/items.json').pipe(
      map((resItem) => {
        console.log(resItem);
        const items: Item[] = [];

        for (const key in resItem) {
          if (resItem.hasOwnProperty(key)) {
            const item = new Item(key, resItem[key].name, resItem[key].price, resItem[key].availableQuntity);
            items.push(item);
          }
        }
        return items;
      }),
      tap(items => {
        this._item.next(items);
      })
    );
  }
}