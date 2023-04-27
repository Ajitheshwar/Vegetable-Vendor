import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
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

  //Products
  getCategoriesAndSubCategories(): Observable<{ data: CatandSubCat[] }> {
    return this.http.get<any>("http://localhost:3000/admin/categoriesAndSubCategories").pipe(catchError(this.httpErrorHandler))
  }

  getProducts(): Observable<{ products: AdminProduct[] }> {
    return this.http.get<any>("http://localhost:3000/admin/products").pipe(catchError(this.httpErrorHandler))
  }

  updateProduct(obj: any): Observable<{ message: string }> {
    return this.http.put<any>("http://localhost:3000/admin/products", obj).pipe(catchError(this.httpErrorHandler))
  }

  addProduct(data: FormData): Observable<any> {
    return this.http.post<any>("http://localhost:3000/admin/products/addProduct", data).pipe(catchError(this.httpErrorHandler))
  }

  updateProductImage(data: FormData) {
    return this.http.put<any>("http://localhost:3000/admin/products/updateImage", data).pipe(catchError(this.httpErrorHandler))
  }

  updateProductTodayData(data: any): Observable<{ message: string, data: AdminProduct[] }> {
    return this.http.post<any>("http://localhost:3000/admin/products/todayInfo", { data }).pipe(catchError(this.httpErrorHandler))
  }


  //Customers
  getCustomers(page: number): Observable<{ maxPages: number, data: AdminUserDetails[] }> {
    return this.http.get<any>("http://localhost:3000/admin/customers?page=" + page).pipe(catchError(this.httpErrorHandler))
  }

  getCustomersBySearch(searchBy: string, search: string, page: number): Observable<{ maxPages: number, data: AdminUserDetails[] }> {
    return this.http.get<any>(`http://localhost:3000/admin/customers?${searchBy}=${search}&page=${page}`).pipe(catchError(this.httpErrorHandler))
  }

  getCustomerDetails(id: string): Observable<{ data: AdminSingleUserDetails }> {
    return this.http.get<any>("http://localhost:3000/admin/customers/single-customer/" + id).pipe(catchError(this.httpErrorHandler))
  }

  getOrderDetails(id: string): Observable<{ data: Order }> {
    return this.http.get<any>("http://localhost:3000/admin/customers/customer-order/" + id).pipe(catchError(this.httpErrorHandler))
  }

  getAdminChatMessages(email: string): Observable<{ messages: Message[] }> {
    return this.http.get<any>("http://localhost:3000/admin/getMessages/" + email).pipe(catchError(this.httpErrorHandler))
  }

  sendAdminChatMessage(data: Message): Observable<{message : string}> {
    return this.http.post<any>("http://localhost:3000/admin/sendMessage", data).pipe(catchError(this.httpErrorHandler))
  }

  //Orders
  getOrders(page: number): Observable<{ data: Order[], maxPages: number }> {
    return this.http.get<any>("http://localhost:3000/admin/orders/allOrders?page=" + page).pipe(catchError(this.httpErrorHandler))
  }

  getOrdersByDate(date: string, page: number): Observable<{ data: Order[], maxPages: number }> {
    return this.http.get<any>("http://localhost:3000/admin/orders/allOrders?page=" + page + "&date=" + date).pipe(catchError(this.httpErrorHandler))
  }

  getTodayOrdersDetails(): Observable<{ data: DayDashboard }> {
    return this.http.get<any>("http://localhost:3000/admin/orders/todayOrdersInfo").pipe(catchError(this.httpErrorHandler))
  }

  getTodayProductsDetails(): Observable<{ data: ProductDashboard[] }> {
    return this.http.get<any>("http://localhost:3000/admin/orders/todayProducts").pipe(catchError(this.httpErrorHandler))
  }

  updateOrderStatus(status: string, id: string): Observable<{ message: string }> {
    return this.http.put<any>("http://localhost:3000/admin/orders/updateStatus/" + id, { status }).pipe(catchError(this.httpErrorHandler))
  }

  compareTwoProductsData(p1: string, p2: string): Observable<{ data: any[] }> {
    return this.http.get<any>("http://localhost:3000/admin/orders/weeklyCompare/" + p1 + "/" + p2).pipe(catchError(this.httpErrorHandler))
  }

  //dashboard
  getDashboardDetails(): Observable<{ data: TotalDashboard }> {
    return this.http.get<any>("http://localhost:3000/admin/adminDashboard").pipe(catchError(this.httpErrorHandler))
  }

  getDashboardDetailsOfMonth(month: number): Observable<{ data: MonthDashboard[] }> {
    return this.http.get<any>("http://localhost:3000/admin/adminDashboard/month/" + month).pipe(catchError(this.httpErrorHandler))
  }

  getCategoryDashboardDetails(category: string): Observable<{ data: CategoryDashboard[] }> {
    return this.http.get<any>("http://localhost:3000/admin/adminDashboard/category/" + category).pipe(catchError(this.httpErrorHandler))
  }

  getSingleProductDetails(product: string): Observable<{data : SingleProduct, wasted : number}> {
    return this.http.get<any>("http://localhost:3000/admin/adminDashboard/singleProductDetails/" + product).pipe(catchError(this.httpErrorHandler))
  }

  getSingleProductDashboardOfMonth(product: string, month: number): Observable<{data : ProductDashboard[]}> {
    return this.http.get<any>("http://localhost:3000/admin/adminDashboard/singleProduct/" + product + "/" + month).pipe(catchError(this.httpErrorHandler))
  }
}
