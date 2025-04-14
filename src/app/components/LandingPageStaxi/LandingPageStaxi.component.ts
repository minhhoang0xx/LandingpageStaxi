import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormRequestService } from '../../services/FormRequestService';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {  RecaptchaModule } from 'ng-recaptcha';
import { ToastrService } from 'ngx-toastr';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  templateUrl: './LandingPageStaxi.component.html',
  styleUrls: ['./LandingPageStaxi.component.css'],
  imports: [CommonModule, ReactiveFormsModule, RecaptchaModule],
})
export class LandingPageStaxiComponent implements OnInit {
  StaxiForm: FormGroup;
  loading = false;
  captchaToken: string | null = null;
  attempts = parseInt(localStorage.getItem('attempts') || '0', 10);
  showCaptcha = this.attempts >=3;
  captchaSiteKey = environment.CAPTCHA_KEY

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private formRequestService: FormRequestService,
    private toastr: ToastrService
  ) {
    this.StaxiForm = this.fb.group({
      fullName: ['', [Validators.required]],
      phoneNumber: ['', Validators.required,Validators.pattern(/^\S+$/)],
      company: ['', Validators.required],
      email: [''],
      address: [''],
    });
  }

  // bookNow() {
  //   this.router.navigate(['/booking']);
  // }

  ngOnInit(): void {
    localStorage.setItem('attempts', this.attempts.toString());
    if (this.attempts >= 3) {
      this.showCaptcha = true;
    }
    
  }
  handleCaptchaChange(token:string | null) {
    this.captchaToken = token;
  };
  async onSubmit(): Promise<void> {
    if (this.StaxiForm.invalid) {
      this.toastr.error('Vui lòng điền đầy đủ các trường bắt buộc!');
      return;
    }
    if (this.showCaptcha && !this.captchaToken) {
      this.toastr.error("Vui lòng hoàn thành CAPTCHA!");
      return;
    }
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
        localStorage.setItem('attempts', this.attempts.toString());
        this.captchaToken = null;
        console.log("captcha",this.captchaToken)
        this.showCaptcha = this.attempts >= 3;
      } else {
        throw new Error('Tạo thất bại!');
      }
    } catch (error: any) {
      console.error("API Error:", error);
      let errorMessage = "Failed to submit form.";
      if (error.res?.message) {
        errorMessage = error.res.message;
        if (error.res.requiresCaptcha) {
          this.showCaptcha = true;
          this.captchaToken = null;
        }
      } else if (error.message) {
        errorMessage = error.res.message;
      }
      this.toastr.error(errorMessage);
    } finally {
      this.loading = false;
    }
  }
}
