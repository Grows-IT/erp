import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplieritemsComponent } from './supplieritems.component';

describe('SupplieritemsComponent', () => {
  let component: SupplieritemsComponent;
  let fixture: ComponentFixture<SupplieritemsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupplieritemsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplieritemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
