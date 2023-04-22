import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/data.service';
import { Cart } from 'src/models/product';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  constructor(public router: Router, private data: DataService) {}

  ngOnInit(): void {
    this.data.getCartDetails().subscribe({
      next: (result) => {
        this.cart = result;
        this.calculateTotalCost()
      },
    });
  }

  cart: Cart[] = [];
  totalCost = 0;

  calculateTotalCost(){
    this.totalCost = 0
    for(let product of this.cart){
      this.totalCost += product.quantity * product.productId.sellingPrice
    }
  }

  updateQuantity(index:number, value:number){
    this.cart[index].quantity += (value)
    if(this.cart[index].quantity <=0) this.cart.splice(index,1)
    this.calculateTotalCost()
    this.data.updateCartDetails(this.cart).subscribe({
      next : (result)=>{
        console.log(result)
      }
    })
  }
}
