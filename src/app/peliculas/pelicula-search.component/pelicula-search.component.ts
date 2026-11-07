import { Component, DestroyRef, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { PeliculaService } from '../../services/pelicula.service';
import { Pelicula } from '../../domain/pelicula.domain';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, finalize, of } from 'rxjs';

@Component({
  selector: 'app-pelicula-search.component',
  imports: [ReactiveFormsModule],
  templateUrl: './pelicula-search.component.html',
  styleUrl: './pelicula-search.component.css',
})
export class PeliculaSearchComponent {
  private readonly fb = inject(FormBuilder);
  private readonly peliculaService = inject(PeliculaService);
  private readonly destroyRef = inject(DestroyRef);

  readonly searchForm = this.fb.nonNullable.group({
    titulo: '',
    genero: '',
  });

  /*buscar():void{
    console.log('Buscar peliculas con titulo: ', 
      this.searchForm.value.titulo, ' y genero: ',
       this.searchForm.value.genero);
  }*/
  readonly resultados = signal<Pelicula[]>([]);
  readonly loading = signal(false);
  readonly searched = signal(false);
  readonly error = signal<string | null>(null);

  buscar(): void {
    const { titulo, genero } = this.searchForm.getRawValue();

    this.loading.set(true);
    this.searched.set(true);
    this.error.set(null);

    this.peliculaService
      .findMovies(titulo.trim(), genero.trim())
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError(() => {
          this.error.set('No se pudieron cargar las películas.');
          return of([] as Pelicula[]);
        }),
        finalize(() => this.loading.set(false))
      )
      .subscribe((peliculas) => this.resultados.set(peliculas)); 
      console.log(this.resultados());
      console.log(this.error());
  }

   limpiar(): void {
    this.searchForm.reset({ titulo: '', genero: '' });
    this.resultados.set([]);
    this.loading.set(false);
    this.searched.set(false);
    this.error.set(null);
  }

  trackByPeliculaId(_: number, pelicula: Pelicula): number {
    return pelicula.peliculaId;
  }

}
