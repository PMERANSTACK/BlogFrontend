import { Component, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs';
import { Subscription } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { BlogEntriesPageable } from 'src/app/model/blog-entry.interface';
import { User } from 'src/app/model/user.interface';
import { BlogService } from 'src/app/services/blog.service';

import { UserService } from 'src/app/services/user-service/user.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit , OnDestroy{

  //userId: number = null as any;
  // user: User = null as any;
  //private sub: Subscription = null as any;

  private userId$: Observable<number> = this.activatedRoute.params.pipe(
    map((params: Params) => parseInt(params['id']))
  )

  user$: Observable<User> =  this.userId$.pipe(
    switchMap((userId: number) =>  this.userService.findOne(userId)

    )
  );

  blogEntries$: Observable<BlogEntriesPageable> = this.userId$.pipe(
    switchMap((userId: number) => this.blogservice.indexByUser(userId, 1,10))
  )

  constructor( private activatedRoute: ActivatedRoute, 
               private userService: UserService,
               private blogservice: BlogService) { }

  ngOnInit(): void {
    //  this.sub = this.activatedRoute.params.subscribe(
    //    params => {
    //      this.userId = parseInt(params['id']);
    //      this.userService.findOne(this.userId).pipe(
    //        map((user: User) => this.user = user)
    //      ).subscribe()
    //    }

    //  )
  }

  ngOnDestroy(){
    // this.sub.unsubscribe();
  }

  onPaginateChange(event: PageEvent){
    return this.userId$.pipe(
      tap((userId: number) => this.blogEntries$ = this.blogservice.indexByUser(userId, event.pageIndex, event.pageSize) )
    ).subscribe();

  }

}
