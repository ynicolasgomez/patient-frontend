import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DocumentTypeModel } from '../models/document-type.model';

@Injectable({
  providedIn: 'root'
})
export class DocumentTypeService {
  private baseUrl = 'https://localhost:7157/api/documenttype';

  constructor(private http: HttpClient) {}

  getAll(): Observable<DocumentTypeModel[]> {
    return this.http.get<DocumentTypeModel[]>(this.baseUrl);
  }
}
