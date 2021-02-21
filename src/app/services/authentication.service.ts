import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, switchMap, tap } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable, of } from 'rxjs';
import { User } from '../model/user.interface';

export interface LoginForm {
    email: string;
    password: string;
}



export const JWT_NAME = 'blog-token';


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor( private http: HttpClient, private jwtHelper: JwtHelperService) { }

   login(loginForm: LoginForm) {
    return this.http.post<any>('/api/user/login', {email: loginForm.email, password: loginForm.password}).pipe(
      map((token) => {
        console.log(token)
        localStorage.setItem('blog-token', token.access_token);
        return token
      })
    )
  }

  register(user: User){
    return this.http.post<any>('/api/user', user).pipe(
      map(user => user)
    )
  }

  isAuthenticated(): boolean{
     const token = localStorage.getItem(JWT_NAME) as any;
     console.log(token);
      return !this.jwtHelper.isTokenExpired(token);
     // return true;
  }

  getUserId(): Observable<number>{
   return of(localStorage.getItem(JWT_NAME)).pipe(
   switchMap((jwt: any) => of(this.jwtHelper.decodeToken(jwt)).pipe(
    tap((jwt) => console.log(jwt)),
    map((jwt: any) => jwt.user.id)
                        )
   ))
    

  }

  logout(){
    localStorage.removeItem(JWT_NAME);
  }
}
