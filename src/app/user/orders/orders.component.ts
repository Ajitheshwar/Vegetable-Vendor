import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/data.service';
import { Order } from 'src/models/product';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  constructor(private data : DataService){}

  ngOnInit(): void {
    this.data.getOrderDetails().subscribe({
      next : (result)=>{
        this.orders = result.message
        this.orders.reverse()
        this.fetchedOrderDetails = true
      }
    })
  }
  fetchedOrderDetails : boolean = false;
  orders : Order[] = []

  modalOrder : Order = {
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

  updateModalOrderContent(index : number){
    this.modalOrder = this.orders[index]
  }
}
