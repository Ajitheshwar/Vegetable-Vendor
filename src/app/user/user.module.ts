import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserRoutingModule } from './user-routing.module';

import { UserComponent } from './user.component';
import { CartComponent } from './cart/cart.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { AccountComponent } from './account/account.component';
import { EditAccountComponent } from './edit-account/edit-account.component';
import { AddressBookComponent } from './address-book/address-book.component';
import { SendFeedbackComponent } from './send-feedback/send-feedback.component';
import { OrdersComponent } from './orders/orders.component';
import { AppCommonModule } from '../app-common/app-common.module';

@NgModule({
  declarations: [
    UserComponent,
    CartComponent,
    CheckoutComponent,
    AccountComponent,
    EditAccountComponent,
    AddressBookComponent,
    SendFeedbackComponent,
    OrdersComponent
  ],
  imports: [CommonModule, UserRoutingModule, FormsModule, ReactiveFormsModule, AppCommonModule],
  providers: [],
})
export class UserModule {}
