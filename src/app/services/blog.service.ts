import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { BlogEntriesPageable, BlogEntry } from '../model/blog-entry.interface';

@Injectable({
  providedIn: 'root'
})
export class BlogService {

  constructor(private http: HttpClient) { }

  indexAll(page:number, limit: number): Observable<BlogEntriesPageable>{
    let params = new HttpParams();
    params = params.append('page', String(page));
    params = params.append('limit', String(limit));

    return this.http.get<BlogEntriesPageable>('/api/blog-entries', {params}).pipe(
      tap((a: any) => console.log(a))
    );
  }

  post(blogEntry: BlogEntry) : Observable<BlogEntry>{
     return this.http.post<BlogEntry>('/api/blog-entries', blogEntry);

  }

  uploadHeaderImage(formData: FormData): Observable<any>{
    return this.http.post<FormData>('/api/blog-entries/image/upload', formData, {
      reportProgress: true,
      observe: 'events'
    })
  }

  findOne(id: number): Observable<BlogEntry>{
    return this.http.get<BlogEntry>('/api/blog-entries/'+id);
  }

  indexByUser(userId: number, page: number, limit: number): Observable<BlogEntriesPageable> {
   let params = new HttpParams();

   params = params.append('page', String(page));
   params = params.append('limit', String(limit));

   return this.http.get<BlogEntriesPageable>('/api/blog-entries/'+ String(userId), {params});
  }
}
