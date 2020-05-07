import { Component, OnInit } from '@angular/core';
import { POService } from './purchase-or.service';
import { PurchaseOr } from './purchase-or.model';
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-purchase-or',
  templateUrl: './purchase-or.component.html',
  styleUrls: ['./purchase-or.component.scss']
})
export class PurchaseOrComponent implements OnInit {
  purchaseOr: PurchaseOr[];
  poCol: string[] = [
    "no",
    "Name",
    "CreatedDate",
    "FinishedDate",
    "Status",
    "manage"
  ];
  POsubscription: Subscription;

  constructor(private POservice: POService) { }

  ngOnInit() {
    this.POsubscription = this.POservice.purchaseor.subscribe(po => {
      this.purchaseOr = po;
    });
    this.POservice.getPO().subscribe();

  }

  done(id: any){
    status = "done";
    this.POservice
      .updateStatus(status, id)
      .pipe(switchMap(() => this.POservice.getPO()))
      .subscribe();
  }

  canceled(id: any){
    status = "canceled";
  }

}
