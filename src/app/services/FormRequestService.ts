import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from '../../environments/environment'

@Injectable({ providedIn: 'root' }) 
export class FormRequestService {
  private apiUrl = environment.API_URL; 

  constructor(private http: HttpClient) {}


  saveRequestBAE(data:any): Observable<any> {
    return this.http.post(`${this.apiUrl}/FormRequest/saveRequestStaxi`,data);
  }

  saveRequestStaxi(data:any): Observable<any> {
    return this.http.post(`${this.apiUrl}/FormRequest/saveRequestStaxi`,data);
  }

}