import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './theme/layout/admin/admin.component';
import { GuestComponent } from './theme/layout/guest/guest.component';
import { ForgetPasswordComponent } from './theme/layout/forget-password/forget-password.component';
import { RegisterComponet } from './theme/layout/register/register.component';

const routes: Routes = [
 
  
  {
    path: '',
    component: GuestComponent,
    children: [
      {
        path: '',
        redirectTo: '/login',
        pathMatch: 'full'
      },
      {
        path: 'login',
        loadComponent: () => import('./demo/pages/authentication/login/login.component')
      },]
  }
 ,

 {
  path: '',
  component: RegisterComponet,
  children: [
    {
      path: '',
      redirectTo: '/register',
      pathMatch: 'full'
    },
    {
      path: 'register',
      loadComponent: () => import('./demo/pages/authentication/register/register.component')
    },]
}

,
{
  path: '',
  component: ForgetPasswordComponent,
  children: [
    {
      path: '',
      redirectTo: '/forget',
      pathMatch: 'full'
    },
    {
      path: 'forget',
      loadComponent: () => import('./demo/pages/authentication//forget-password/forget-password.component')
    },
    
      {
        path: 'enter-code',
        loadComponent: () => import('./demo/pages/authentication//enter-code/enter-codecomponent')
      },
  
  
      {
        path: 'change-password',
        loadComponent: () => import('./demo/pages/authentication/change-password/change-password.component')
      },
  
  
  
  
  
  ]
}
,
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: 'default',
        redirectTo: '/dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./demo/default/default.component')
      },
      {
        path: 'typography',
        loadComponent: () => import('./demo/elements/typography/typography.component')
      },
      {
        path: 'color',
        loadComponent: () => import('./demo/elements/element-color/element-color.component')
      },
      {
        path: 'sample-page',
        loadComponent: () => import('./demo/sample-page/sample-page.component')
      }
     
    ]
  },
  {
    path: '',
    component: GuestComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./demo/pages/authentication/login/login.component'),
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {



  
}
