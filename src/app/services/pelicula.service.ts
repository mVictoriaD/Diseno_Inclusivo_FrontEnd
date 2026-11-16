import { Injectable } from '@angular/core';
import { environment } from '../../environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Pelicula } from '../domain/pelicula.domain';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class PeliculaService {
  private apiUrl = `${environment.API_URL}peliculas`; 
  
  constructor(private http: HttpClient) { }

  findMovies(titulo: string = '', genero: string = ''): Observable<Pelicula[]> {
    const params = new HttpParams()
      .set('titulo', titulo ?? '')
      .set('genero', genero ?? '');
    
    // petición http GET
    return this.http
      .get<Pelicula[] | null>(this.apiUrl, { params })
      .pipe(map(response => response ?? []));
  }

  // Method to save a new pelicula
  guardarPelicula(pelicula: any): Observable<any> { // Usar 'any' o la interface Pelicula
    return this.http.post<any>(this.apiUrl, pelicula);
  }

  // Método de eliminar película
  deletePelicula(pelicula: Pelicula): Observable<HttpResponse<Pelicula>> {
    return this.http.delete<Pelicula>(this.apiUrl, {
      body: pelicula,
      observe: 'response' 
    });
  }
}