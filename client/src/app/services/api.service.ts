import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap, map } from 'rxjs/operators';
import { Sales } from '../sales';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};
const apiUrl = 'http://localhost:4000/api';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    };
  }

  getVendors(): Observable<string[]> {
    return this.http.get<string[]>(`${apiUrl}/vendors`).pipe(
      tap(_ => console.log('fetched vendors')),
      catchError(this.handleError('getVendors', []))
    );
  }

  getOrderStatusTypes(): Observable<string[]> {
    return this.http.get<string[]>(`${apiUrl}/order-status-types`).pipe(
      tap(_ => console.log('fetched order-status-types')),
      catchError(this.handleError('getOrderStatusTypes', []))
    );
  }

  getSales(): Observable<Sales[]> {
    return this.http.get<Sales[]>(`${apiUrl}/sales`)
      .pipe(
        tap(sales => console.log('fetched sales')),
        catchError(this.handleError('getSales', []))
      );
  }

  getSalesById(id: string): Observable<Sales> {
    const url = `${apiUrl}/sales/${id}`;
    return this.http.get<Sales>(url).pipe(
      tap(_ => console.log(`fetched sales id=${id}`)),
      catchError(this.handleError<Sales>(`getSalesById id=${id}`))
    );
  }

  addSales(sales: Sales): Observable<Sales> {
    return this.http.post<Sales>(`${apiUrl}/sales`, sales, httpOptions).pipe(
      tap((s: Sales) => console.log(`added sales w/ id=${s._id}`)),
      catchError(this.handleError<Sales>('addSales'))
    );
  }

  updateSales(id: string, sales: Sales): Observable<Sales> {
    const url = `${apiUrl}/sales/${id}`;
    return this.http.put<Sales>(url, sales, httpOptions).pipe(
      tap(_ => console.log(`updated sales id=${id}`)),
      catchError(this.handleError<Sales>('updateSales'))
    );
  }

  deleteSales(id: string): Observable<Sales> {
    const url = `${apiUrl}/sales${id}`;
    return this.http.delete<Sales>(url, httpOptions).pipe(
      tap(_ => console.log(`deleted sales id=${id}`)),
      catchError(this.handleError<Sales>('deleteSales'))
    );
  }

}
