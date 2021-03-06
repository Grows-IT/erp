import { Component, OnInit, Inject } from "@angular/core";
import { MatDialog, MAT_DIALOG_DATA } from "@angular/material";
import { InvoiceService } from "src/app/invoice/invoice.service";
import { switchMap } from "rxjs/operators";
import { CustomerService } from "src/app/customer/customer.service";
import { SalesService } from "src/app/sales/sales.service";
import { ItemsService } from "src/app/items/items.service";
import { UserService } from "src/app/usersmanagement/user.service";
import { AuthService } from "src/app/signin/auth.service";
import { DepartmentService } from "src/app/departmentmanagement/departmentmanagement.service";
import { SupplierService } from "src/app/suppliers/supplier.service";
import { SupplierItemService } from "src/app/suppliers/supplieritems/supplieritems.service";
import { PRService } from 'src/app/purchase-re/purchase-re.service';

@Component({
  selector: "app-confirm-dialog",
  templateUrl: "./confirm-dialog.component.html",
  styleUrls: ["./confirm-dialog.component.scss"]
})
export class ConfirmDialogComponent implements OnInit {
  constructor(
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private invoiceService: InvoiceService,
    private cService: CustomerService,
    private salesService: SalesService,
    private itemsService: ItemsService,
    private uService: UserService,
    private authService: AuthService,
    private dService: DepartmentService,
    private sService: SupplierService,
    private SiService: SupplierItemService,
    private prService: PRService
  ) {}

  ngOnInit() {}

  delete() {
    if (this.data.from === "invoice") {
      this.invoiceService
        .deleteInvoice(this.data.invoiceId, this.data.quotationId)
        .pipe(switchMap(() => this.invoiceService.getAllInvoice()))
        .subscribe();
    } else if (this.data.from === "quotation") {
      this.salesService
        .deleteQuotation(this.data.id, this.data.invoiceId)
        .pipe(switchMap(() => this.salesService.getQuotation()))
        .subscribe();
    } else if (this.data.from === "customer") {
      this.cService
        .deleteCustomer(this.data.id)
        .pipe(switchMap(() => this.cService.getAllCustomer()))
        .subscribe();
    } else if (this.data.from === "flowerPlant") {
      this.itemsService
        .deleteItem(this.data.id)
        .pipe(switchMap(() => this.itemsService.getAllItems()))
        .subscribe();
    } else if (this.data.from === "user") {
      this.uService
        .deleteUser(this.data.id)
        .pipe(switchMap(() => this.uService.getUser()))
        .subscribe();
    } else if (this.data.from === "department") {
      this.dService
        .deleteDepartment(this.data.id)
        .pipe(switchMap(() => this.dService.getAllDepartments()))
        .subscribe();
    } else if (this.data.from === "supplieritems") {
      this.SiService.deleteSupIt(this.data.id)
        .pipe(switchMap(() => this.SiService.getSupItem()))
        .subscribe();
    } else if (this.data.from === "pr") {
      this.prService.deletePR(this.data.id)
        .pipe(switchMap(() => this.SiService.getSupItem()))
        .subscribe();
    } else if (this.data.from === "supplier") {
      this.sService
        .deleteSupplier(this.data.id)
        .pipe(switchMap(() => this.sService.getAllSuppliers()))
        .subscribe();
    }
    this.dialog.closeAll();
  }
}
