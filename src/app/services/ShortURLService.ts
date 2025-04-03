import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from '../../environments/environment'

@Injectable({ providedIn: 'root' }) 
export class ShortURLService {
  private apiUrl = environment.API_URL; 

  constructor(private http: HttpClient) {}


  getAllLinks(): Observable<any> {
    return this.http.get(`${this.apiUrl}/ShortUrl/getAll`);
  }

  createShortLink(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/ShortUrl/shorter`, data);
  }

  getLink(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/ShortUrl/getLink/${id}`);
  }

  getLinkByAlias(alias: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/ShortUrl/${alias}`);
  }

  updateShortLink(id: string, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/ShortUrl/update/${id}`, data);
  }

  deleteShortLink(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/ShortUrl/delete/${id}`);
  }

}