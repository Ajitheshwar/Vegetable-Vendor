import {
  HttpClient,
  HttpErrorResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  map,
  Observable,
  throwError,
} from 'rxjs';
import { Cart, CatandSubCat, Order, Product } from 'src/models/product';
import { UserDetails, Address, Message } from 'src/models/user';
import { LoginDetails, SignUpDetails } from '../models/login';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(private http: HttpClient) {}

  httpErrorHandler(error: HttpErrorResponse) {
    console.log(error);
    return throwError(() => {
      return error.error.message;
    });
  }

  //Login Page-----------------------------------------------------------------------------------------------------------------
  login(obj: LoginDetails): Observable<any> {
    return this.http
      .post<LoginDetails>('http://localhost:3000/login', obj)
      .pipe(catchError(this.httpErrorHandler));
  }

  signup(obj: SignUpDetails): Observable<any> {
    return this.http
      .post<SignUpDetails>('http://localhost:3000/signup', obj)
      .pipe(catchError(this.httpErrorHandler));
  }

  resetPassword(obj: any): Observable<any> {
    return this.http
      .post<any>('http://localhost:3000/resetPassword', obj)
      .pipe(catchError(this.httpErrorHandler));
  }

  verifyUser(url: string): Observable<{ message: string }> {
    return this.http.get<any>('http://localhost:3000/' + url);
  }

  //Products Page--------------------------------------------------------------------------------------------------------------
  getCategoriesAndSubCategories(): Observable<CatandSubCat[]> {
    return this.http
      .get<any>(
        'http://localhost:3000/user/products/getCategoriesAndSubCategories'
      )
      .pipe(catchError(this.httpErrorHandler));
  }

  getCategoryProducts(category: string, page: number): Observable<{data : Product[], total_pages : number}> {
    return this.http
      .get<any>(
        'http://localhost:3000/user/products/getProducts/category/' +
          category +
          '/' +
          page
      )
      .pipe(catchError(this.httpErrorHandler));
  }

  getFilteredProducts(filteredProducts: string, page: number): Observable<{data : Product[], total_pages : number}> {
    return this.http
      .get<any>(
        'http://localhost:3000/user/products/getProducts/subCategories/' +
          filteredProducts +
          '/' +
          page
      )
      .pipe(catchError(this.httpErrorHandler));
  }

  getSearchedProducts(search: string, page: number): Observable<{data : Product[], total_pages : number}> {
    return this.http
      .get<any>(
        'http://localhost:3000/user/products/getProducts/search/' +
          search +
          '/' +
          page
      )
      .pipe(catchError(this.httpErrorHandler));
  }

  getCartDetails(): Observable<Cart[]> {
    return this.http.get<any>('http://localhost:3000/user/details/cart').pipe(
      catchError(this.httpErrorHandler),
      map((result) => result.data.cart)
    );
  }

  updateCartDetails(cart: Array<any>): Observable<any> {
    return this.http.post('http://localhost:3000/user/details/updateCart', {
      cart,
    });
  }

  //account---------------------------------------------------------------------------------------------------------------
  userObj = {last_name : '', first_name: '',image : '', contact_number : '',_id : '',email_address : ''}
  userDetails = new BehaviorSubject<UserDetails>(this.userObj);
  userDetailsObservable = this.userDetails.asObservable();
  updateUserDetails(userObj: UserDetails) {
    this.userDetails.next(userObj);
  }

  getUserDetails() {
    this.http
      .get('http://localhost:3000/user/details/profileDetails')
      .subscribe({
        next: (result) => {
          this.updateUserDetails(result as UserDetails);
        },
      });
  }

  updateUserDetailsInDB(obj: UserDetails) {
    // console.log(obj)
    this.updateUserDetails(obj);
    return this.http
      .post('http://localhost:3000/user/details/updateProfile', obj)
      .subscribe({
        next: (result) => {
          // console.log(result)
        },
      });
  }

  uploadProfileImage(obj: FormData) {
    return this.http
      .post('http://localhost:3000/user/details/profileUpload', obj)
      .pipe(catchError(this.httpErrorHandler));
  }

  getOrderDetails() : Observable<{message : Order[]}>{
    return this.http.get<any>("http://localhost:3000/user/orders/getOrders")
    .pipe(catchError(this.httpErrorHandler));
  }

  getAddresses() : Observable<{message :Address[]}>{
    return this.http.get<any>("http://localhost:3000/user/details/getAddresses")
    .pipe(catchError(this.httpErrorHandler));
  }

  deleteAddress(id : string) : Observable<any>{
    return this.http.put<any>("http://localhost:3000/user/details/deleteAddress",{id}).pipe(catchError(this.httpErrorHandler))
  }

  addAddress(obj : any) : Observable<any>{
    return this.http.post<any>("http://localhost:3000/user/details/updateAddress",{address : obj}).pipe(catchError(this.httpErrorHandler))
  }

  getChatMessages(email : string) : Observable<{messages : Message[]}>{
    return this.http.get<any>("http://localhost:3000/user/details/getMessages/"+email).pipe(catchError(this.httpErrorHandler))
  }

  sendChatMessage(data : any) : Observable<any>{
    return this.http.post<any>("http://localhost:3000/user/details/sendMessage",data).pipe(catchError(this.httpErrorHandler))
  }

  placeOrder(data : any) : Observable<any>{
    return this.http.post<any>("http://localhost:3000/user/orders/addOrders",data).pipe(catchError(this.httpErrorHandler))
  }
}
