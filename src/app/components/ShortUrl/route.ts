import { Routes } from '@angular/router';
import { ListShortLinkComponent } from './ListShortUrl/list-short-url.component';

export const shortUrlRoutes: Routes = [
  {
    path: '',
    component: ListShortLinkComponent,
  },
];