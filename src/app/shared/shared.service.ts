import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor() { }

  decode(id, count) {
    const PUSH_CHARS = "-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz";
    id = id.substring(0, 8);
    let timestamp = 0;
    for (let i = 0; i < id.length; i++) {
      const c = id.charAt(i);
      timestamp = timestamp * 64 + PUSH_CHARS.indexOf(c);
    }
    const zeroPad = (num, places) => String(num).padStart(places, '0');
    const date = new Date(timestamp);
    const invoiceId = 'GIT' + date.getDate() + date.getMonth() + 1 + date.getFullYear().toString().substr(-2) + zeroPad(count, 5);
    return invoiceId;
  }
}
