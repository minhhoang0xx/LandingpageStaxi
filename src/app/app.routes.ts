import { PreloadAllModules, Routes } from '@angular/router';
import { LandingPageStaxiComponent } from './components/LandingPageStaxi/LandingPageStaxi.component';
import {AppComponent} from './app.component'
import { LayoutComponent } from './shared/layout/layout.component';
import { NgModule } from '@angular/core';
import { HeaderComponent } from './shared/header/header.component';
import { ListShortLinkComponent } from './components/ShortUrl/ListShortUrl/list-short-url.component';

export const routes: Routes = [
    {path:'', component:LandingPageStaxiComponent},
    {path:'booking', component:AppComponent},
    {
        path: 'ShortUrl',
        component: LayoutComponent, 
        children: [
          { path: 'abc', component:LandingPageStaxiComponent } ,
          { path: '', component:ListShortLinkComponent}
        ]
      },
    //   {
    //     path: '',
    //     component: LayoutComponent,
    //     data: {
    //       title: 'Home',
    //     },
    //     // canActivateChild: [AuthenChildGuard],
    //     children: [
    //       {
    //         path: '',
    //         loadChildren: () => import('./main/dashboard/dashboard.module').then((m) => m.DashboardModule),
    //       },
    // ]
    // }
      
];
