import { Component, DestroyRef, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { PeliculaService } from '../../services/pelicula.service';
import { Pelicula } from '../../domain/pelicula.domain';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, finalize, of } from 'rxjs';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog';
@Component({
  selector: 'app-pelicula-search', // Ojo: se suele quitar el punto final en el selector ('app-pelicula-search')
  imports: [ReactiveFormsModule],
  templateUrl: './pelicula-search.component.html',
  styleUrl: './pelicula-search.component.css',
})
export class PeliculaSearchComponent {
  private readonly fb = inject(FormBuilder);
  private readonly peliculaService = inject(PeliculaService);
  private readonly destroyRef = inject(DestroyRef);

  readonly searchForm = this.fb.nonNullable.group({
    titulo: [''],
    genero: [''],
  });

  readonly resultados = signal<Pelicula[]>([]);
  readonly loading = signal(false);
  readonly searched = signal(false);
  readonly error = signal<string | null>(null);
  private dialog = inject(MatDialog);

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
        // Los console.log van aquí dentro si quieres ver el valor ya actualizado
        console.log(this.resultados());
        console.log(this.error());
      });
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

  eliminarPelicula(pelicula: Pelicula): void {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: { mensaje: '¿Está seguro(a) que desea eliminar el registro?' },
    });

    ref.afterClosed().subscribe((confirmado: boolean) => {
      if (confirmado) {
        this.peliculaService.deletePelicula(pelicula).subscribe({
          next: (_result: HttpResponse<Pelicula>) => {
            // Quita de la lista la película eliminada
            this.resultados.update((lista) =>
              lista.filter((p) => p.peliculaId !== pelicula.peliculaId)
            );
            this.error.set('Película eliminada con éxito.');
          },
          error: (_error: HttpErrorResponse) => {
            this.error.set('Error al eliminar película');
          },
        });
      } // Cierre del 'if' 
    }); // Cierre del '.subscribe' 
  } // Cierre del método 'eliminarPelicula' 

}