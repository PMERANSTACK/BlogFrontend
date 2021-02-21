import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { BlogEntry } from 'src/app/model/blog-entry.interface';
import { BlogService } from 'src/app/services/blog.service';

@Component({
  selector: 'app-view-blog-post',
  templateUrl: './view-blog-post.component.html',
  styleUrls: ['./view-blog-post.component.scss']
})
export class ViewBlogPostComponent implements OnInit {

  blogEntry$: Observable<BlogEntry> = this.activatedRoute.params.pipe(
    switchMap((params: Params) => {
      const blogEntryId = parseInt(params['id']);
      return this.blogservice.findOne(blogEntryId).pipe(
        map((blogEntry: BlogEntry) => blogEntry)
      )
    })
  )
  constructor(private activatedRoute: ActivatedRoute, private blogservice: BlogService) { }

  ngOnInit(): void {
  }

}
