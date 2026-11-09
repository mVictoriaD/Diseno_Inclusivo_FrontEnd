import { A11yModule, LiveAnnouncer } from '@angular/cdk/a11y';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Genero } from '../../domain/genero.domain';
import { Actor } from '../../domain/actor.domain';
import { PeliculaService } from '../../services/pelicula.service';
import { ActorService } from '../../services/actor.service';
import { GeneroService } from '../../services/genero.service';

@Component({
  selector: 'app-pelicula-insert-reactive.component',
  imports: [ReactiveFormsModule, CommonModule, A11yModule],
  templateUrl: './pelicula-insert-reactive.component.html',
  styleUrl: './pelicula-insert-reactive.component.css',
})
export class PeliculaInsertReactiveComponent {
  peliculaForm!: FormGroup;
  generos: Genero[] = [];
  actoresDisponibles: Actor[] = [];
  actoresPelicula: Actor[] = [];
  selectedActorId: number | undefined;
  modalAbierto = signal(false);
  mensaje = signal('');

  constructor(
    private fb: FormBuilder,
    private peliculaService: PeliculaService,
    private actorService: ActorService,
    private generoService: GeneroService,
    private cdr: ChangeDetectorRef,
    private announcer: LiveAnnouncer) { }

  ngOnInit(): void {
    this.peliculaForm = this.fb.group({
      titulo: ['', Validators.required],
      subtitulada: [false],
      estreno: [false],
      genero: [null, Validators.required],
      actores: [[], Validators.required]
    });
    this.loadGeneros();
    this.loadActores();
  }

  loadGeneros() {
    this.generoService.getGeneros().subscribe({
      next: (data) => { this.generos = data; this.cdr.markForCheck(); },
      error: () => { this.generos = [new Genero(1, 'Drama'), new Genero(2, 'Comedia')]; this.cdr.markForCheck(); },
    });
  }

  loadActores() {
    this.actorService.getActores().subscribe({
      next: (data) => { this.actoresDisponibles = data; this.cdr.markForCheck(); },
      error: () => { this.actoresDisponibles = [new Actor(1, 'Ana', 'Mora'), new Actor(2, 'Luis', 'Rojas')]; this.cdr.markForCheck(); },
    });
  }

  abrirModal() { this.modalAbierto.set(true); }
  cerrarModal() { this.modalAbierto.set(false); }

  confirmarRegistro() {
    this.cerrarModal();
    this.peliculaService.guardarPelicula(this.toJson()).subscribe({
      next: () => {
        this.mensaje.set('Película registrada correctamente');
        this.announcer.announce('Película registrada correctamente', 'polite');
      },
      error: () => {
        this.mensaje.set('No se pudo registrar la película. Intente de nuevo.');
        this.announcer.announce('No se pudo registrar la película. Intente de nuevo.', 'assertive');
      },
    });
  }

  toJson(): Object {
    const formValue = this.peliculaForm.value;
    const actores = formValue.actores.map((actor: { id: number }) => ({ actorId: actor.id }));
    return {
      titulo: formValue.titulo,
      subtitulada: formValue.subtitulada,
      estreno: formValue.estreno,
      genero: { generoId: formValue.genero },
      actores
    };
  }

  addActor() {
    if (this.selectedActorId) {
      const currentActors = this.peliculaForm.get('actores')?.value as Actor[];
      const actorToAdd = this.actoresDisponibles.find(actor => actor.id === this.selectedActorId);
      if (actorToAdd && !currentActors.some(actor => actor.id === this.selectedActorId)) {
        this.actoresPelicula.push(actorToAdd);
        this.peliculaForm.get('actores')?.setValue([...currentActors, actorToAdd]);
      }
    }
  }

  removeActor(actorIdToRemove?: number) {
    const currentActors = this.peliculaForm.get('actores')?.value as Actor[];
    const updatedActors = currentActors.filter(actor => actor.id !== actorIdToRemove);
    this.actoresPelicula = this.actoresPelicula.filter(actor => actor.id !== actorIdToRemove);
    this.peliculaForm.get('actores')?.setValue(updatedActors);
  }

  onActorSelectionChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedActorId = parseInt(selectElement.value);
  }
}