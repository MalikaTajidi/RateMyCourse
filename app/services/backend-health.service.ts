import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BackendHealthService {
  private apiUrl = '/api-gateway';

  constructor(private http: HttpClient) {}

  checkBackendHealth(): Observable<boolean> {
    return this.http.get(`${this.apiUrl}/health`, { 
      responseType: 'text',
      headers: { 'Content-Type': 'application/json' }
    }).pipe(
      timeout(5000), // 5 secondes de timeout
      catchError(() => of(false)),
      // Si on reçoit une réponse, le backend est disponible
      // Même si c'est une erreur 404, cela signifie que le serveur répond
    ) as Observable<boolean>;
  }
}
