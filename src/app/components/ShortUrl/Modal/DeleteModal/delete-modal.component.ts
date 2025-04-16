import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShortURLService } from '../../../../services/ShortURLService';
import { firstValueFrom } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
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

  constructor(private ShortURLService: ShortURLService, 
    private toastr: ToastrService) {}

  async handleDelete() {
    if (!this.record || !this.record.id) {
      this.toastr.error('Không có dữ liệu để xóa!');
      return;
    }
    try {
      const response = await firstValueFrom(this.ShortURLService.deleteShortLink(this.record.id));
      if (response) {
        this.onDelete.emit();
        this.toastr.success('Xóa thành công!');
      } 
    } catch (error: any) {
      console.error('Lỗi khi xóa:', error);
      let err = "Đã xảy ra lỗi khi xóa!";
      if (error.response?.data.errorMessage)
        {
          err = error.response?.data.errorMessage
        }
      this.toastr.error(err);
    }
  }

  handleCancel() {
    this.onCancel.emit();
  }
}