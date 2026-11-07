import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeliculaInsertReactiveComponent } from './pelicula-insert-reactive.component';

describe('PeliculaInsertReactiveComponent', () => {
  let component: PeliculaInsertReactiveComponent;
  let fixture: ComponentFixture<PeliculaInsertReactiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PeliculaInsertReactiveComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PeliculaInsertReactiveComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
