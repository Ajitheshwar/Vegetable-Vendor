import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DataService } from 'src/app/data.service';
import { Cart, CatandSubCat, Product } from 'src/models/product';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  constructor(private data : DataService){}

  ngOnInit(): void {
    this.loadedProductsData = false
    this.data.getCategoriesAndSubCategories().subscribe({
      next : (result) => {
        console.log(result)
        this.categoriesAndSubCategories = result
      }
    })
    this.category = 'all'
    this.getProductsOf = 1
    this.selectProductsWithCategory(1)

    this.data.getCartDetails().subscribe({
      next : (result)=>{
        this.cart = result
      }
    })
  }

  loadedProductsData:boolean = false
  categoriesAndSubCategories : Array<CatandSubCat> = []
  totalProducts : Array<Product> = []
  productInModalIndex : number = 0
  benefitsBoolean : boolean = false
  cart : Array<Cart> = []
  quantity = 0;
  maxPages : number = 0;
  page : number = 0;
  getProductsOf: number = 1 //1-category      2-subCategories     3-search
  category = "all"
  subCategories = ""
  search : any = ""


  timerId :any = undefined
  searchProducts() {
      if(this.timerId) clearTimeout(this.timerId)
      this.timerId = setTimeout(()=>{
          //console.log(productName)
          this.applySearchFilter()
          this.timerId = undefined
      },1000)
  }

  loadProductsData(page:number){
    if(this.getProductsOf === 1){
      this.selectProductsWithCategory(page)
    }
    else if(this.getProductsOf === 2){
      this.selectProductsWithFilter(page)
    }
    else{
      this.selectProductWithProductName(page)
    }
  }

  applyFilters(refFilter : NgForm){
    // console.log(refFilter.value)
    let text = ""
    for(let key in refFilter.value){
      if(refFilter.value[key]){
        text += key+"+"
      }
    }
    text = text.substring(0,text.length -1)
    this.subCategories = text
    this.getProductsOf = 2
    this.selectProductsWithFilter(1)
  }

  applyCategoryFilter(category : string){
    this.getProductsOf = 1
    this.category = category
    this.selectProductsWithCategory(1)
  }

  applySearchFilter(){
    console.log(this.search)
    if(this.search===''){
      this.applyCategoryFilter('all')
    }else{
      this.getProductsOf = 3
      this.selectProductWithProductName(1)
    }
  }

  selectProductsWithFilter(page:number){
    this.data.getFilteredProducts(this.subCategories, page).subscribe({
      next  : (result)=>{
        this.totalProducts = result.data
        this.maxPages = result.total_pages
        this.page = page;
      }
    })
  }


  selectProductsWithCategory(page : number){
    this.getProductsOf = 1
    this.data.getCategoryProducts(this.category,page).subscribe({
      next : (result)=>{
        this.totalProducts = result.data
        this.maxPages = result.total_pages
        this.page = page;
        this.loadedProductsData = true;
      }
    })
  }

  selectProductWithProductName(page : number){
    this.data.getSearchedProducts(this.search, page).subscribe({
      next : (result)=>{
        this.totalProducts = result.data
        this.maxPages = result.total_pages
        this.page = page
      }
    })
  }

  modalContent(index : number){
    this.productInModalIndex = index
    this.quantity = 0
    for(let product of this.cart){
      if(product.name === this.totalProducts[index].name){
        this.quantity = product.quantity
      }
    }
  }

  updateBenefitsBoolean(){
    this.benefitsBoolean = !this.benefitsBoolean 
  }

  updateQuantity(value:number){
    let productExistsInCart = false;
    for(let i=0;i<this.cart.length;i++){
      if(this.cart[i].name === this.totalProducts[this.productInModalIndex].name){
        productExistsInCart = true;
        this.cart[i].quantity = this.cart[i].quantity + value
        this.quantity = this.cart[i].quantity
        if(this.cart[i].quantity <=0) this.cart.splice(i,1)
      }
    }
    if(!productExistsInCart && value>0){
      let product = this.totalProducts[this.productInModalIndex]
      let obj = {
        name : product.name,
        productId : product._id,
        quantity : value
      }
      this.quantity = value
      this.cart.push(obj)
    }
    console.log(this.cart)
    this.data.updateCartDetails(this.cart).subscribe({
      next : (result)=>{
        console.log(result)
      }
    })
  }

}
