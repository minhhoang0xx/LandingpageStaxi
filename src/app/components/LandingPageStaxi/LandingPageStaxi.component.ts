import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormRequestService } from '../../services/FormRequestService';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ViewChild } from '@angular/core';
import { RecaptchaModule, RecaptchaComponent  } from 'ng-recaptcha';
import { ToastrService } from 'ngx-toastr';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';


@Component({
  selector: 'app-landing-page',
  standalone: true,
  templateUrl: './LandingPageStaxi.component.html',
  styleUrls: ['./LandingPageStaxi.component.css'],
  imports: [CommonModule, ReactiveFormsModule, RecaptchaModule, RouterModule],
})
export class LandingPageStaxiComponent implements OnInit {
  StaxiForm: FormGroup;
  loading = false;
  captchaToken: string | null = null;
  attempts = parseInt(localStorage.getItem('attempts') || '0', 10);
  showCaptcha = this.attempts >= 3;
  captchaSiteKey = environment.CAPTCHA_KEY
  @ViewChild('captchaRef') captchaRef?: RecaptchaComponent;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private formRequestService: FormRequestService,
    private toastr: ToastrService
  ) {
    this.StaxiForm = this.fb.group({
      fullName: ['', [Validators.required]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\S+$/)]],
      company: ['', Validators.required],
      email: [''],
      address: [''],
    });
  }

  // shortLinkPage() {
  //   this.router.navigate(['/ShortUrl']);
  // }

  ngOnInit(): void {
    const attemptsData = localStorage.getItem('attempts');
    if (attemptsData) {
      const parsed = JSON.parse(attemptsData);
      const now = new Date().getTime();
      if (now < parsed.expiry) {
        this.attempts = parsed.value;
      } else {
        this.attempts = 0;
        localStorage.removeItem('attempts');
      }
    }
    this.showCaptcha = this.attempts >= 3;
  }
  handleCaptchaChange(token: string | null) {
    this.captchaToken = token;
  };
  async onSubmit(): Promise<void> {

    this.loading = true
    const data = this.StaxiForm.value
    try {
      data.projectName = "Staxi";
      data.RecaptchaToken = this.captchaToken;
      const res = await firstValueFrom(this.formRequestService.saveRequestStaxi(data))
      if (res && res.message) {
        this.StaxiForm.reset();
        this.toastr.success(res.message);
        this.attempts = res.attempts;
        const expiryTime = new Date().getTime() + 60 * 60 * 1000; 
        localStorage.setItem('attempts', JSON.stringify({ value: this.attempts, expiry: expiryTime }));
        this.captchaToken = null;
        this.captchaRef?.reset();
        this.showCaptcha = this.attempts >= 3;
      } 
    } catch (error: any) {
      console.error("API Error:", error);
      let err = "Failed to submit form.";
      if (error.error.errorMessage) {
        err = error.error.errorMessage;
        console.log("123",err)
        if (error.error.requiresCaptcha) {
          this.showCaptcha = true;
          this.captchaToken = null;
        }
      } 
      this.toastr.error(err);
    } finally {
      this.loading = false;
    }
  }
}
