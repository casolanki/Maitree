import { MembersService } from 'src/app/_services/members.service';
import { Inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Member } from 'src/app/_models/member';

@Injectable({
    providedIn: 'root'
})
export class MemberDetailedResolver implements Resolve<Member>{
    constructor(private membersService: MembersService) {}

    resolve(route: ActivatedRouteSnapshot): Observable<Member>  {
       return this.membersService.getMember(route.paramMap.get('username'));
    }

}