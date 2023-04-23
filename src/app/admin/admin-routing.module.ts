import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '../app-common/home/home.component';
import { ProductsComponent } from '../app-common/products/products.component';
import { AdminCustomersComponent } from './admin-customers/admin-customers.component';
import { AdminProductsComponent } from './admin-products/admin-products.component';
import { AdminSingleCustomerComponent } from './admin-single-customer/admin-single-customer.component';
import { AdminComponent } from './admin.component';

const routes: Routes = [{ path: '', component: AdminComponent, children: [
                            {path:'home', component : HomeComponent},
                            {path : 'products', component : ProductsComponent},
                            {path : 'all-products', component : AdminProductsComponent},
                            {path : 'all-customers', component : AdminCustomersComponent},
                            {path : 'customer/:id',component : AdminSingleCustomerComponent},
                            {path : '', pathMatch:'full', redirectTo : '/admin/home'}
                        ]},
                      ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
