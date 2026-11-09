import { Routes } from '@angular/router';
import { PeliculaSearchComponent } from './peliculas/pelicula-search.component/pelicula-search.component';
import { PeliculaInsertReactiveComponent } from './peliculas/pelicula-insert-reactive.component/pelicula-insert-reactive.component';
import { PeliculaSearchDemoComponent } from './peliculas/pelicula-search-demo.component/pelicula-search-demo.component';
import { PeliculaSearchAccesibleComponent } from './peliculas/pelicula-search-accesible.component/pelicula-search-accesible.component';

export const routes: Routes = [
    { path: 'pelicula-search', component:  PeliculaSearchComponent},
    { path: 'pelicula-insert', component:  PeliculaInsertReactiveComponent},
    { path: 'pelicula-search-demo', component:  PeliculaSearchDemoComponent},
    { path: 'pelicula-search-accesible', component:  PeliculaSearchAccesibleComponent},
];
