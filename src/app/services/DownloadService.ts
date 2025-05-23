import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from '../../environments/environment'

@Injectable({ providedIn: 'root' }) 
export class DownloadService {
  private apiUrl = environment.API_URL; 

  constructor(private http: HttpClient) {}


  download(): Observable<any> {
    return this.http.get(`${this.apiUrl}/Download/download`,{responseType: "blob"});
  }



}