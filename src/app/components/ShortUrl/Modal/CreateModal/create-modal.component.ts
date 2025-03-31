import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-create-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal" [class.show]="visible" [style.display]="visible ? 'block' : 'none'">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Create Short Link</h5>
            <button type="button" class="btn-close" (click)="onCancel()"></button>
          </div>
          <div class="modal-body">
            <p>Create new short link here</p>
            <!-- Thêm form nếu cần -->
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" (click)="onCancel()">Cancel</button>
            <button type="button" class="btn btn-primary" (click)="onCreate()">Create</button>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-backdrop fade" [class.show]="visible" *ngIf="visible"></div>
  `,
  styles: []
})
export class CreateModalComponent {
  @Input() visible: boolean = false;
  @Output() create = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  onCreate() {
    this.create.emit();
  }

  onCancel() {
    this.cancel.emit();
  }
}