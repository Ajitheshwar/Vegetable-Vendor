import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LegendPosition } from '@swimlane/ngx-charts';
import { BarVertical2dType, CategoryDashboard, MonthDashboard } from 'src/models/dashboard';
import { AdminDataService } from '../admin-data.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  constructor(private data: AdminDataService, private router : Router) {}

  ngOnInit(): void {
    this.presentMonth = new Date().getMonth()
    this.data.getDashboardDetails().subscribe({
      next: (result) => {
        this.displayAdminData(result.data);
      },
      error: console.log,
    });

    this.updateMonthOptions()

    this.data.getDashboardDetailsOfMonth(this.presentMonth).subscribe({
      next : (result)=>{
        this.updateDashboardDetailsOfMonth(result.data)
      },
      error : console.log
    })
    
    this.getDashboardDetailsOfCategory('Vegetable')
  }

  dashboardDetails: any = {
    totalLoss: 0,
    totalProfit: 0,
    totalRevenue: 0,
    netIncome : 0
  };
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

  dashboardDetailsOfMonth : BarVertical2dType[] = []
  legendPosition = LegendPosition.Below
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

  graphDashboardDetailsOfProducts : any[] = []
  dashboardDetailsOfProducts : CategoryDashboard[] = []

  displayAdminData(data: any) {
    for(let key in data){
      let den = 10;
      while (data[key] / den >= 10) {
        den *= 10;
      }
      // console.log(key,data[key],den)
      this.animateNumber(key, data[key], den)
    }
    let den = 10;
    let netIncome = data.totalRevenue - data.totalLoss
    while(netIncome / den >=10) den *=10
    this.animateNumber('netIncome',netIncome, den)
  }

  animateNumber(doc: string, sum: number, number: number) {
    if (number === sum) return;
    let a = Math.floor((sum - number) / 2);
    setTimeout(() => {
      this.dashboardDetails[doc] = number + a;
      this.animateNumber(doc, sum, number + a);
    },50);
  }

  getDetailsOfMonth(ref : any){
    this.data.getDashboardDetailsOfMonth(this.presentMonth - ref.target.value).subscribe({
      next : (result)=>{
        this.updateDashboardDetailsOfMonth(result.data)
      },
      error : console.log
    })
  }

  updateDashboardDetailsOfMonth(data : MonthDashboard[]){
    let profits = [], losses = []
    for (let day of data) {
      losses.push({
        name: day.date.split("T")[0].split("-").reverse().join("-"),
        value: day.loss
      });
      profits.push({
        name: day.date.split("T")[0].split("-").reverse().join("-"),
        value: day.profit
      });
    }
    this.dashboardDetailsOfMonth = [
      {
        name: 'Profit',
        series: profits,
      },
      {
        name: 'Loss',
        series: losses,
      },
    ];
  }

  getDashboardDetailsOfCategory(category  : string){
    this.data.getCategoryDashboardDetails(category).subscribe({
      next : (result)=>{
        // console.log(result.data)
        this.dashboardDetailsOfProducts = result.data
        this.graphDashboardDetailsOfProducts = []
        for(let product of result.data){
          let obj = {
            name : product._id,
            series : [
              {
                name : "Profit",
                value : product.profit
              },
              {
                name : "Loss",
                value : product.loss
              }
            ]
          }
          this.graphDashboardDetailsOfProducts.push(obj)
        }
        // console.log(this.graphDashboardDetailsOfProducts)
      },
      error : console.log
    })
  }

  navigateToSingleProduct( product : string){
    this.router.navigateByUrl("/admin/single-product/"+product)
  }
}
