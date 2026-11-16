import { afterNextRender, Component, inject, Injector, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { filter, skip } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('videorent-frontend');
  // Servicio para hablarle al lector de pantalla
  private readonly announcer = inject(LiveAnnouncer);
  // Lo ocupa afterNextRender dentro del subscribe
  private readonly injector = inject(Injector);

  constructor() {
    // Escucho las navegaciones del enrutador
    inject(Router).events.pipe(
      // Solo me interesa cuando terminó la navegación
      filter(e => e instanceof NavigationEnd),
      // Ignoro la primera carga de la aplicación
      skip(1),
      takeUntilDestroyed()
    ).subscribe(() => {
      // Espero a que la vista nueva esté dibujada
      afterNextRender(() => {
        // Muevo el foco al título y anuncio la vista
        document.getElementById('titulo-principal')?.focus();
        this.announcer.announce('Vista cargada: ' + document.title);
      }, { injector: this.injector });
    });
  }
}
