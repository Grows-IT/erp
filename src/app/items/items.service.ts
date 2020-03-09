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

  addFlower(item: any) {

    const items = {
      name: item.name,
      price: item.price,
      availableQuantity: item.quantity
    };
    return this.http.post('http://localhost:3333/flower', items);
    // return this.http.post<any>(environment.siteUrl + '/items.json', items);
  }

  addItem(item: any) {

    const items = {
      name: item.name,
      price: item.price,
      availableQuantity: item.quantity,
      type: item.type
    };
    console.log(item);

    return this.http.post('http://localhost:3333/items', items);
    // return this.http.post<any>(environment.siteUrl + '/items.json', items);
  }

  getFlower() {
    return this.http.get('http://localhost:3333/flower').pipe(
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

  getAllItems() {
    return this.http.get('http://localhost:3333/items').pipe(
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
    let data;
    data = {
      name: item.name,
      price: item.price,
      availableQuantity: item.quantity,
      itemId: id,
      type: 'Flower'
    };
    return this.http.patch('http://localhost:3333/flower', data);
    // return this.http.patch(environment.siteUrl + '/items/' + id + '.json', data);
  }

  updateItem(item: any, id: string) {
    let data;
    data = {
      name: item.name,
      price: item.price,
      availableQuantity: item.quantity,
      itemId: id,
      type: item.type
    };
    console.log(data);

    return this.http.patch('http://localhost:3333/items', data);
    // return this.http.patch(environment.siteUrl + '/items/' + id + '.json', data);
  }

  deleteItem(id: string) {
    let data;
    data = {
      itemId: id
    };
    console.log(data);
    return this.http.post('http://localhost:3333/deleteitem/', data);
    // return this.http.delete(environment.siteUrl + '/items/' + id + '.json');
  }
}
