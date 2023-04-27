import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  NgForm,
  Validators,
} from '@angular/forms';
import { LegendPosition } from '@swimlane/ngx-charts';
import { BarVertical2dType, DayDashboard, ProductDashboard } from 'src/models/dashboard';
import { Order } from 'src/models/product';
import { AdminDataService } from '../admin-data.service';

@Component({
  selector: 'app-admin-orders',
  templateUrl: './admin-orders.component.html',
  styleUrls: ['./admin-orders.component.css'],
})
export class AdminOrdersComponent implements OnInit {
  constructor(private data: AdminDataService, private fb: FormBuilder) { }
  ngOnInit(): void {
    this.getAllOrders = true;
    this.loadOrdersData(1);
    this.data.getTodayOrdersDetails().subscribe({
      next: (result) => {
        this.todaysDashboard = result.data;
      },
      error: console.log,
    });
    this.getTodayProductDetails();
  }

  loadedOrderDetails: boolean = false;
  loadedSingleOrderDetails: boolean = false;
  orderDetails: any;
  page: number = 1;
  orders: Order[] = [];
  maxPages: number = 1;
  getAllOrders: boolean = true;
  date: string = '';
  today: string = new Date().toISOString().split('T')[0];
  todaysDashboard: DayDashboard = {
    revenue: 0,
    profit: 0,
    loss: 0,
    customers: 0,
    orders: 0,
  };
  todayProductDetails: ProductDashboard[] = [];
  loadedTodayProductDetails: boolean = false;
  legendPosition = LegendPosition.Below;
  chartDetails: BarVertical2dType[] = [];
  colorScheme = [
    {
      name: 'Profit',
      value: '#198345',
    },
    {
      name: 'Loss',
      value: '#ff0000',
    },
  ];
  productNames: string[] = [];
  compareAllProducts: boolean = false;
  twoProducts = this.fb.group(
    {
      product1: ['', Validators.required],
      product2: ['', Validators.required],
    },
    { validators: this.checkProductsUnequality }
  );

  checkProductsUnequality(control: AbstractControl) {
    let product1 = control.get('product1')?.value;
    let product2 = control.get('product2')?.value;
    return product1 && product2 && product1 === product2
      ? { productsEqual: true }
      : null;
  }

  loadOrdersData(page: number) {
    this.page = page;
    if (this.getAllOrders) {
      this.loadAllOrders();
    } else {
      this.loadOrdersByDate();
    }
  }

  updateOrderStatus(status: string, id: string, index: number) {
    this.data.updateOrderStatus(status, id).subscribe({
      next: (result) => {
        this.orders[index].status = status;
      },
      error: console.log,
    });
  }

  loadAllOrders() {
    this.data.getOrders(this.page).subscribe({
      next: (result) => {
        (this.orders = result.data),
          (this.maxPages = result.maxPages),
          (this.loadedOrderDetails = true);
      },
    });
  }

  loadOrdersByDate() {
    this.data.getOrdersByDate(this.date, this.page).subscribe({
      next: (result) => {
        (this.orders = result.data),
          (this.maxPages = result.maxPages),
          (this.loadedOrderDetails = true);
        console.log(result);
      },
    });
  }

  reset() {
    this.getAllOrders = true;
    this.loadOrdersData(1);
  }

  getOrdersOfDate(event: any) {
    this.getAllOrders = false;
    this.date = event.target.value;
    this.loadOrdersData(1);
  }

  getOrderDetails(id: string) {
    this.data.getOrderDetails(id).subscribe({
      next: (result) => {
        console.log(result.data);
        this.orderDetails = result.data;
        this.loadedSingleOrderDetails = true;
      },
      error: console.log,
    });
  }

  displayAllProductDashboard() {
    this.compareAllProducts = true;
    let profits = [];
    let losses = [];
    for (let product of this.todayProductDetails) {
      this.productNames.push(product.product);
      losses.push({
        name: product.product,
        value: product.costPrice * product.wasted,
      });
      profits.push({
        name: product.product,
        value: (product.sellingPrice - product.costPrice) * product.quantity,
      });
    }
    this.chartDetails = [
      {
        name: 'Profit',
        series: profits,
      },
      {
        name: 'Loss',
        series: losses,
      },
    ];
    this.loadedTodayProductDetails = true;
  }

  compareTwoProductsData() {
    this.compareAllProducts = false;
    this.chartDetails = [];
  }

  getDetailsOfTwoProducts() {
    let obj = this.twoProducts.value;
    if (obj.product1 && obj.product2) {
      this.data.compareTwoProductsData(obj.product1, obj.product2).subscribe({
        next: (result) => {
          // console.log(result)
          let series1 = []
          let series2 = []

          for (let product of result.data) {
            let obj1 = {
              name: product.date.split("T")[0],
              value: product.quantity
            }
            if (obj.product1 === product.product) {
              series1.push(obj1)
            } else {
              series2.push(obj1)
            }
          }
          if (obj.product1 && obj.product2) {
            let products = [{
              name: obj.product1,
              series: series1
            }, {
              name: obj.product2,
              series: series2
            }]
            this.chartDetails = products
          }
        }
      })
    }
  }

  getTodayProductDetails() {
    this.data.getTodayProductsDetails().subscribe({
      next: (result) => {
        this.todayProductDetails = result.data;
        this.displayAllProductDashboard();
      },
      error: console.log,
    });
  }
}
