import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Deal {
  id: number;
  contact_id: number;
  title: string;
  value: number;
  currency: string;
  stage: string;
  probability: number;
  expected_close_date: string;
  status: string;
  contact?: any;
  created_at: string;
}

export interface Pipeline {
  [stage: string]: {
    deals: Deal[];
    total: number;
  };
}

@Injectable({
  providedIn: 'root',
})
export class DealService {
  private apiUrl = 'http://localhost:8000/api/deals';

  constructor(private http: HttpClient) {}

  getDeals(params?: any): Observable<any> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach((key) => {
        if (params[key] !== null && params[key] !== undefined) {
          httpParams = httpParams.set(key, params[key]);
        }
      });
    }
    return this.http.get<any>(this.apiUrl, { params: httpParams });
  }

  getDeal(id: number): Observable<Deal> {
    return this.http.get<Deal>(`${this.apiUrl}/${id}`);
  }

  createDeal(data: Partial<Deal>): Observable<Deal> {
    return this.http.post<Deal>(this.apiUrl, data);
  }

  updateDeal(id: number, data: Partial<Deal>): Observable<Deal> {
    return this.http.put<Deal>(`${this.apiUrl}/${id}`, data);
  }

  deleteDeal(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  getPipeline(): Observable<Pipeline> {
    return this.http.get<Pipeline>(`${this.apiUrl}/pipeline`);
  }
}
