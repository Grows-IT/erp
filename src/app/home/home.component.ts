import { Component, OnInit } from '@angular/core';
import { UserService } from '../usersmanagement/user.service';
import { User } from '../usersmanagement/user.model';
import { Subscription } from 'rxjs';
import { AuthService } from '../signin/auth.service';
import { switchMap, map, tap } from 'rxjs/operators';
// import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

class Menu {
  constructor(
    public topicname: string,
    public img: string,
    public link: string,
    public status: string
  ) {}
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  cusEmail: string;
  users: User[];
  userSubscription: Subscription;
  getSubscription: Subscription;
  token: any;
  email: any;
  role: any;
  // getToken: any;

  constructor(public uService: UserService, public auth: AuthService) {}
  menu = [];
  menu2 = [];
  downmenu = [];

  ngOnInit() {
    this.auth.getCurrentEmail().subscribe(res => (this.email = res));
    this.userSubscription = this.uService.users.subscribe(user => {
      this.users = user;
    });
    this.uService.getUser().pipe(
        map(res => {
          const role = res.find(it => it.email === this.email);
          if (!role) {
            return;
          }
          // this.role = role.role;
          return role.role;
          // console.log(res);
          // console.log(this.email);
        })
      )
      .subscribe(role => this.role = role);
    // this.auth.getTokenFormStorage().subscribe(res => (this.token = res));
    console.log(this.email);

    const sales = new Menu('Sales', 'assets/menu/Sale.svg', 'sales', 'active');
    const invoice = new Menu('Invoice', 'assets/menu/invoice.svg', 'invoice', 'active');
    const CRM = new Menu('CRM', 'assets/menu/crm.svg', 'CRM', 'disabled');
    const qualitycon = new Menu(
      'Quanlity Control',
      'assets/menu/quality-control.svg',
      'qualitycon',
      'disabled'
    );
    const account = new Menu(
      'Accounting',
      'assets/menu/accounting.svg',
      'account',
      'disabled'
    );
    const pricelist = new Menu(
      'Price list',
      'assets/menu/price list.svg',
      'pricelist',
      'disabled'
    );
    const report = new Menu('Report', 'assets/menu/report.svg', 'report', 'disabled');
    const purchase = new Menu(
      'Purchase',
      'assets/menu/purchase.svg',
      'purchase',
      'disabled'
    );
    const truck = new Menu(
      'Truck & GPS',
      'assets/menu/vehicle truck.svg',
      'truck',
      'disabled'
    );
    const airlines = new Menu('Airlines', 'assets/menu/plane.svg', 'truck', 'disabled');
    const shipping = new Menu(
      'Shipping Agents',
      'assets/menu/shipping.svg',
      'shipping',
      'disabled'
    );
    const suppliers = new Menu(
      'Suppliers',
      'assets/menu/suppliers.svg',
      'suppliers',
      'disabled'
    );
    const customers = new Menu(
      'Customers',
      'assets/menu/customers2.svg',
      'customers',
      'active'
    );
    const flowerplant = new Menu(
      'Flowers & Plant',
      'assets/menu/flowerplant.svg',
      'flowerplant',
      'active'
    );
    const employee = new Menu(
      'Employee',
      'assets/menu/employee.svg',
      'employee',
      'active'
    );
    // const setting = new Menu(
    //   'Users management',
    //   'assets/menu/gear.svg',
    //   'usersmanagement'
    // );
    this.menu = [sales, invoice, CRM, qualitycon, account];
    this.menu2 = [pricelist, report, purchase, truck];
    this.downmenu = [
      airlines,
      shipping,
      suppliers,
      customers,
      flowerplant,
      employee,
      // setting
    ];
    // this.role = this.getRole();
    // console.log(this.role);
  }

  logout() {
    this.auth.logout();
  }

  // getEmail() {
  //   let cusEmail: string;
  //   return this.auth.getUserFormStorage().pipe(
  //     map(res => {
  //       cusEmail = res.email;
  //       return res.email;
  //     }));
  // }

  // getRole() {
  //   const role = this.users.find(it => it.email === this.email);
  //   if (!role) {
  //     return null;
  //   }
  //   return role.role;
  // }
}
