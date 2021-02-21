import { Component, Input, OnInit, Output , EventEmitter} from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';
import { BlogEntriesPageable, BlogEntry } from 'src/app/model/blog-entry.interface';
import { BlogService } from 'src/app/services/blog.service';

@Component({
  selector: 'app-blog-list',
  templateUrl: './blog-list.component.html',
  styleUrls: ['./blog-list.component.scss']
})
export class BlogListComponent implements OnInit {

  @Input() blogEntries: BlogEntriesPageable = null as any;
  @Output() paginate: EventEmitter<PageEvent> = new EventEmitter<PageEvent>();
  
  // dataSource: Observable<BlogEntriesPageable> = this.blogService.indexAll(1,10);
  pageEvent: PageEvent = null as any;
  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  onPaginateChange(event: PageEvent){
    //let page = event.pageIndex;
    //let size = event.pageSize;
    event.pageIndex = event.pageIndex+1;
    this.paginate.emit(event);
    // this.dataSource = this.blogService.indexAll(page, size)
  }

  navigate(id: number){
    this.router.navigateByUrl('blog-post/' +id)
  }

}
