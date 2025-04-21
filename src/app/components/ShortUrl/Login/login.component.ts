import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RecaptchaComponent, RecaptchaModule } from 'ng-recaptcha';
import { Router } from '@angular/router';
import { Authentication } from '../../../services/Authentication';
import { environment } from '../../../../environments/environment';
import { firstValueFrom } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    RecaptchaModule
  ]
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  attempts = 0;
  showCaptcha = false;
  captchaToken: string | null = null;
  siteKey = environment.CAPTCHA_KEY;
  @ViewChild('captchaRef') captchaRef?: RecaptchaComponent;
  constructor(
    private fb: FormBuilder,
    private authService: Authentication,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.loginForm = this.fb.group({
      UserName: ['', [Validators.required, Validators.minLength(6)]],
      Password: ['', [Validators.required, Validators.minLength(6)]],
      remember: [false]
    });
  }
  ngOnInit(): void {
    const storedAttempts = localStorage.getItem("attempts");
        const current = storedAttempts ? parseInt(storedAttempts, 10) : 0;
        this.attempts=current;
        console.log('submit times', current);
        localStorage.setItem("attempts", current.toString());
        if (current >= 3) {
      this.showCaptcha = true
        }
  }

  get f() {
    return this.loginForm.controls;
  }

  onCaptchaResolved(token: string | null) {
    this.captchaToken = token;
  }

  async onSubmit() {
    this.submitted = true;
    this.loading = true;
    const loginData = {
      ...this.loginForm.value,
      RecaptchaToken: this.captchaToken,
    };

    try {
      const response = await firstValueFrom(this.authService.login(loginData));
      this.attempts = response.attempts;
      console.log('API Response:', response);
      if (response.message === 'Login successfully!') {
        localStorage.setItem('token', response.token)
        this.router.navigate(['ShortUrl']);
        this.showCaptcha = false;
        this.captchaToken = null;
        this.toastr.success(response.message);
        if (this.captchaRef) {
          this.captchaRef.reset();
        }
      }
    } catch (error: any) {
      let err = "Đăng nhập thất bại!";
      this.attempts = error.error.attempts;
      localStorage.setItem('attempts', this.attempts.toString());
      if (error.error.errorMessage) {
        err = error.error.errorMessage;
        if (error.error.requiresCaptcha) {
          this.showCaptcha = true;
          this.captchaToken = null;
          if (this.captchaRef) {
            this.captchaRef.reset();
          }
        }
      }

      this.toastr.error(err);
      console.error(error);
    }

    this.loading = false;
  }

  goHome() {
    this.router.navigate(['/']);
  }
}