import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { PurchaseRedialogComponent } from './purchase-redialog/purchase-redialog.component';
import { PurchaseRe } from './purchase-re.model';
import { Subscription } from 'rxjs';
import { PRService } from './purchase-re.service';
import { switchMap } from 'rxjs/operators';
import { ConfirmDialogComponent } from '../shared/confirm-dialog/confirm-dialog.component';
// import { POService } from '../purchase-or/purchase-or.service';

@Component({
  selector: 'app-purchase-re',
  templateUrl: './purchase-re.component.html',
  styleUrls: ['./purchase-re.component.scss']
})
export class PurchaseReComponent implements OnInit {
  purchasreRe: PurchaseRe[];
  prCol: string[] = [
    'no',
    'Name',
    'CreatedDate',
    'CreatedBy',
    'Status',
    'edit',
    'delete',
    'manage'
  ];
  PRsubscription: Subscription;
  POsubscription: Subscription;

  constructor(public dialog: MatDialog, private prService: PRService) { }

  ngOnInit() {
    this.PRsubscription = this.prService.purchasere.subscribe(pr => {
      this.purchasreRe = pr;
    });
    this.prService.getPR().subscribe();

    // this.POsubscription = this.poService.
  }

  openPR() {
    const dialogRef = this.dialog.open(PurchaseRedialogComponent, {
      panelClass: 'nopadding-dialog',
      width: '70vw',
      height: '90vh',
      disableClose: false,
      autoFocus: false
    });
    dialogRef.afterClosed().subscribe(() => {
      const sub = this.prService.getPR().subscribe(() => {
        sub.unsubscribe();
      });
    });
    // .afterClosed()
    // .pipe(
    //   switchMap(() => {
    //     return this.prService.getPR();
    //   })
    // )
    // .subscribe();
  }

  edit(item) {
    const dialogRef = this.dialog.open(PurchaseRedialogComponent, {
      panelClass: 'nopadding-dialog',
      width: '70vw',
      height: '90vh',
      disableClose: false,
      autoFocus: false,
      data: item
    });
    dialogRef.afterClosed().subscribe(() => {
      const sub = this.prService.getPR().subscribe(() => {
        sub.unsubscribe();
      });
    });
    // dialogRef.afterClosed().pipe(
    //   switchMap(() => {
    //     return this.prService.getPR();
    //   })
    // ).subscribe();
  }

  delete(id: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      panelClass: 'nopadding-dialog',
      width: '400px',
      height: '200px',
      disableClose: true,
      autoFocus: false,
      data: { id, from: 'pr' }
    });
    dialogRef.afterClosed().subscribe(() => {
      const sub = this.prService.getPR().subscribe(() => {
        sub.unsubscribe();
      });
    });
    // dialogRef
    //   .afterClosed()
    //   .pipe(
    //     switchMap(() => {
    //       return this.prService.getPR();
    //     })
    //   )
    //   .subscribe();
  }

  approve(id, data) {
    status = 'approved';
    this.prService
      .updateStatus(status, id)
      .pipe(switchMap(() => this.prService.getPR()), switchMap(() => this.prService.createPO(data)))
      .subscribe();
  }

  reject(id) {
    status = 'rejected';
    this.prService
      .updateStatus(status, id)
      .pipe(switchMap(() => this.prService.getPR()))
      .subscribe();
  }
}
