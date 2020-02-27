import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartmentmanagementComponent } from './departmentmanagement.component';

describe('DepartmentmanagementComponent', () => {
  let component: DepartmentmanagementComponent;
  let fixture: ComponentFixture<DepartmentmanagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DepartmentmanagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DepartmentmanagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
