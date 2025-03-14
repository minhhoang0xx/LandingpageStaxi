import { Routes } from '@angular/router';
import { LandingPageStaxiComponent } from './modules/LandingPageStaxi/LandingPageStaxi.component';
import {AppComponent} from './app.component'
export const routes: Routes = [
    {path:'', component:LandingPageStaxiComponent},
    {path:'booking', component:AppComponent}
];
