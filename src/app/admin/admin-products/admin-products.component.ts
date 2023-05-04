import { Component, OnInit, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  NgForm,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { AdminProduct, CatandSubCat, ProductNotification } from 'src/models/product';
import { AdminDataService } from '../admin-data.service';

@Component({
  selector: 'app-admin-products',
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.css'],
})
export class AdminProductsComponent implements OnInit {
  constructor(private data: AdminDataService, private fb: FormBuilder) {}

  @ViewChild('previewImageContainer') previewImageContainer: any;

  ngOnInit(): void {
    this.data.getCategoriesAndSubCategories().subscribe({
      next : (result)=>{
        this.categoriesAndSubCategories = result.data
      },
      error : console.log
    });
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

  validateCostPriceAndSellingPrice(
    control: AbstractControl
  ): ValidationErrors | null {
    let costPrice = control.get('costPrice')?.value;
    let sellingPrice = control.get('sellingPrice')?.value;
    return costPrice && sellingPrice && costPrice >= sellingPrice
      ? {
          costPrice,
          sellingPrice,
          message: 'costPrice is greater than sellingPrice',
        }
      : null;
  }

  orderProducts = this.fb.group({
    products: this.fb.array([]),
  });

  newProduct = this.fb.group(
    {
      name: ['', Validators.required],
      category: ['', Validators.required],
      subCategory: ['', Validators.required],
      description: ['', Validators.required],
      benefits: this.fb.array([], [Validators.required, Validators.minLength(3)]),
      costPrice: [0, [Validators.required, Validators.min(1)]],
      sellingPrice: [0, [Validators.required, Validators.min(1)]],
      productImage: [null, Validators.required],
      numberOfDays: [-1, this.validateNumberOfDays],
    },
    { validators: this.validateCostPriceAndSellingPrice }
  );

  validateNumberOfDays( control : AbstractControl) : ValidationErrors | null {
    let value : number = control.value
    if(value > 15 || value == 0 || value <-1) return {invaid : true }
    return null
  }

  get name(){
    return this.newProduct.get('name') as FormControl
  }

  get category(){
    return this.newProduct.get('category') as FormControl
  }

  get subCategory(){
    return this.newProduct.get('subCategory') as FormControl
  }

  get description(){
    return this.newProduct.get('description') as FormControl
  }

  get costPrice(){
    return this.newProduct.get('costPrice') as FormControl
  }

  get sellingPrice(){
    return this.newProduct.get('sellingPrice') as FormControl
  }

  get productImage(){
    return this.newProduct.get('productImage') as FormControl
  }

  get numberOfDays(){
    return this.newProduct.get('numberOfDays') as FormControl
  }

  get benefits() {
    return this.newProduct.get('benefits') as FormArray;
  }

  addNewBenefit() {
    this.benefits.push(this.fb.control('',Validators.required));
  }

  deleteBenefit(index: number) {
    this.benefits.removeAt(index);
  }

  
  productUpdateImage = this.fb.group({
    id : [''],
    name : [''],
    image : [''],
    productImage : []
  })

  totalProducts: AdminProduct[] = [];
  categoriesAndSubCategories: CatandSubCat[] = [];
  allowFilters: boolean = false;
  products: AdminProduct[] = [];
  showMoreData: boolean = false;
  loadedProducts: boolean = false;
  editProductIndex: number = -1;
  notifications: ProductNotification[] = [];
  search: string = '';

  updateProductImageDetails(image : string,name : string, id : string){
    this.productUpdateImage.patchValue({
      image : image,
      name : name,
      id : id
    })
  }

  updateProductImagePhoto(event : any){
    // console.log("Hi")
    let fileInput = event.target as HTMLFormElement;
    // console.log("Hi")
    if (fileInput['files'] && fileInput['files'].length > 0) {
      let src = URL.createObjectURL(fileInput['files'][0]);
      this.productUpdateImage.patchValue({
        image : src,
        productImage : fileInput['files'][0]
      })
      console.log(this.productUpdateImage.value)
    }
  }

  updateProductImage(){
    let obj : any= {...this.productUpdateImage.value}
    let formData = new FormData()
    formData.append("id",obj.id)
    formData.append("productImage",obj.productImage)

    this.data.updateProductImage(formData).subscribe({
      next : (result)=>{
        alert("Updated Product Image Successfully")
      },
      error : console.log
    })
  }

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

  previewImageUser(event: any) {
    // console.log("Hi")
    let fileInput = event.target as HTMLFormElement;
    if (fileInput['files'] && fileInput['files'].length > 0) {
      let src = URL.createObjectURL(fileInput['files'][0]);
      this.previewImageContainer.nativeElement.src = src;
      this.previewImageContainer.nativeElement.className = 'profile-image';
      // console.log(event);
      const file = fileInput['files'][0];
      this.newProduct.patchValue({
        productImage: file,
      });
    }
  }

  addProduct() {
    let value: any = { ...this.newProduct.value };
    value.benefits = JSON.stringify(value.benefits);
    console.log(value)
    let formData = new FormData();
    for (let key in value) {
      formData.append(key, value[key]);
    }
    this.data.addProduct(formData).subscribe({
      next: (result)=>{
        alert(result.message)
      },
      error: console.log,
    });
  }

  getOrderProducts() {
    let formArray = this.orderProducts.get('products') as FormArray;
    for (let product of this.totalProducts) {
      let formGroupOfProduct = this.fb.group(
        {
          quantity: [0, [Validators.min(0), Validators.required]],
          costPrice: [
            product.costPrice,
            [Validators.min(1), Validators.required],
          ],
          sellingPrice: [
            product.sellingPrice,
            [Validators.min(1), Validators.required],
          ],
        },
        { validators: this.validateCostPriceAndSellingPrice }
      );
      formArray.push(formGroupOfProduct);
    }
  }

  getProductAtIndex(index: number) {
    return (this.orderProducts.get('products') as FormArray).at(index);
  }

  updateOrderProductsInDB() {
    let values: any = this.orderProducts.value.products;
    let updateDetails = [];
    for (let i = 0; i < this.totalProducts.length; i++) {
      let obj = {
        ...values[i],
      };
      let array = this.totalProducts[i].stockFromPastDays;
      array[array.length - 1] += values[i].quantity;

      obj.quantity = array;
      obj.name = this.totalProducts[i].name;
      updateDetails.push(obj);
    }
    this.data.updateProductTodayData(updateDetails).subscribe({
      next: (result) => {
        // console.log(result)
        alert(result.message);
        this.products = this.totalProducts = result.data;
      },
      error: console.log,
    });
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
