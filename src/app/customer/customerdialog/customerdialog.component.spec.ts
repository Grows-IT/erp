import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerdialogComponent } from './customerdialog.component';

describe('CustomerdialogComponent', () => {
  let component: CustomerdialogComponent;
  let fixture: ComponentFixture<CustomerdialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerdialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerdialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
