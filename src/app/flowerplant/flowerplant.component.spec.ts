import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlowerplantComponent } from './flowerplant.component';

describe('FlowerplantComponent', () => {
  let component: FlowerplantComponent;
  let fixture: ComponentFixture<FlowerplantComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlowerplantComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlowerplantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
