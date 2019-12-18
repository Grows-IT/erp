import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemspriceComponent } from './itemsprice.component';

describe('ItemspriceComponent', () => {
  let component: ItemspriceComponent;
  let fixture: ComponentFixture<ItemspriceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemspriceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemspriceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
