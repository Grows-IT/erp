import { Injectable } from "@angular/core";
import { UserService } from "../usersmanagement/user.service";
import { AuthService } from "../signin/auth.service";
import { map, tap } from "rxjs/operators";
import { BehaviorSubject } from "rxjs";
import { HttpClient } from "@angular/common/http";

interface SellItemsResData {
  sellItemId: string;
  itemId: string;
  sellQuantity: string;
}

@Injectable({
  providedIn: "root"
})
export class SharedService {
  email: string;
  // private _role = new BehaviorSubject<string>(null);
  private _sellItem = new BehaviorSubject<SellItemsResData[]>(null);

  // get role() {
  //   return this._role.asObservable();
  // }

  get sellItem() {
    return this._sellItem.asObservable();
  }

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private http: HttpClient
  ) { }

  decode(id, key) {
    // const PUSH_CHARS = "-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz";
    // id = id.substring(0, 8);
    // let timestamp = 0;
    // for (let i = 0; i < id.length; i++) {
    //   const c = id.charAt(i);
    //   timestamp = timestamp * 64 + PUSH_CHARS.indexOf(c);
    // }
    const zeroPad = (num, places) => String(num).padStart(places, "0");
    // const date = new Date(timestamp);
    const no = key + zeroPad(id, 6);
    return no;
  }

  // getRole() {
  //   this.getEmail().subscribe(email => this.email = email);
  //   return this.userService.getUser().pipe(
  //     map(users => {
  //       return users.find(user => {
  //         if (user.email === this.email) {
  //           console.log(user);
  //           return user.role;
  //         }
  //       });
  //     }),
  //     tap(role => {
  //       this._role.next(role);
  //     })
  //   );
  // }

  getEmail() {
    return this.authService.getCurrentEmail();
  }

  getSellItems() {
    return this.http
      .get<SellItemsResData>("http://localhost:3333/sellItem")
      .pipe(
        map(resSellItems => {
          // console.log(resItem);
          const sellItems: SellItemsResData[] = [];

          for (const key in resSellItems) {
            if (resSellItems.hasOwnProperty(key)) {
              const data = {
                sellItemId: resSellItems[key].sellItemId,
                itemId: resSellItems[key].itemId,
                sellQuantity: resSellItems[key].sellQuantity
              };
              sellItems.push(data);

              // const sellit = new sellItems();
              // sellItems.push(sellit);
            }
          }
          return sellItems;
        }),
        tap(sellItems => {
          this._sellItem.next(sellItems);
        })
      );
  }
}
