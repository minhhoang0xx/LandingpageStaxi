import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingPageStaxiComponent } from './LandingPageStaxi.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [LandingPageStaxiComponent],
  imports: [CommonModule, RouterModule],
  exports: [LandingPageStaxiComponent]
})
export class LandingPageModule { }
