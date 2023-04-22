import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from 'src/app/data.service';
import { Cart } from 'src/models/product';
import { Address } from 'src/models/user';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit{
  constructor(public router : Router, private data : DataService){}

  ngOnInit(): void {
    this.data.getAddresses().subscribe({
      next : (result)=>{
        console.log(result)
        this.addresses = result.message
        this.getSavedAddresses = true;
      },
      error : console.log
    })

    this.data.getCartDetails().subscribe({
      next: (result) => {
        this.cart = result;
        this.calculateTotalCost()
      },
      error : console.log
    });
  }

  displayAddressForm : boolean = false
  getSavedAddresses : boolean = false
  addresses : Address[] = []
  index : number = -1
  cart : Cart[] = []
  totalCost : number= 0;

  displayForm(){
    this.displayAddressForm = true
  }


  calculateTotalCost(){
    this.totalCost = 0
    for(let product of this.cart){
      this.totalCost += product.quantity * product.productId.sellingPrice
    }
  }


  addAddress(ref : NgForm){
    let obj = ref.value
    if(obj.title==='Other'){
      obj.title = obj.other
    }
    delete obj.other
    this.data.addAddress(obj).subscribe({
      next : (result)=>{
        console.log(result.message)
        this.addresses.push(obj)
        this.index = this.addresses.length-1
      },
      error : (error)=>{
        console.log(error)
      }
    })
  }

  placeOrder(ref : NgForm){
    if(this.index<0){
      alert("Select address")
      return
    }
    let obj = {
      address : this.addresses[this.index],
      modeOfPayment : ref.value.paymentType,
      totalCost : this.totalCost
    }
    let placeOrderBox = document.getElementById("order-placed")
    let loader = document.getElementById("loader")
    let orderPlacedCard = document.getElementById("order-placed-card")
    if(placeOrderBox){
      placeOrderBox.style.display = 'flex'
    }
    if(loader){
      loader.style.display = 'block'
    }
    if(orderPlacedCard){
      orderPlacedCard.style.display = 'none'
    }

    this.data.placeOrder(obj).subscribe({
      next : (result)=>{
        console.log(result)
        if(loader){
          loader.style.display = 'none'
        }
        setTimeout(()=>{
          if(placeOrderBox){
            placeOrderBox.style.display = 'none'
            // this.router.navigateByUrl("/user/products")
          }
        },6000)
        setTimeout(()=>{
          if(orderPlacedCard){
            orderPlacedCard.style.display = 'flex'
          }
        },500)
      },
      error : console.log
    })
  }
}
