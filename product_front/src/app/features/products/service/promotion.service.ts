import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Promotion, PagedPromotionResponse } from '../models/promotion.model';
import { PromotionCreateRequest } from '../models/promotion-create.model';

export interface PromotionFilters {
  targetType?: 'PRODUCT' | 'CATEGORY' | null;
  startDate?: string | null; // ISO yyyy-MM-dd
  endDate?: string | null;
  status?: 'SCHEDULED' | 'ACTIVE' | 'FINISHED' | null;
}

@Injectable({
  providedIn: 'root'
})
export class PromotionService {

  private readonly apiUrl = 'http://localhost:8080/api/promotions';

  constructor(private http: HttpClient) {}

  getPromotions(
    page: number, 
    size: number, 
    sortBy: string = 'startDate,desc', 
    filters?: PromotionFilters
  ): Observable<PagedPromotionResponse> {
    let params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('sortBy', sortBy);

    if (filters?.targetType) params = params.set('targetType', filters.targetType);
    if (filters?.startDate) params = params.set('startDate', filters.startDate);
    if (filters?.endDate) params = params.set('endDate', filters.endDate);
    if (filters?.status) params = params.set('status', filters.status);

    return this.http.get<PagedPromotionResponse>(this.apiUrl, { params });
  }

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