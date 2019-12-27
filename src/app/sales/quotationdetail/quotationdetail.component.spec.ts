import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotationdetailComponent } from './quotationdetail.component';

describe('QuotationdetailComponent', () => {
  let component: QuotationdetailComponent;
  let fixture: ComponentFixture<QuotationdetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuotationdetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuotationdetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
