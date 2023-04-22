import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSingleCustomerComponent } from './admin-single-customer.component';

describe('AdminSingleCustomerComponent', () => {
  let component: AdminSingleCustomerComponent;
  let fixture: ComponentFixture<AdminSingleCustomerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminSingleCustomerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminSingleCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
