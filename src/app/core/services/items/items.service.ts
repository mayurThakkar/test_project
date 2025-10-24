import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Item } from '../../models/item.model';

@Injectable({
  providedIn: 'root'
})
export class ItemsService {
  private readonly http = inject(HttpClient);
  private readonly API_URL = '/api/items';

  getItems(): Observable<Item[]> {
    return this.http.get<Item[]>(this.API_URL);
  }

  getItemById(id: number): Observable<Item> {
    return this.http.get<Item>(`${this.API_URL}/${id}`);
  }
}