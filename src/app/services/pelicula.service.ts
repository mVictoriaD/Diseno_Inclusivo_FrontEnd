import { Injectable } from '@angular/core';
import { environment } from '../../environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Pelicula } from '../domain/pelicula.domain';
import { Genero } from '../domain/genero.domain';

// Forma en que el Backend devuelve cada película en la búsqueda
type PeliculaApi = Omit<Pelicula, 'genero'> & { genero?: { generoId?: number; nombreGenero?: string } };

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
      .get<PeliculaApi[] | null>(this.apiUrl, { params })
      .pipe(map(response => (response ?? []).map(p => ({
        ...p,
        // El Backend manda el género como { generoId, nombreGenero }; la vista usa { id, nombre }
        genero: new Genero(p.genero?.generoId, p.genero?.nombreGenero)
      }) as Pelicula)));
  }

  // Method to save a new pelicula
  guardarPelicula(pelicula: any): Observable<any> { // Usar 'any' o la interface Pelicula
    return this.http.post<any>(this.apiUrl, pelicula);
  }

  
}

