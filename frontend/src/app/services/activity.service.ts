import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Activity {
  id: number;
  contact_id: number;
  deal_id: number;
  type: string;
  subject: string;
  description: string;
  due_date: string;
  completed: boolean;
  completed_at: string;
  contact?: any;
  deal?: any;
  created_at: string;
}

@Injectable({
  providedIn: 'root',
})
export class ActivityService {
  private apiUrl = 'http://localhost:8000/api/activities';

  constructor(private http: HttpClient) {}

  getActivities(params?: any): Observable<any> {
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

  getActivity(id: number): Observable<Activity> {
    return this.http.get<Activity>(`${this.apiUrl}/${id}`);
  }

  createActivity(data: Partial<Activity>): Observable<Activity> {
    return this.http.post<Activity>(this.apiUrl, data);
  }

  updateActivity(id: number, data: Partial<Activity>): Observable<Activity> {
    return this.http.put<Activity>(`${this.apiUrl}/${id}`, data);
  }

  deleteActivity(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
