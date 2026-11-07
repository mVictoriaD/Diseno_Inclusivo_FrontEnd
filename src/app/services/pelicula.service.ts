import { Injectable } from '@angular/core';
import { environment } from '../../environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Pelicula } from '../domain/pelicula.domain';

@Injectable({
  providedIn: 'root',
})
export class PeliculaService {

  private apiUrl = `${environment.API_URL}peliculas`; 
  
  //environment.API_URL + 'peliculas'; // Asegúrate de que esta URL sea correcta
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

  
}

