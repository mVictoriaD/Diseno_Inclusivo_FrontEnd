import { Component, DestroyRef, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { PeliculaService } from '../../services/pelicula.service';
import { Pelicula } from '../../domain/pelicula.domain';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, finalize, of } from 'rxjs';

@Component({
  selector: 'app-pelicula-search-demo',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './pelicula-search-demo.component.html',
  styleUrl: './pelicula-search-demo.component.css',
})
export class PeliculaSearchDemoComponent {

  private readonly fb = inject(FormBuilder);
  private readonly peliculaService = inject(PeliculaService);
  private readonly destroyRef = inject(DestroyRef);

  readonly searchForm = this.fb.nonNullable.group({
    titulo: '',
    genero: '',
  });

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
      .subscribe((peliculas) => {
        this.resultados.set(peliculas);
      });
  }

  limpiar(): void {

    this.searchForm.reset({
      titulo: '',
      genero: '',
    });

    this.resultados.set([]);
    this.loading.set(false);
    this.searched.set(false);
    this.error.set(null);
  }

  trackByPeliculaId(_: number, pelicula: Pelicula): number {
    return pelicula.peliculaId;
  }
}