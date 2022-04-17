import { AccountService } from './../_services/account.service';
import { Directive, Input, TemplateRef, ViewContainerRef, OnInit } from '@angular/core';
import { User } from '../_models/user';
import { take } from 'rxjs/operators';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Directive({
  selector: '[HasRole]' // *HasReole='Admin'
})
export class HasRoleDirective implements OnInit {
  @Input() HasRole: String[];

  user: User;

  constructor(private viewContainerRef: ViewContainerRef,
    private templateRef: TemplateRef<any>,
    private accountService: AccountService) {

    this.accountService.currentUser$.pipe(take(1)).subscribe(user => {
      this.user = user;
    })
  }
  ngOnInit() {
    if (!this.user?.roles || this.user == null) {
      this.viewContainerRef.clear();
      return;
    }
     if(this.user?.roles.some(r => this.HasRole.includes(r))){
       this.viewContainerRef.createEmbeddedView(this.templateRef);
     }else{this.viewContainerRef.clear();}
  }

}
