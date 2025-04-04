import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Authentication } from '../services/Authentication'; 
import { ToastrService } from 'ngx-toastr';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(Authentication); 
  const router = inject(Router); 
  const isLoggedIn = authService.isLoggedIn(); 
  const toastr = ToastrService.call
  if (!isLoggedIn) {
    alert('Bạn cần đăng nhập trước!'); 
    router.navigate(['/login']); 
    return false; 
  }

  return true; 
};