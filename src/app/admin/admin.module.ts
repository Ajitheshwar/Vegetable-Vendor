import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { AppCommonModule } from '../app-common/app-common.module';
import { AdminProductsComponent } from './admin-products/admin-products.component';
import { AdminDataService } from './admin-data.service';
import { AdminCustomersComponent } from './admin-customers/admin-customers.component';
import { AdminSingleCustomerComponent } from './admin-single-customer/admin-single-customer.component';


@NgModule({
  declarations: [
    AdminComponent,
    AdminProductsComponent,
    AdminCustomersComponent,
    AdminSingleCustomerComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    AppCommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers : [AdminDataService]
})
export class AdminModule { }
