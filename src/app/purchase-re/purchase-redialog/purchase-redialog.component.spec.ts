import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseRedialogComponent } from './purchase-redialog.component';

describe('PurchaseRedialogComponent', () => {
  let component: PurchaseRedialogComponent;
  let fixture: ComponentFixture<PurchaseRedialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchaseRedialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseRedialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
