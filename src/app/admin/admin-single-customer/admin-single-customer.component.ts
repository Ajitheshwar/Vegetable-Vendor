import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Order } from 'src/models/product';
import { AdminSingleUserDetails, Message } from 'src/models/user';
import { AdminDataService } from '../admin-data.service';

@Component({
  selector: 'app-admin-single-customer',
  templateUrl: './admin-single-customer.component.html',
  styleUrls: ['./admin-single-customer.component.css']
})
export class AdminSingleCustomerComponent implements OnInit {

  constructor(private data: AdminDataService, private ar: ActivatedRoute) { }

  ngOnInit(): void {
    let id = this.ar.snapshot.params['id']
    console.log(id)
    this.data.getCustomerDetails(id).subscribe({
      next: (result) => {
        console.log(result.data)
        this.customerDetails = result.data
        this.loadedCustomerDetails = true;
        this.data.getAdminChatMessages(result.data.email_address).subscribe({
          next: (result) => {
            console.log(result)
            this.loadedChatMessages = true;
            this.chatMessages = result.messages
          }
        })
      },
      error: console.log
    })

  }

  loadedCustomerDetails: boolean = false;
  loadedOrderDetails: boolean = false;
  loadedChatMessages: boolean = false;
  customerDetails: AdminSingleUserDetails = {
    _id: '',
    first_name: '',
    last_name: '',
    image: '',
    contact_number: '',
    email_address: '',
    orders: [{
      _id: '',
      date: '',
      modeOfPayment: '',
      status: '',
      totalCost: 0
    }]
  }
  orderDetails: Order = {
    _id : '',
    date : new Date,
    address : {
      _id : '',
      houseNumber : '',
      area : '',
      streetNumber : 0,
      colony : '',
      district : '',
      pincode : '',
      floor : 0,
      landmark : '',
      title : ''
    },
    products : [],
    status : '',
    modeOfPayment : "COD",
    totalCost : 0,
    customerId : '',
  }
  chatMessages: Message[] = []

  getOrderDetails(id: string) {
    this.data.getOrderDetails(id).subscribe({
      next: (result) => {
        console.log(result.data)
        this.orderDetails = result.data
        this.loadedOrderDetails = true
      },
      error: console.log
    })
  }

  sendMessage(ref: NgForm) {
    let email = this.customerDetails.email_address
    let data = {
      sender: 'admin',
      message: ref.value.message,
      user: email,
      time: new Date()
    }
    this.chatMessages.push(data)
    this.data.sendAdminChatMessage(data).subscribe({
      next: (result) => {
        console.log(result)
        ref.reset()
      },
      error: console.log
    })
  }
}
