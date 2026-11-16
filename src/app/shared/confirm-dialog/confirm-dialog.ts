import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],

  //Diseño de la ventana emergente
  template: `
    <h2 mat-dialog-title>Confirmar eliminación</h2>
    <mat-dialog-content>{{ data.mensaje }}</mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button [mat-dialog-close]="false" cdkFocusInitial>No</button>
      <button mat-flat-button color="warn" [mat-dialog-close]="true">Sí</button>
    </mat-dialog-actions>
  `,
})
export class ConfirmDialogComponent {
  //Recibe el mensaje y lo moldea al template 
  data = inject<{ mensaje: string }>(MAT_DIALOG_DATA);
}