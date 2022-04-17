import { LikeParams } from './../_models/likeParams';
import { Pagination, PaginatedResult } from './../_models/pagination';
import { MembersService } from 'src/app/_services/members.service';
import { Component, OnInit } from '@angular/core';
import { Member } from '../_models/member';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.css']
})
export class ListsComponent implements OnInit {
  //Here partial means no need to set all properties of Member, used it partially
  members: Partial<Member[]>;
  pagination: Pagination;
  likeParams: LikeParams;

  constructor(private membersService: MembersService) {
    this.likeParams = new LikeParams();
   }

  ngOnInit(){
    this.loadLikes();

  }

  loadLikes()
  {
    this.membersService.getLikes(this.likeParams).subscribe(response=>{
      this.members = response.result;
      this.pagination = response.pagination;
    })
  }

  pageChanged(event:any){
    this.likeParams.pageNumber = event.page;
    this.loadLikes();
  }
}
