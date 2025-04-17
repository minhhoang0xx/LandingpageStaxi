import { PreloadAllModules, Routes } from '@angular/router';
import { AppComponent } from './app.component'
import { LayoutComponent } from './shared/layout/layout.component';
import { NgModule } from '@angular/core';
import { HeaderComponent } from './shared/header/header.component';
import { ListShortLinkComponent } from './components/ShortUrl/ListShortUrl/list-short-url.component';
import { LoginComponent } from './components/ShortUrl/Login/login.component';
import { authGuard } from './guards/auth.guard';
import { NotFoundComponent } from './shared/notFound/notFound.component';
import { RedirectComponent } from './shared/redirect/redirect.component';


export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/LandingPageStaxi/LandingPageStaxi.component').then(m => m.LandingPageStaxiComponent),
  },
  { path: 'login', component: LoginComponent },
  {
    path: 'ShortUrl',
    component: LayoutComponent,
    canActivate: [authGuard],   
    loadChildren: () =>import('./components/ShortUrl/route').then(m=>m.shortUrlRoutes)
  },
  {
    path: '**',
    component: LayoutComponent,
    children: [
      { path: '', component: NotFoundComponent },
    ]
  },
  { path: 'link/:alias', component: RedirectComponent }



];




