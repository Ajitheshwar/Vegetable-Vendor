import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from '../app-common/about/about.component';
import { AccountComponent } from './account/account.component';
import { AddressBookComponent } from './address-book/address-book.component';
import { CartComponent } from './cart/cart.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { EditAccountComponent } from './edit-account/edit-account.component';
import { HomeComponent } from '../app-common/home/home.component';
import { OrdersComponent } from './orders/orders.component';
import { ProductsComponent } from '../app-common/products/products.component';
import { SendFeedbackComponent } from './send-feedback/send-feedback.component';
import { UserComponent } from './user.component';

const routes: Routes = [{ path: '', component: UserComponent,children : [
                          {path : 'home', component : HomeComponent},
                          {path : 'products', component : ProductsComponent},
                          {path : 'cart', component : CartComponent},
                          {path : 'about', component : AboutComponent},
                          {path : 'checkout',component : CheckoutComponent},
                          {path : 'account',component : AccountComponent, children : [
                            {path : 'editDetails', component : EditAccountComponent},
                            {path : 'address',component : AddressBookComponent},
                            {path : 'orders', component : OrdersComponent},
                            {path : 'feedback', component : SendFeedbackComponent}
                          ]},
                          {path : '', pathMatch:'full', redirectTo : '/user/home'}
                        ]},               
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
