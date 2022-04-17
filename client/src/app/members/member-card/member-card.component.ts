import { PresenceService } from './../../_services/presence.service';
import { ToastrService } from 'ngx-toastr';
import { MembersService } from 'src/app/_services/members.service';
import { Component, OnInit, Input } from '@angular/core';
import { Member } from 'src/app/_models/member';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.css']
})
export class MemberCardComponent implements OnInit {
@Input() member: Member
  constructor(private membersService: MembersService,
               private toastr: ToastrService,
               public presence: PresenceService) { }

  ngOnInit() {
  }

  addLike(member: Member){
    this.membersService.addLike(member.username).subscribe(()=>{
       this.toastr.success('You have liked '+ member.knownAs);
    })
  }

}
