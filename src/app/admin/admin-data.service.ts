import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { AdminProduct } from 'src/models/product';

@Injectable()
export class AdminDataService {

  constructor(private http : HttpClient) { }

  httpErrorHandler(error: HttpErrorResponse) {
    console.log(error);
    return throwError(() => {
      return error.error.message;
    });
  }

  getCategoriesAndSubCategories(){
    return this.http.get("http://localhost:3000/admin/categoriesAndSubCategories").pipe(catchError(this.httpErrorHandler))
  }

  getProducts() : Observable<{products : AdminProduct[]}>{
    return this.http.get<any>("http://localhost:3000/admin/products").pipe(catchError(this.httpErrorHandler))
  }

  updateProduct(obj : any) : Observable<{message : string}>{
    return this.http.put<any>("http://localhost:3000/admin/products",obj).pipe(catchError(this.httpErrorHandler))
  }

  updateProductTodayData(data : any) : Observable<{message : string, data : AdminProduct[]}>{
    return this.http.post<any>("http://localhost:3000/admin/products/todayInfo",{data}).pipe(catchError(this.httpErrorHandler))
  }

  getCustomers(page : number) : Observable<{maxPages : number, data : any[]}>{
    return this.http.get<any>("http://localhost:3000/admin/customers?page="+page).pipe(catchError(this.httpErrorHandler))
  }
}
