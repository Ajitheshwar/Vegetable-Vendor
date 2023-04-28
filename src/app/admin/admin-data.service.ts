import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { adminURLs } from 'src/config';
import { CategoryDashboard, DayDashboard, MonthDashboard, ProductDashboard, TotalDashboard } from 'src/models/dashboard';
import { AdminProduct, CatandSubCat, Order, SingleProduct } from 'src/models/product';
import { AdminSingleUserDetails, AdminUserDetails, Message } from 'src/models/user';

@Injectable()
export class AdminDataService {

  constructor(private http: HttpClient) { }

  httpErrorHandler(error: HttpErrorResponse) {
    console.log(error);
    return throwError(() => {
      return error.error.message;
    });
  }

  baseURL = 'http://localhost:3000'

  //Products
  getCategoriesAndSubCategories(): Observable<{ data: CatandSubCat[] }> {
    return this.http.get<any>(adminURLs.CategoriesndSubCategories ).pipe(catchError(this.httpErrorHandler))
  }

  getProducts(): Observable<{ products: AdminProduct[] }> {
    return this.http.get<any>(adminURLs.Products).pipe(catchError(this.httpErrorHandler))
  }

  updateProduct(obj: any): Observable<{ message: string }> {
    return this.http.put<any>(adminURLs.Products, obj).pipe(catchError(this.httpErrorHandler))
  }

  addProduct(data: FormData): Observable<any> {
    return this.http.post<any>(adminURLs.AddProduct, data).pipe(catchError(this.httpErrorHandler))
  }

  updateProductImage(data: FormData) {
    return this.http.put<any>(adminURLs.UpdateProductImage, data).pipe(catchError(this.httpErrorHandler))
  }

  updateProductTodayData(data: any): Observable<{ message: string, data: AdminProduct[] }> {
    return this.http.post<any>(adminURLs.TodaysInfo, { data }).pipe(catchError(this.httpErrorHandler))
  }


  //Customers
  getCustomers(page: number): Observable<{ maxPages: number, data: AdminUserDetails[] }> {
    return this.http.get<any>(adminURLs.Customers+"?page=" + page).pipe(catchError(this.httpErrorHandler))
  }

  getCustomersBySearch(searchBy: string, search: string, page: number): Observable<{ maxPages: number, data: AdminUserDetails[] }> {
    return this.http.get<any>(`${this.baseURL}${adminURLs.Customers}?${searchBy}=${search}&page=${page}`).pipe(catchError(this.httpErrorHandler))
  }

  getCustomerDetails(id: string): Observable<{ data: AdminSingleUserDetails }> {
    return this.http.get<any>(adminURLs.SingleCustomer + id).pipe(catchError(this.httpErrorHandler))
  }

  getOrderDetails(id: string): Observable<{ data: Order }> {
    return this.http.get<any>(adminURLs.CustomerOrder+ id).pipe(catchError(this.httpErrorHandler))
  }

  getAdminChatMessages(email: string): Observable<{ messages: Message[] }> {
    return this.http.get<any>(adminURLs.Messages+ email).pipe(catchError(this.httpErrorHandler))
  }

  sendAdminChatMessage(data: Message): Observable<{message : string}> {
    return this.http.post<any>(adminURLs.SendMessage, data).pipe(catchError(this.httpErrorHandler))
  }

  //Orders
  getOrders(page: number): Observable<{ data: Order[], maxPages: number }> {
    return this.http.get<any>(adminURLs.Orders+"?page=" + page).pipe(catchError(this.httpErrorHandler))
  }

  getOrdersByDate(date: string, page: number): Observable<{ data: Order[], maxPages: number }> {
    return this.http.get<any>(adminURLs.Orders+"?page=" + page + "&date=" + date).pipe(catchError(this.httpErrorHandler))
  }

  getTodayOrdersDetails(): Observable<{ data: DayDashboard }> {
    return this.http.get<any>(adminURLs.TodayOrdersInfo).pipe(catchError(this.httpErrorHandler))
  }

  getTodayProductsDetails(): Observable<{ data: ProductDashboard[] }> {
    return this.http.get<any>(adminURLs.TodayProducts).pipe(catchError(this.httpErrorHandler))
  }

  updateOrderStatus(status: string, id: string): Observable<{ message: string }> {
    return this.http.put<any>(adminURLs.OrderStatus + id, { status }).pipe(catchError(this.httpErrorHandler))
  }

  compareTwoProductsData(p1: string, p2: string): Observable<{ data: any[] }> {
    return this.http.get<any>(adminURLs.CompareTwoProducts + p1 + "/" + p2).pipe(catchError(this.httpErrorHandler))
  }

  //dashboard
  getDashboardDetails(): Observable<{ data: TotalDashboard }> {
    return this.http.get<any>(adminURLs.AdminDashboard).pipe(catchError(this.httpErrorHandler))
  }

  getDashboardDetailsOfMonth(month: number): Observable<{ data: MonthDashboard[] }> {
    return this.http.get<any>(adminURLs.MonthlyDashboard+ month).pipe(catchError(this.httpErrorHandler))
  }

  getCategoryDashboardDetails(category: string): Observable<{ data: CategoryDashboard[] }> {
    return this.http.get<any>(adminURLs.CategoryDashboard + category).pipe(catchError(this.httpErrorHandler))
  }

  getSingleProductDetails(product: string): Observable<{data : SingleProduct, wasted : number}> {
    return this.http.get<any>(adminURLs.SingleProduct + product).pipe(catchError(this.httpErrorHandler))
  }

  getSingleProductDashboardOfMonth(product: string, month: number): Observable<{data : ProductDashboard[]}> {
    return this.http.get<any>(adminURLs.SingleProductMonth+ product + "/" + month).pipe(catchError(this.httpErrorHandler))
  }
}
