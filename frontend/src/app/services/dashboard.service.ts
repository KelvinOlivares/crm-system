import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface DashboardStats {
  total_contacts: number;
  total_deals: number;
  open_deals: number;
  won_deals: number;
  total_revenue: number;
  pipeline_value: number;
  pending_activities: number;
}

export interface DashboardData {
  stats: DashboardStats;
  recent_contacts: any[];
  recent_deals: any[];
  upcoming_activities: any[];
  deals_by_stage: any[];
}

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private apiUrl = 'http://localhost:8000/api/dashboard';

  constructor(private http: HttpClient) {}

  getDashboard(): Observable<DashboardData> {
    return this.http.get<DashboardData>(this.apiUrl);
  }
}
