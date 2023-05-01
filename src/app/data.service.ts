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
import { userURLs } from 'src/config';
import { Cart, CatandSubCat, Order, Product } from 'src/models/product';
import { UserDetails, Address, Message } from 'src/models/user';
import { LoginDetails, SignUpDetails } from '../models/login';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(private http: HttpClient) { }

  httpErrorHandler(error: HttpErrorResponse) {
    console.log(error);
    return throwError(() => {
      return error.error.message;
    });
  }

  //Login Page-----------------------------------------------------------------------------------------------------------------
  login(obj: LoginDetails): Observable<any> {
    return this.http
      .post<LoginDetails>(userURLs.Login, obj)
      .pipe(catchError(this.httpErrorHandler));
  }

  signup(obj: SignUpDetails): Observable<any> {
    return this.http
      .post<SignUpDetails>(userURLs.SignUp, obj)
      .pipe(catchError(this.httpErrorHandler));
  }

  resetPassword(obj: any): Observable<any> {
    return this.http
      .post<any>(userURLs.ResetPassword, obj)
      .pipe(catchError(this.httpErrorHandler));
  }

  verifyUser(url: string): Observable<{ message: string }> {
    return this.http.get<any>( '/' + url);
  }

  //Products Page--------------------------------------------------------------------------------------------------------------
  getCategoriesAndSubCategories(): Observable<{ data: CatandSubCat[] }> {
    return this.http
      .get<any>(
        userURLs.CategoriesAndSubCategories
      )
      .pipe(catchError(this.httpErrorHandler));
  }

  getCategoryProducts(category: string, page: number): Observable<{ data: Product[], total_pages: number }> {
    return this.http
      .get<any>(
        userURLs.CategoryProducts +
        category +
        '/' +
        page
      )
      .pipe(catchError(this.httpErrorHandler));
  }

  getFilteredProducts(filteredProducts: string, page: number): Observable<{ data: Product[], total_pages: number }> {
    return this.http
      .get<any>(
        userURLs.SubCategoryProducts +
        filteredProducts +
        '/' +
        page
      )
      .pipe(catchError(this.httpErrorHandler));
  }

  getSearchedProducts(search: string, page: number): Observable<{ data: Product[], total_pages: number }> {
    return this.http
      .get<any>(
        userURLs.SearchProducts +
        search +
        '/' +
        page
      )
      .pipe(catchError(this.httpErrorHandler));
  }

  getCartDetails(): Observable<Cart[]> {
    return this.http.get<any>(userURLs.Cart).pipe(
      catchError(this.httpErrorHandler),
      map((result) => result.data.cart)
    );
  }

  updateCartDetails(cart: Array<any>): Observable<any> {
    return this.http.post(userURLs.UpdateCart, {
      cart,
    });
  }

  //account---------------------------------------------------------------------------------------------------------------
  userObj = { last_name: 'a', first_name: 'a', image: '', contact_number: '', _id: '', email_address: '' }
  userDetails = new BehaviorSubject<UserDetails>(this.userObj);
  userDetailsObservable = this.userDetails.asObservable();
  updateUserDetails(userObj: UserDetails) {
    this.userDetails.next(userObj);
  }

  getUserDetails() {
    this.http
      .get(userURLs.UserDetails)
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
      .post(userURLs.UpdateUserDetails, obj)
      .subscribe({
        next: (result) => {
          // console.log(result)
        },
      });
  }

  uploadProfileImage(obj: FormData) {
    return this.http
      .post(userURLs.UploadProfileImage, obj)
      .pipe(catchError(this.httpErrorHandler));
  }

  getOrderDetails(): Observable<{ message: Order[] }> {
    return this.http.get<any>(userURLs.Orders)
      .pipe(catchError(this.httpErrorHandler));
  }

  getAddresses(): Observable<{ message: Address[] }> {
    return this.http.get<any>(userURLs.Addresses)
      .pipe(catchError(this.httpErrorHandler));
  }

  deleteAddress(id: string): Observable<any> {
    return this.http.put<any>(userURLs.DeleteAddress, { id }).pipe(catchError(this.httpErrorHandler))
  }

  addAddress(obj: any): Observable<any> {
    return this.http.post<any>(userURLs.UpdateAddress, { address: obj }).pipe(catchError(this.httpErrorHandler))
  }

  getChatMessages(email: string): Observable<{ messages: Message[] }> {
    return this.http.get<any>(userURLs.Messages + email).pipe(catchError(this.httpErrorHandler))
  }

  sendChatMessage(data: any): Observable<any> {
    return this.http.post<any>(userURLs.SendMessage, data).pipe(catchError(this.httpErrorHandler))
  }

  placeOrder(data: any): Observable<any> {
    return this.http.post<any>(userURLs.PlaceOrder, data).pipe(catchError(this.httpErrorHandler))
  }
}
