import { Component } from '@angular/core';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'footer',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent { }