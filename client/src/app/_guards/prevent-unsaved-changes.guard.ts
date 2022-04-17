import { MemberEditComponent } from './../members/member-edit/member-edit.component';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { ConfirmService } from '../_services/confirm.service';

@Injectable({
  providedIn: 'root'
})

//CanDeactivate helps to promt confirmation message, when you try to exit
//perticular component without any save changes
export class PreventUnsavedChangesGuard implements CanDeactivate<unknown> {

  constructor(private confirmService: ConfirmService){

  }
  canDeactivate(
    component: MemberEditComponent): Observable<boolean> | boolean {
      if(component?.editForm?.dirty){
        return this.confirmService.confirm();
      }
    return true;
  }
  
}
