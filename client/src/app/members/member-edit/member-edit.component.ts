import { ToastrService, ToastrModule } from 'ngx-toastr';
import { MembersService } from 'src/app/_services/members.service';
import { AccountService } from './../../_services/account.service';
import { User } from './../../_models/user';
import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { Member } from 'src/app/_models/member';
import { take } from 'rxjs/operators';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.css']
})
export class MemberEditComponent implements OnInit {
  @ViewChild('editForm') editForm : NgForm
  member: Member;
  user: User;

  //HostListener helps to promt confirmation message, when you try to exit by close browser or tab
  @HostListener('window:beforeunload',['$event']) unloadNotification($event:any){
    if(this.editForm.dirty){
      $event.returnValue = true;
    }
  }

  constructor(private accountService: AccountService, private membersService: MembersService,
    private toastr: ToastrService) {

    this.accountService.currentUser$.pipe(take(1)).subscribe(user => { this.user = user });
  }

  ngOnInit() {
    this.loadMember()
  }

  loadMember() {
    this.membersService.getMember(this.user.username).subscribe(member => {
      this.member = member;
    })
  }

  updateMember() {
    this.membersService.updateMember(this.member).subscribe(()=>{
    this.toastr.success('Profile updated successfully');
    this.editForm.reset(this.member);
  })
  }

}
