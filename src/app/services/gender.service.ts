// src/app/services/patient.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Gender } from '../models/gender.model';

@Injectable({
  providedIn: 'root'
})
export class GenderService {
  private apiUrl = 'https://localhost:7157/api';

  constructor(private http: HttpClient) {}

  getGenders(): Observable<Gender[]> {
  return this.http.get<Gender[]>(`${this.apiUrl}/Gender`);
  }


}
