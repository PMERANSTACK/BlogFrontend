import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UsersListComponent } from './component/users-list/users-list.component';
import { CreateBlogComponent } from './components/create-blog/create-blog.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';
import { RegisterComponent } from './components/register/register.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { ViewBlogPostComponent } from './components/view-blog-post/view-blog-post.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(
      m => m.AdminModule
    )
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'users',
    children: [{
      path: '',
      component: UsersListComponent
    },
    {
      path: ':id',
      component: UserProfileComponent
    }
  ]
  },
   {
     path: 'profile',
     component: ProfileComponent,
     canActivate: [AuthGuard]
   },
   {
     path: 'home',
     component: HomeComponent,
   },
   {
     path: '',
     redirectTo: '/home',
     pathMatch: 'full'
   },{
     path: 'create',
     component: CreateBlogComponent,
     canActivate: [AuthGuard]
   },
   {
     path: 'blog-post/:id',
     component: ViewBlogPostComponent
   }
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
