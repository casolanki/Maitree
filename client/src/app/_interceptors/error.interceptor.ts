import { ToastrService } from 'ngx-toastr';
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { NavigationExtras, Router } from '@angular/router';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private router: Router, private toastr: ToastrService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError(error => {
        if (error) {
          switch (error.status) {
            case 400:
              if (error.error.errors) {//bad request validation error
                const modelStateErrors = [];
                for (const key in error.error.errors) {
                  if (error.error.errors[key]) {
                    modelStateErrors.push(error.error.errors[key])
                  }
                }
                throw modelStateErrors.flat();                
              } else if(typeof(error.error) === 'object') { //bad request error as object(no msg pass)
                this.toastr.error(error.error.title,error.error.status)
              } else{
                this.toastr.error(error.error, error.status); // bad request error string(pass msg)
              }
              break;
            case 401: this.toastr.error(error.error,error.status);
              break;
            case 404: this.router.navigateByUrl('/not-found')
              break;
            case 500:
              const navigationExras: NavigationExtras = { state: { error: error.error } }
              this.router.navigateByUrl('/server-error', navigationExras);
              break;
            default: this.toastr.error('Something unexpected went wrong');
              console.log(error);
              break;
          }
        }
        return throwError(error);
      })
    )
  }
}
