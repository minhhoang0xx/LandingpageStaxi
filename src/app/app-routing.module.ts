import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPageStaxiComponent } from './modules/LandingPageStaxi/LandingPageStaxi.component';

const routes: Routes = [
  { path: 'landing', component: LandingPageStaxiComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
