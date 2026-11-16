import { Component, DestroyRef, inject, signal } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { PeliculaService } from '../../services/pelicula.service';
import { Pelicula } from '../../domain/pelicula.domain';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, finalize, of } from 'rxjs';

@Component({
  selector: 'app-pelicula-search-accesible',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './pelicula-search-accesible.component.html',
  styleUrl: './pelicula-search-accesible.component.css',
})
export class PeliculaSearchAccesibleComponent {

  private readonly fb = inject(FormBuilder);
  private readonly peliculaService = inject(PeliculaService);
  private readonly destroyRef = inject(DestroyRef);

  readonly searchForm = this.fb.nonNullable.group({

    titulo: ['', Validators.maxLength(100)],

    genero: ['', Validators.maxLength(50)]

  });

  readonly resultados = signal<Pelicula[]>([]);
  readonly loading = signal(false);
  readonly searched = signal(false);
  readonly error = signal<string | null>(null);

  buscar(): void {

    this.searchForm.markAllAsTouched();

    if (this.searchForm.invalid) {
      return;
    }

    const { titulo, genero } = this.searchForm.getRawValue();

    this.loading.set(true);
    this.searched.set(true);
    this.error.set(null);

    this.peliculaService
      .findMovies(titulo.trim(), genero.trim())
      .pipe(

        takeUntilDestroyed(this.destroyRef),

        catchError(() => {

          this.error.set(
            'No se pudieron cargar las películas. Intente nuevamente.'
          );

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
      genero: ''
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

/* Mejoras: Se han incorporado validaciones de longitud, 
se gestionan errores con markAllAsTouched(), si el formulario tiene
datos invalidos evita seguir buscando.

*/