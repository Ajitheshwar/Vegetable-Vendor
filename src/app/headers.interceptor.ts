import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class HeadersInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let token = sessionStorage.getItem("token")
    let role = sessionStorage.getItem("role")
    let id = sessionStorage.getItem("id")

    let keys = request.headers.keys()
    let obj : any = {}
    for(let key of keys){
      obj[key] = request.headers.get(key)
    }
    
    if(token &&  role && id){
      let headers = new HttpHeaders({
        'authorization' : 'Bearer '+token,
        'role' : role,
        'id' : id,
        
        ...obj
      })
      // console.log(headers) 
      let copyRequest = request.clone({
        headers : headers,
      })
      return next.handle(copyRequest)
    }
    return next.handle(request);
  }
}
