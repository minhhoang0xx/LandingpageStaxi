import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ShortURLService } from '../../services/ShortURLService';
import { firstValueFrom } from 'rxjs';

@Component({
    selector: 'app-redirect',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './redirect.component.html',
    styleUrls: ['./redirect.component.css']
})
export class RedirectComponent implements OnInit { 
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private shortUrlService: ShortURLService
    ) {}

    ngOnInit() {
        const alias = this.route.snapshot.paramMap.get('alias');
        if (alias) {
            this.redirectToOriginalUrl(alias);
        } else {
            this.router.navigate(['**']); 
        }
    }

    async redirectToOriginalUrl(alias: string) {
        try {
            const response = await firstValueFrom(this.shortUrlService.getLinkByAlias(alias));
            console.log("response", response);
            if (response) {
                window.location.href = response;
            } else {
                this.router.navigate(['**']); 
            }
        } catch (error) { 
            console.error('Error redirecting:', error);
            this.router.navigate(['**']); 
        }
    }
}
