import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseOrComponent } from './purchase-or.component';

describe('PurchaseOrComponent', () => {
  let component: PurchaseOrComponent;
  let fixture: ComponentFixture<PurchaseOrComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchaseOrComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseOrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
