import { LikeParams } from './../_models/likeParams';
import { AccountService } from './account.service';
import { UserParams } from './../_models/userParams';
import { PaginatedResult } from '../_models/pagination';
import { Injectable } from '@angular/core';
import { environment } from './../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Member } from 'src/app/_models/member';
import { of } from 'rxjs';
import { map, finalize, take, retry } from 'rxjs/operators';
import { User } from '../_models/user';
import { getPaginatedResult, getPaginationHeaders } from './paginationHelper';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';

@Injectable({
  providedIn: 'root'
})

export class MembersService {

  baseUrl = environment.apiUrl;
  members: Member[];
  user: User;
  userParams: UserParams;

  //here map is the type of dictionary which stores <key, value> pair
  memeberCache = new Map();


  constructor(private http: HttpClient, private accountService: AccountService) {
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => {
      this.user = user;
      this.userParams = new UserParams(user);
    })
  }

  getUserParams() {
    return this.userParams;
  }

  resetUserParams() {
    this.userParams = new UserParams(this.user);
    return this.userParams;
  }

  setUserParams(userParams: UserParams) {
    this.userParams = userParams;
  }

  getMembers(userParams: UserParams) {
    let key = Object.values(userParams).join('-')
    var response = this.memeberCache.get(key);
    if (response) {
      return of(response);
    }


    let params = getPaginationHeaders(userParams.pageNumber, userParams.pageSize)

    params = params.append('minAge', userParams.minAge.toString());
    params = params.append('maxAge', userParams.maxAge.toString());
    params = params.append('gender', userParams.gender);
    params = params.append('orderBy', userParams.orderBy);

    return getPaginatedResult<Member[]>(this.baseUrl + 'users', params,this.http)
      .pipe(map(response => {
        this.memeberCache.set(key, response);
        return response;
      }))
  }

  //...   => sperad operator here used to covert dictionary to array
  //reduce => used to accumulate all the number array result into one result
  getMember(username: string) {
    const member = [...this.memeberCache.values()]
      .reduce((arr, elem) => arr.concat(elem.result), [])
      .find((user: Member) => user.username == username);
    if (member) {
      return of(member);
    }
    return this.http.get<Member>(this.baseUrl + 'users/' + username);
  }

  updateMember(member: Member) {
    return this.http.put(this.baseUrl + 'users', member).pipe(
      map(() => {
        const index = this.members.indexOf(member);
        this.members[index] = member;
      })
    )
  }

  setMainPhoto(photoId: number) {
    return this.http.put(this.baseUrl + 'users/set-main-photo/' + photoId, {});
  }

  deletePhoto(photoId: number) {
    return this.http.delete(this.baseUrl + 'users/delete-photo/' + photoId);
  }

  addLike(username: string) {
    return this.http.post(this.baseUrl + 'likes/' + username, {});
  }

  getLikes(likeParams:LikeParams) {
    let params = getPaginationHeaders(likeParams.pageNumber, likeParams.pageSize);
    params = params.append('predicate', likeParams.predicate);
    return getPaginatedResult<Partial<Member[]>>(this.baseUrl + 'likes',params,this.http);
  }
  
}
