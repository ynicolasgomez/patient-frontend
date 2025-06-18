import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Order } from '../models/order-model';

@Injectable({
  providedIn: 'root',
})
export class ExamService {
  private apiUrl = 'https://localhost:7157/api/Exam';

  constructor(private http: HttpClient) {}

  getAll(): Observable<any[]> {
    return this.http.get<any>(this.apiUrl);
  }

  create(exam: any): Observable<any> {
    return this.http.post<Order>(this.apiUrl, exam);
  }
}
