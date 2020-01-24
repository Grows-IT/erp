import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlowerplantdialogComponent } from './flowerplantdialog.component';

describe('FlowerplantdialogComponent', () => {
  let component: FlowerplantdialogComponent;
  let fixture: ComponentFixture<FlowerplantdialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlowerplantdialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlowerplantdialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
