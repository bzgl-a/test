import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-reject-request-modal',
  imports: [FormsModule],
  templateUrl: './reject-request-modal.component.html',
  styleUrl: './reject-request-modal.component.scss',
})
export class RejectRequestModalComponent {
  public activeModal = inject(NgbActiveModal);
  public reason: string = '';

  public onReject() {
    if (this.reason.trim()) {
      this.activeModal.close(this.reason.trim());
    }
  }
}
