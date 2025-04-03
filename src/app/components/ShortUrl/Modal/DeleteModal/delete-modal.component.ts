import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShortURLService } from '../../../../services/ShortURLService';
import { firstValueFrom } from 'rxjs';
@Component({
  selector: 'app-delete-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './delete-modal.component.html',
  styleUrls:['delete-modal.component.css']
})
export class DeleteModalComponent {
  @Input() visible: boolean = false;
  @Input() record: any = null;
  @Output() onDelete = new EventEmitter<void>();
  @Output() onCancel = new EventEmitter<void>();

  constructor(private ShortURLService: ShortURLService) {}

  async handleDelete() {
    if (!this.record || !this.record.id) {
      alert('Không có dữ liệu để xóa!');
      return;
    }
    try {
      // const response = await firstValueFrom(this.ShortURLService.deleteShortLink(this.record.id));
      // if (response) {
        alert('Xóa thành công!');
        this.onDelete.emit();
      // } else {
      //   alert('Xóa thất bại!');
      // }
    } catch (error) {
      console.error('Lỗi khi xóa:', error);
      alert('Đã xảy ra lỗi khi xóa!');
    }
  }

  handleCancel() {
    this.onCancel.emit();
  }
}