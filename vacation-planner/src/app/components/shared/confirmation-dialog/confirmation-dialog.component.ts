import { Component, inject } from '@angular/core';
import { ConfirmationService } from '../../../services/confirmation/confirmation.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirmation-dialog',
  imports: [CommonModule],
  templateUrl: './confirmation-dialog.component.html',
  styleUrl: './confirmation-dialog.component.scss',
})
export class ConfirmationDialogComponent {
  protected confirmationService = inject(ConfirmationService);
}
