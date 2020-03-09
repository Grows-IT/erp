import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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

  addFlower(item: any) {
    const items = {
      name: item.name,
      price: item.price,
      availableQuantity: item.quantity
    };
    return this.http.post(environment.erpUrl + '/flower', items);
  }

  addItem(item: any) {
    const items = {
      name: item.name,
      price: item.price,
      availableQuantity: item.quantity,
      type: item.type
    };
    console.log(item);

    return this.http.post(environment.erpUrl + '/items', items);
  }

  getFlower() {
    return this.http.get(environment.erpUrl + '/flower').pipe(
      map((resItem) => {
        const items: Item[] = [];

        for (const key in resItem) {
          if (resItem.hasOwnProperty(key)) {
            const item = new Item(resItem[key].itemId, resItem[key].itemName, resItem[key].price, resItem[key].availableQuantity, resItem[key].itemType);
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

  getAllItems() {
    return this.http.get(environment.erpUrl + '/items').pipe(
      map((resItem) => {
        // console.log(resItem);
        const items: Item[] = [];

        for (const key in resItem) {
          if (resItem.hasOwnProperty(key)) {
            const item = new Item(resItem[key].itemId, resItem[key].itemName, resItem[key].price, resItem[key].availableQuantity, resItem[key].itemType);
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

  updateFlower(item: any, id: string) {
    const data = {
      name: item.name,
      price: item.price,
      availableQuantity: item.quantity,
      itemId: id,
      type: 'Flower'
    };
    return this.http.patch(environment.erpUrl + '/flower', data);
  }

  updateItem(item: any, id: string) {
    const data = {
      name: item.name,
      price: item.price,
      availableQuantity: item.quantity,
      itemId: id,
      type: item.type
    };
    console.log(data);

    return this.http.patch(environment.erpUrl + '/items', data);
  }

  deleteItem(id: string) {
    const data = {
      itemId: id
    };
    console.log(data);
    return this.http.post(environment.erpUrl + '/deleteitem/', data);
  }
}
