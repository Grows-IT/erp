import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseRenextdialogComponent } from './purchase-renextdialog.component';

describe('PurchaseRenextdialogComponent', () => {
  let component: PurchaseRenextdialogComponent;
  let fixture: ComponentFixture<PurchaseRenextdialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchaseRenextdialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseRenextdialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
