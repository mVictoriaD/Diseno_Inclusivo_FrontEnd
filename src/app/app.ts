import { afterNextRender, Component, inject, Injector, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { filter, skip } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('videorent-frontend');
  private readonly announcer = inject(LiveAnnouncer);
  private readonly injector = inject(Injector);

  constructor() {
    inject(Router).events.pipe(
      filter(e => e instanceof NavigationEnd),
      skip(1),
      takeUntilDestroyed()
    ).subscribe(() => {
      afterNextRender(() => {
        document.getElementById('titulo-principal')?.focus();
        this.announcer.announce('Vista cargada: ' + document.title);
      }, { injector: this.injector });
    });
  }
}
