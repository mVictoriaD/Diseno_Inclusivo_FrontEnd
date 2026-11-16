import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { A11yModule, LiveAnnouncer } from '@angular/cdk/a11y';
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
  // Señales: la aplicación no usa Zone.js, así que la vista solo se actualiza cuando cambia una señal
  readonly generos = signal<Genero[]>([]);
  readonly actoresDisponibles = signal<Actor[]>([]);
  readonly actoresPelicula = signal<Actor[]>([]);
  selectedActorId: number | undefined; // ID del actor por agregar (SELECT)
  readonly modalAbierto = signal(false);
  readonly mensaje = signal('');
  readonly guardando = signal(false);
  // Servicio para avisarle al lector de pantalla el resultado
  private readonly announcer = inject(LiveAnnouncer);

  constructor(
    private fb: FormBuilder,
    private peliculaService: PeliculaService,
    private actorService: ActorService,
    private generoService: GeneroService) { }

  ngOnInit(): void {
    this.peliculaForm = this.fb.group({
      titulo: ['', Validators.required],
      subtitulada: [false],
      estreno: [false],
      genero: [null, Validators.required], // Usa un null para inicializar
      actores: [[], Validators.required] // arreglo vacío de actores de la película
    });
    this.loadGeneros();
    this.loadActores();
  }

  loadGeneros() {
    this.generoService.getGeneros().subscribe({
      next: (data) => this.generos.set(data ?? []),
      error: () => this.mensaje.set('No se pudieron cargar los géneros. Revise que el Backend esté corriendo.')
    });
  }

  loadActores() {
    this.actorService.getActores().subscribe({
      next: (data) => this.actoresDisponibles.set(data ?? []),
      error: () => this.mensaje.set('No se pudieron cargar los actores. Revise que el Backend esté corriendo.')
    });
  }

  // Antes de guardar se pide confirmación en un modal
  abrirModal() {
    if (this.peliculaForm.invalid) {
      this.peliculaForm.markAllAsTouched();
      return;
    }
    this.mensaje.set('');
    this.modalAbierto.set(true);
  }

  cerrarModal() {
    this.modalAbierto.set(false);
  }

  confirmarRegistro() {
    this.cerrarModal();
    this.guardando.set(true);
    this.peliculaService.guardarPelicula(this.toJson()).subscribe({
      next: () => {
        this.guardando.set(false);
        this.mensaje.set('Película registrada correctamente.');
        this.announcer.announce('Película registrada correctamente.', 'polite');
        this.limpiarFormulario();
      },
      error: () => {
        this.guardando.set(false);
        this.mensaje.set('No se pudo registrar la película. Intente de nuevo.');
        this.announcer.announce('No se pudo registrar la película. Intente de nuevo.', 'assertive');
      }
    });
  }

  limpiarFormulario() {
    this.peliculaForm.reset({ titulo: '', subtitulada: false, estreno: false, genero: null, actores: [] });
    this.actoresPelicula.set([]);
  }

  toJson(): Object {
    const formValue = this.peliculaForm.value;
    const actores: { actorId: number }[] = formValue.actores.map((actor: { id: number }) =>
      ({
        actorId: actor.id
      }));
    // retorno del objeto construido directamente
    return {
      titulo: formValue.titulo,
      subtitulada: formValue.subtitulada,
      estreno: formValue.estreno,
      genero: {
        generoId: formValue.genero
      },
      actores
    };
  }

  addActor() {
    if (this.selectedActorId) {
      const currentActors = this.peliculaForm.get('actores')?.value as Actor[];
      const actorToAdd = this.actoresDisponibles().find(actor => actor.id === this.selectedActorId);

      if (actorToAdd && !currentActors.some(actor => actor.id === this.selectedActorId)) {
        this.actoresPelicula.update(lista => [...lista, actorToAdd]);
        this.peliculaForm.get('actores')?.setValue([...currentActors, actorToAdd]); // … spread operator
      }
    }
  }

  removeActor(actorIdToRemove?: number) {
    const currentActors = this.peliculaForm.get('actores')?.value as Actor[];
    const updatedActors = currentActors.filter(actor => actor.id !== actorIdToRemove);
    this.actoresPelicula.update(lista => lista.filter(actor => actor.id !== actorIdToRemove));
    this.peliculaForm.get('actores')?.setValue(updatedActors);
  }

  onActorSelectionChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedActorId = parseInt(selectElement.value);
  }
}
