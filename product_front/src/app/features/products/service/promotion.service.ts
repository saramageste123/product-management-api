import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Promotion } from '../models/promotion.model';

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

  createPromotion(promotion: any): Observable<Promotion> {
    return this.http.post<Promotion>(this.apiUrl, promotion);
  }

  deletePromotion(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  deletePromotions(ids: number[]): Observable<void> {
    return this.http.delete<void>(this.apiUrl, {
      body: ids
    });
  }
}