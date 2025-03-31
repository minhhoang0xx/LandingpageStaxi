import { Routes } from '@angular/router';
import { LandingPageStaxiComponent } from './modules/LandingPageStaxi/LandingPageStaxi.component';
import {AppComponent} from './app.component'
import { LayoutComponent } from './shared/layout/layout.component';

export const routes: Routes = [
    {path:'', component:LandingPageStaxiComponent},
    {path:'booking', component:AppComponent},
    {
        path: 'ShortUrl',
        component: LayoutComponent, 
        children: [
          { path: '', component:LandingPageStaxiComponent } 
        ]
      },
];
