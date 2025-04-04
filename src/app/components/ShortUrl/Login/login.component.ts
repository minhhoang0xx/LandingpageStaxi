import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; 
import { RecaptchaModule } from 'ng-recaptcha'; 
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

  get f() {
    return this.loginForm.controls;
  }

  onCaptchaResolved(token: string | null) {
    this.captchaToken = token;
  }

  async onSubmit() {
    this.submitted = true;
    if (this.loginForm.invalid || (this.showCaptcha && !this.captchaToken)) {
      return;
    }

    this.loading = true;

    const loginData = {
      ...this.loginForm.value,
      RecaptchaToken: this.captchaToken,
    };

    try {
      const response = await firstValueFrom(this.authService.login(loginData));
      console.log('API Response:', response);
      if (response.message === 'Login successfully!') {
        localStorage.setItem('token', response.token)
        this.router.navigate(['ShortUrl']);
        this.attempts = 0;
        this.showCaptcha = false;
        this.captchaToken = null;
        this.toastr.success('Đăng nhập thành công!');
      } else {
        this.toastr.error(response.message);
      }
    } catch (error) {
      this.attempts++;
      if (this.attempts >= 3) {
        this.showCaptcha = true;
        this.captchaToken = null;
      }
      this.toastr.error('Đăng nhập thất bại!');
      console.error(error);
    }

    this.loading = false;
  }

  goHome() {
    this.router.navigate(['/']);
  }
}