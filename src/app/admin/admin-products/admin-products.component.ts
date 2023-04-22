import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  NgForm,
  Validators,
} from '@angular/forms';
import { map, Observable } from 'rxjs';
import { AdminProduct, CatandSubCat } from 'src/models/product';
import { AdminDataService } from '../admin-data.service';

@Component({
  selector: 'app-admin-products',
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.css'],
})
export class AdminProductsComponent implements OnInit {
  constructor(private data: AdminDataService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.categoriesAndSubCategories$ =
      this.data.getCategoriesAndSubCategories();
    this.data.getProducts().subscribe({
      next: (result) => {
        this.totalProducts = result.products;
        this.products = result.products;
        this.loadedProducts = true;
        this.updateNotifications();
        this.getOrderProducts();
      },
    });
  }

  orderProducts = this.fb.group({
    products: this.fb.array([]),
  });

  totalProducts: AdminProduct[] = [];
  categoriesAndSubCategories$: any;
  allowFilters: boolean = false;
  products: AdminProduct[] = [];
  showMoreData: boolean = false;
  loadedProducts: boolean = false;
  editProductIndex: number = -1;
  notifications: any[] = [];
  search: string = '';

  updateNotifications() {
    this.notifications = [];
    for (let product of this.totalProducts) {
      let quantity = this.calculateQuantity(product.stockFromPastDays);
      if (quantity < 50) {
        this.notifications.push({
          name: product.name,
          quantity,
          category: product.category,
          subCategory: product.subCategory,
        });
      }
    }
  }

  getOrderProducts() {
    let formArray = this.orderProducts.get('products') as FormArray;
    for (let product of this.totalProducts) {
      let formGroupOfProduct = this.fb.group(
        {
          quantity: [0, [Validators.min(0), Validators.required]],
          costPrice: [
            product.costPrice,
            [Validators.min(0), Validators.required],
          ],
          sellingPrice: [
            product.sellingPrice,
            [Validators.min(0), Validators.required],
          ],
        },
        { validators: this.validateCostPriceAndSellingPrice }
      );
      formArray.push(formGroupOfProduct);
    }
  }

  getProductAtIndex(index : number){
    return (this.orderProducts.get('products') as FormArray).at(index)
  }

  updateOrderProductsInDB(){
    let values : any = this.orderProducts.value.products
    let updateDetails = []
    for(let i=0;i<this.totalProducts.length;i++){
      let obj = {
        ...values[i]
      }
      let array  = this.totalProducts[i].stockFromPastDays
      array[array.length-1] += values[i].quantity
      
      obj.quantity = array
      obj.name = this.totalProducts[i].name
      updateDetails.push(obj)
    }
    this.data.updateProductTodayData(updateDetails).subscribe({
      next : (result)=>{
        alert(result.message)
        this.products = this.totalProducts = result.data
      },
      error : console.log
    })
  }

  validateCostPriceAndSellingPrice(control: AbstractControl) {
    let costPrice = control.get('costPrice')?.value;
    let sellingPrice = control.get('sellingPrice')?.value;
    return costPrice && sellingPrice && costPrice > sellingPrice
      ? {
          costPrice,
          sellingPrice,
          message: 'costPrice is greater than sellingPrice',
        }
      : null;
  }


  calculateQuantity(values: number[]) {
    return values.reduce((sum, value) => sum + value);
  }

  showAndHideMoreData() {
    this.showMoreData = !this.showMoreData;
  }

  applyCategoryFilter(category: string) {
    // console.log(this.totalProducts)
    if (category === 'all') {
      this.products = this.totalProducts;
      return;
    }
    this.products = this.totalProducts.filter(
      (product) => product.category === category
    );
  }

  toggleFilters() {
    this.allowFilters = !this.allowFilters;
  }

  applyFilters(ref: NgForm) {
    let subCategories: string[] = [];
    for (let key in ref.value) {
      if (ref.value[key]) {
        subCategories.push(key);
      }
    }
    this.products = this.totalProducts.filter((product) =>
      subCategories.find((subCategory) => subCategory === product.subCategory)
    );
  }

  editProducts(index: number) {
    this.editProductIndex = index;
    this.showMoreData = true;
  }

  updateProduct(ref: NgForm) {
    let obj = { ...ref.value };
    obj.benefits = obj.benefits.split('::');
    obj.id = this.products[this.editProductIndex]._id;
    // console.log(obj)
    this.data.updateProduct(obj).subscribe({
      next: (result) => {
        alert(result.message);
      },
      error: console.log,
    });
  }
}
