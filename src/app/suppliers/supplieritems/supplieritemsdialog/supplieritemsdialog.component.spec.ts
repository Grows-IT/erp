import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplieritemsdialogComponent } from './supplieritemsdialog.component';

describe('SupplieritemsdialogComponent', () => {
  let component: SupplieritemsdialogComponent;
  let fixture: ComponentFixture<SupplieritemsdialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupplieritemsdialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplieritemsdialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
