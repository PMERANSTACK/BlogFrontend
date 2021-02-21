import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { map, tap } from 'rxjs/operators';
import { UserData, UserService } from 'src/app/services/user-service/user.service';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit {

  public dataSource: UserData = null as any;
  public displayedColumns: string[] = ['id', 'name', 'username', 'email', 'role'];
  public pageEvent: PageEvent = null as any;
  public filterValue: string = null as any;

  constructor(private userService: UserService, private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.initDataSource();
  }

   initDataSource(){
     this.userService.findAll(1,10).pipe(
       map((userData: UserData) => this.dataSource = userData)
     ).subscribe();
   }

   onPaginateChange(event: PageEvent){
     let page = event.pageIndex;
     let limit = event.pageSize;
     
     if(this.filterValue == null){
      page = page +1;
     this.userService.findAll(page, limit).pipe(
       map((userData: UserData) => this.dataSource = userData)
     ).subscribe();
     } else {
       this.userService.paginateByName(page, limit, this.filterValue).pipe(
         map((userData: UserData) => this.dataSource = userData)
       ).subscribe();
     }
     
   }

   findByName(username: string){
     this.userService.paginateByName(0,10, username).pipe(
       map((userData: UserData) => this.dataSource = userData)
     ).subscribe();
   }

   navigateToProfile(id: number){
      this.router.navigate(['./' + id], {relativeTo: this.activatedRoute});
   }

}
