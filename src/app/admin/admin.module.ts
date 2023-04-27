import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { AppCommonModule } from '../app-common/app-common.module';
import { AdminProductsComponent } from './admin-products/admin-products.component';
import { AdminDataService } from './admin-data.service';
import { AdminCustomersComponent } from './admin-customers/admin-customers.component';
import { AdminSingleCustomerComponent } from './admin-single-customer/admin-single-customer.component';
import { AdminOrdersComponent } from './admin-orders/admin-orders.component';
import { NumberFormatPipe } from './number-format.pipe';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardProductComponent } from './dashboard-product/dashboard-product.component';

@NgModule({
  declarations: [
    AdminComponent,
    AdminProductsComponent,
    AdminCustomersComponent,
    AdminSingleCustomerComponent,
    AdminOrdersComponent,
    NumberFormatPipe,
    DashboardComponent,
    DashboardProductComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    AppCommonModule,
    FormsModule,
    ReactiveFormsModule,
    // BrowserAnimationsModule,
    NgxChartsModule
  ],
  providers: [AdminDataService],
})
export class AdminModule {}
