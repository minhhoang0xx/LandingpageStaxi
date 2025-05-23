import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from '../../environments/environment'

@Injectable({ providedIn: 'root' }) 
export class DomainService {
  private apiUrl = environment.API_URL; 

  constructor(private http: HttpClient) {}


  getAll(): Observable<any> {
    return this.http.get(`${this.apiUrl}/Domain/getAll`);
  }



}