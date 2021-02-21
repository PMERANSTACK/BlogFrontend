import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import { User } from 'src/app/model/user.interface';



export interface UserData {
  items: User[],
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  },
  links: {
    first: string;
    previous: string;
    next: string;
    last: string;
  }

}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }
  
  findOne(id: number): Observable<User> {
    return this.http.get('/api/user/' + id).pipe(
      map((user: User) => user)
    )
  }

  updateOne(user: User): Observable<User>{
    return this.http.put('api/users/' + user.id, user).pipe(
      map((user: User) => user)
    )
  }


  findAll(page: number, limit: number): Observable<UserData>{
    let params = new HttpParams();
    params = params.append('page', String(page));
    params = params.append('limit', String(limit));
    return this.http.get<UserData>('/api/user', {params}).pipe(
       map((userData :UserData) => userData),
       catchError(err => throwError(err))
    )
  };

  paginateByName(page: number, limit: number, username: string): Observable<UserData>{
    let params = new HttpParams;
    params = params.append('page', String(page));
    params = params.append('limit', String(limit));
    params = params.append('username', username)

    return this.http.get<UserData>('/api/user', {params}).pipe(
      map((userData: UserData) => userData),
      catchError(err => throwError(err))
    )
  }

  uploadProfileImage(formData: FormData): Observable<any>{
    return this.http.post<FormData>('/api/users/upload', formData, {
      reportProgress : true,
      observe: 'events'
    })
  }
}
