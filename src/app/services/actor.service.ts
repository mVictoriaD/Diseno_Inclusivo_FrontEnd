import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Actor } from '../domain/actor.domain';
import { environment } from '../../environment';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ActorService {
  private http = inject(HttpClient); // inyección de HttpClient
  private url:string = environment.API_URL;
 
  // Patrón reactivo para obtener los actores
  // HttpClient.get devuelve un Observable, lo que permite suscribirse a los cambios de datos en tiempo real
  // PRIMERA OPCIÓN
  //actores = this.http.get<Actor[]>(`${this.url}actores`);
  
  constructor() { }

  // COMPLEMENTA LA PRIMERA OPCIÓN
  getActores(): Observable<Actor[]> {
    return this.http.get<Actor[]>(`${this.url}actores`);
  }
}
