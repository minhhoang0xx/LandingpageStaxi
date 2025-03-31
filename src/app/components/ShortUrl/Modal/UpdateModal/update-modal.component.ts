import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-update-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal" [class.show]="visible" [style.display]="visible ? 'block' : 'none'">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Update Short Link</h5>
            <button type="button" class="btn-close" (click)="onCancel()"></button>
          </div>
          <div class="modal-body">
            <p>Updating {{record?.alias}}</p>
            <!-- Thêm form nếu cần -->
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" (click)="onCancel()">Cancel</button>
            <button type="button" class="btn btn-primary" (click)="onUpdate()">Update</button>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-backdrop fade" [class.show]="visible" *ngIf="visible"></div>
  `,
  styles: []
})
export class UpdateModalComponent {
  @Input() visible: boolean = false;
  @Input() record: any = null;
  @Output() update = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  onUpdate() {
    this.update.emit();
  }

  onCancel() {
    this.cancel.emit();
  }
}