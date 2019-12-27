import { Component, OnInit } from '@angular/core';
import { SalesService } from '../sales.service';
import { MatDialogRef } from '@angular/material';
import { QuotationDialogComponent } from '../quotation-dialog/quotation-dialog.component';
import { ActivatedRoute } from '@angular/router';
// import { Router } from '@angular/router';

@Component({
  selector: 'app-quotationdetail',
  templateUrl: './quotationdetail.component.html',
  styleUrls: ['./quotationdetail.component.scss']
})
export class QuotationdetailComponent implements OnInit {
  data;
  private sub: any;
  // data: any;

  constructor( private route: ActivatedRoute) {}

  // constructor(private salesService: SalesService, private dialogRef: MatDialogRef<QuotationDialogComponent>) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
    this.data = params;
    console.log(params);

  });
  }

}
