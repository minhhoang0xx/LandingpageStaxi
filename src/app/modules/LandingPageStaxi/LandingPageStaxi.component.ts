import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing-page',
  templateUrl: './LandingPageStaxi.component.html',
  styleUrls: ['./LandingPageStaxi.component.css']
})
export class LandingPageStaxiComponent {
  constructor(private router: Router) {}

  bookNow() {
    this.router.navigate(['/booking']); 
  }
}
