import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Promotion } from '../models/promotion.model';
import { PromotionCreateRequest } from '../models/promotion-create.model';

@Injectable({
  providedIn: 'root'
})
export class PromotionService {

  private readonly apiUrl = 'http://localhost:8080/api/promotions';

  constructor(private http: HttpClient) {}

  getAllPromotions(): Observable<Promotion[]> {
    return this.http.get<Promotion[]>(`${this.apiUrl}/all`);
  }

  getPromotionById(id: number): Observable<Promotion> {
    return this.http.get<Promotion>(`${this.apiUrl}/id/${id}`);
  }

  createPromotion(payload: PromotionCreateRequest): Observable<Promotion> {
    return this.http.post<Promotion>(this.apiUrl, payload);
  }

  deletePromotion(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/id/${id}`);
  }

  deletePromotions(ids: number[]): Observable<void> {
    return this.http.request<void>('delete', `${this.apiUrl}/bulk-delete`, {
      body: ids
    });
  }
}