import { Component, OnInit } from '@angular/core';

class Collection {
  constructor(
    public name: string,
    public img: string
  ) {}
}

@Component({
  selector: 'app-pricelist',
  templateUrl: './pricelist.component.html',
  styleUrls: ['./pricelist.component.scss']
})
export class PricelistComponent implements OnInit {

  constructor() { }
  collections = [];

  ngOnInit() {
    const dendrobium = new Collection('Denbrobium', 'assets/collections/Dendrobium.PNG');
    this.collections = [dendrobium];
  }

}
