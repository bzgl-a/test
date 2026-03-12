import { Injectable, inject } from '@angular/core';
import { ConfirmationDialogComponent } from '../../components/shared/confirmation-dialog/confirmation-dialog.component';
import {
  NgbModal,
  NgbModalConfig,
  NgbModalRef,
} from '@ng-bootstrap/ng-bootstrap';

@Injectable({
  providedIn: 'root',
})
export class ConfirmationService {
  private modalService = inject(NgbModal);
  public config = inject(NgbModalConfig);

  public header: string = '';
  public body: string = '';
  public confirmButtonStyles: string = '';
  public cancellButtonStyles: string = '';
  public modalRef: NgbModalRef | undefined;

  public confirmAction(bodyText: string, action = 'reject'): Promise<boolean> {
    this.config.animation = true;
    this.config.backdrop = 'static';
    this.config.keyboard = false;
    this.config.centered = true;

    this.header = 'Подтвердите операцию';
    this.body = bodyText;
    action === 'approve'
      ? (this.confirmButtonStyles = 'btn-outline-success')
      : (this.confirmButtonStyles = 'btn-outline-danger');
    this.cancellButtonStyles = 'btn-outline-secondary';

    this.modalRef = this.modalService.open(
      ConfirmationDialogComponent,
      this.config,
    );

    return new Promise<boolean>((resolve) => {
      if (this.modalRef) {
        this.modalRef.componentInstance.confirm = () => {
          this.modalRef!.close();
          resolve(true);
        };
        this.modalRef.componentInstance.cancel = () => {
          this.modalRef!.dismiss();
          resolve(false);
        };
      }
    });
  }
}
