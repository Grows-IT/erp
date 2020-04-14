import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseReComponent } from './purchase-re.component';

describe('PurchaseReComponent', () => {
  let component: PurchaseReComponent;
  let fixture: ComponentFixture<PurchaseReComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchaseReComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseReComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
