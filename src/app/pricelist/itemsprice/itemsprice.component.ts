import { Component, OnInit, ViewChild } from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';

export interface Pricelist {
  name: string;
  collection: string;
  price: number;
}

const ELEMENT_DATA: Pricelist[] = [
  {name: 'GLX', collection: 'Dendrobium', price: 300},
  {name: 'GLX-Y', collection: 'Dendrobium', price: 200},
  {name: 'GLX-B', collection: 'Dendrobium', price: 100}
];

@Component({
  selector: 'app-itemsprice',
  templateUrl: './itemsprice.component.html',
  styleUrls: ['./itemsprice.component.scss']
})
export class ItemspriceComponent implements OnInit {
  // searchText;
  displayedColumns: string[] = ['name', 'collection', 'price'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);

  @ViewChild(MatSort, {static: true}) sort: MatSort;

  ngOnInit() {
    this.dataSource.sort = this.sort;
  }

}
