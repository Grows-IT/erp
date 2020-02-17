import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss']
})
export class EmployeeComponent implements OnInit {
  employeeCol: string[] = ['name', 'department', 'position', 'edit', 'profile', 'delete'];
  employee = [{
    'name': 'satoshi',
    'department': 'programmer',
    'position': 'employee',
  },{
    'name': 'masayoshi',
    'department': 'manager',
    'position': 'ceo',
  },{
    'name': 'new',
    'department': 'hr',
    'position': 'employee',
  },{
    'name': 'amp',
    'department': 'graphic',
    'position': 'employee',
  },
];
  constructor() { }

  ngOnInit() {
  }

  createEmployee() {

  }

  delete() {
    console.log('delete');
  }

}
