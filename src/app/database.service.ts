import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
}

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  private routes = new BehaviorSubject('');
  currentRoutes = this.routes.asObservable();

  private searchParams = new BehaviorSubject('');
  currentSearchParams = this.searchParams.asObservable();

  private apiUrl = 'http://localhost:5000/routes'

  constructor(private http: HttpClient) { }

  createRoute(route: any): Observable<any> {
    return this.http.post<any>(`http://localhost:5000/routes`, route, httpOptions)
  }

  createUser(user: any): Observable<any> {
    return this.http.post<any>(`http://localhost:5000/users/user`, user, httpOptions)
  }

  getAllRoutes(): Observable<any> {
    return this.http.get<any>('http://localhost:5000/routes')
  }

  getFilteredRoutes(filterField: any): Observable<any> {
    return this.http.get<any>(`http://localhost:5000/routes/search?from=${filterField.from}&to=${filterField.to}&date1=${filterField.date1}&date2=${filterField.date2}&numbOfPass=${filterField.numbOfPass}`, filterField)
  }

  filteredRoutes(routes: any) {
    this.routes.next(routes);
  }

  getSearchFields(searchParams: any) {
    this.searchParams.next(searchParams);
  }
}
