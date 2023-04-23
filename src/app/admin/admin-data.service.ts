import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { AdminProduct } from 'src/models/product';
import { Message } from 'src/models/user';

@Injectable()
export class AdminDataService {

  constructor(private http : HttpClient) { }

  httpErrorHandler(error: HttpErrorResponse) {
    console.log(error);
    return throwError(() => {
      return error.error.message;
    });
  }

  getCategoriesAndSubCategories() : Observable<{data : any[]}>{
    return this.http.get<any>("http://localhost:3000/admin/categoriesAndSubCategories").pipe(catchError(this.httpErrorHandler))
  }

  getProducts() : Observable<{products : AdminProduct[]}>{
    return this.http.get<any>("http://localhost:3000/admin/products").pipe(catchError(this.httpErrorHandler))
  }

  updateProduct(obj : any) : Observable<{message : string}>{
    return this.http.put<any>("http://localhost:3000/admin/products",obj).pipe(catchError(this.httpErrorHandler))
  }

  addProduct(data : FormData) : Observable<any>{
    return this.http.post<any>("http://localhost:3000/admin/products/addProduct",data).pipe(catchError(this.httpErrorHandler))
  }

  updateProductImage(data : FormData){
    return this.http.put<any>("http://localhost:3000/admin/products/updateImage",data).pipe(catchError(this.httpErrorHandler))
  }

  updateProductTodayData(data : any) : Observable<{message : string, data : AdminProduct[]}>{
    return this.http.post<any>("http://localhost:3000/admin/products/todayInfo",{data}).pipe(catchError(this.httpErrorHandler))
  }

  getCustomers(page : number) : Observable<{maxPages : number, data : any[]}>{
    return this.http.get<any>("http://localhost:3000/admin/customers?page="+page).pipe(catchError(this.httpErrorHandler))
  }

  getCustomersBySearch(searchBy : string,search : string, page : number) : Observable<{maxPages : number, data : any[]}>{
    return this.http.get<any>(`http://localhost:3000/admin/customers?${searchBy}=${search}&page=${page}`).pipe(catchError(this.httpErrorHandler))
  }

  getCustomerDetails(id : string) : Observable<{data : any}>{
    return this.http.get<any>("http://localhost:3000/admin/customers/single-customer/"+id).pipe(catchError(this.httpErrorHandler))
  }

  getOrderDetails(id : string) : Observable<{data : any}>{
    return this.http.get<any>("http://localhost:3000/admin/customers/customer-order/"+id).pipe(catchError(this.httpErrorHandler))
  }

  getAdminChatMessages(email : string) : Observable<{messages : Message[]}>{
    return this.http.get<any>("http://localhost:3000/admin/getMessages/"+email).pipe(catchError(this.httpErrorHandler))
  }

  sendAdminChatMessage(data : Message) : Observable<any>{
    return this.http.post<any>("http://localhost:3000/admin/sendMessage",data).pipe(catchError(this.httpErrorHandler))
  }
}
