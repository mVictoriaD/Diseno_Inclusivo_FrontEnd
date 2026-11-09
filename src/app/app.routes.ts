import { Routes } from '@angular/router';
import { PeliculaSearchComponent } from './peliculas/pelicula-search.component/pelicula-search.component';
import { PeliculaInsertReactiveComponent } from './peliculas/pelicula-insert-reactive.component/pelicula-insert-reactive.component';

export const routes: Routes = [
  { path: '', redirectTo: 'pelicula-search', pathMatch: 'full' },
  { path: 'pelicula-search', component: PeliculaSearchComponent, title: 'Búsqueda de películas' },
  { path: 'pelicula-insert', component: PeliculaInsertReactiveComponent, title: 'Registrar película' },
];
