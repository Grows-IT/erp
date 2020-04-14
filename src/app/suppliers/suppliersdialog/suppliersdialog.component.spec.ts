import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuppliersdialogComponent } from './suppliersdialog.component';

describe('SuppliersdialogComponent', () => {
  let component: SuppliersdialogComponent;
  let fixture: ComponentFixture<SuppliersdialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuppliersdialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuppliersdialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
