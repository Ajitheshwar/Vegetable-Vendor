import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MonthDashboard, ProductDashboard } from 'src/models/dashboard';
import { Product, SingleProduct } from 'src/models/product';
import { AdminDataService } from '../admin-data.service';

@Component({
  selector: 'app-dashboard-product',
  templateUrl: './dashboard-product.component.html',
  styleUrls: ['./dashboard-product.component.css']
})
export class DashboardProductComponent implements OnInit {

  constructor(private ar:ActivatedRoute, private data : AdminDataService){}

  ngOnInit(): void {
    this.product = this.ar.snapshot.params['product']
    this.presentMonth = new Date().getMonth()
    
    this.data.getSingleProductDetails(this.product).subscribe({
      next : (result)=>{
        // console.log(result)
        this.presentDetails = {...result.data}
        this.totalStock = 0;
        for(let stock of result.data.stockFromPastDays){
          this.totalStock += stock
        }
      },
      error : console.log
    })
    this.updateMonthOptions()
    this.data.getSingleProductDashboardOfMonth(this.product, this.presentMonth + 1).subscribe({
      next : (result)=>{
        // console.log(result)
        this.productDashboardDetails = result.data
        this.updateGraphResults()
      }
    })
  }
  
  presentMonth : number = new Date().getMonth()
  months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
  ];
  monthOptions : string[] = []
  updateMonthOptions(){
    for(let i=this.presentMonth; i>=0;i--){
      this.monthOptions.push(this.months[i])
    }
  }
  product = ''
  presentDetails : SingleProduct = {
    wasted  :0,
    name : '',
    category : '',
    subCategory : '',
    costPrice  :0,
    sellingPrice : 0,
    stockFromPastDays : [],
    numberOfDays : 0
  }
  totalStock : number = 0
  productDashboardDetails : ProductDashboard[] = []
  graphDetails : any[]=[]
  colorScheme = [
    {
      name: 'Profit',
      value: '#17b317',
    },
    {
      name: 'Loss',
      value: '#ff0000',
    },
  ];

  getDetailsOfMonth(event : any){
    this.data.getSingleProductDashboardOfMonth(this.product, this.presentMonth - event.target.value + 1).subscribe({
      next : (result)=>{
        this.productDashboardDetails = result.data
        this.updateGraphResults()
      }
    })
  }
  updateGraphResults(){
    this.graphDetails = []
    for(let i=0;i<this.productDashboardDetails.length; i++){
      let day = this.productDashboardDetails[i]
      let dateArray = day.date.split("T")[0].split("-").reverse()
      
      if(i==0){
        dateArray[0] = '1'
        dateArray[1] = String((Number(dateArray[1]) + 1)%12)
      }else{
        dateArray[0] = String(Number(dateArray[0]) + 1)
        dateArray[1] = String(Number(dateArray[1]))
      }
      
      let date : string= dateArray.join('-')
      let obj = {
        name : date,
        series : [
          {
            name : "Profit",
            value : (day.sellingPrice-day.costPrice)*day.quantity
          },
          {
            name : "Loss",
            value : day.wasted * day.costPrice
          }
        ]
      }
      this.graphDetails.push(obj)
    }
    // console.log(this.graphDetails)
  }
}
