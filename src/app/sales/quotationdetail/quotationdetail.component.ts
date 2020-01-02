import { Component, OnInit, OnDestroy } from '@angular/core';
import { SalesService } from '../sales.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Quotation } from '../sales.model';
import { Router } from '@angular/router';
// import { Router } from '@angular/router';

@Component({
  selector: 'app-quotationdetail',
  templateUrl: './quotationdetail.component.html',
  styleUrls: ['./quotationdetail.component.scss']
})
export class QuotationdetailComponent implements OnInit, OnDestroy {
  data;
  subscription: Subscription;
  quotation: Quotation;


  constructor( private salesService: SalesService, private route: ActivatedRoute, private router: Router) {}


  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.data = id;
    this.subscription = this.salesService.quotations.subscribe(quotations => {
      if (quotations === null) {
        return;
      }
      this.quotation = quotations.find(q => q.id === id);
    });
    this.salesService.getQuotation().subscribe();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  delete(id: string) {
    this.salesService.deleteQuotation(id).subscribe();
    this.router.navigate(['/sales']);
  }

}
