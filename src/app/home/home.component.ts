import { Component, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

class Menu {
  constructor(
    public topicname: string,
    public img: string,
    public link: string
  ) {}
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor() {  }
    menu = [];
    menu2 = [];
    downmenu = [];
  ngOnInit() {
    const sales = new Menu('Sales', 'assets/menu/Sale.svg', 'sales');
    const invoice = new Menu('Invoice', 'assets/menu/invoice.svg', 'invoice');
    const CRM = new Menu('CRM', 'assets/menu/crm.svg', 'CRM');
    const qualitycon = new Menu('Quanlity Control', 'assets/menu/quality-control.svg', 'qualitycon');
    const account = new Menu('Accounting', 'assets/menu/accounting.svg', 'account');
    const pricelist = new Menu('Price list', 'assets/menu/price list.svg', 'pricelist');
    const report = new Menu('Report', 'assets/menu/report.svg', 'report');
    const purchase = new Menu('Purchase', 'assets/menu/purchase.svg', 'purchase');
    const truck = new Menu('Truck & GPS', 'assets/menu/vehicle truck.svg', 'truck');
    const airlines = new Menu('Airlines', 'assets/menu/plane.svg', 'truck');
    const shipping = new Menu('Shipping Agents', 'assets/menu/shipping.svg', 'shipping');
    const suppliers = new Menu('Suppliers', 'assets/menu/suppliers.svg', 'suppliers');
    const customers = new Menu('Customers', 'assets/menu/customers2.svg', 'customers');
    const flowerplant = new Menu('Flowers & Plant', 'assets/menu/flowerplant.svg', 'flowerplant');
    const employee = new Menu('Employee', 'assets/menu/employee.svg', 'employee');
    this.menu = [sales, invoice, CRM, qualitycon, account];
    this.menu2 = [pricelist, report, purchase, truck];
    this.downmenu = [airlines, shipping, suppliers, customers, flowerplant, employee];
}
}
