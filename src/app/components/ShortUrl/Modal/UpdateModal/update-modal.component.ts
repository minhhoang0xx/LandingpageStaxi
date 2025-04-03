import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import { ShortURLService } from '../../../../services/ShortURLService';
import { DomainService } from '../../../../services/DomainService';
@Component({
  selector: 'app-update-modal',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './update-modal.component.html',
  styleUrls: ['./update-modal.component.css']
})
export class UpdateModalComponent implements OnChanges {
  @Input() visible: boolean = false;
  @Input() record: any = null;
  @Output() onUpdate = new EventEmitter<void>();
  @Output() onCancel = new EventEmitter<void>();

  shortUrlForm: FormGroup;
  domains: any[] = [];
  shortUrl: string = '';
  loading: boolean = false;
  isChecked: boolean = false;
  qrCode: string = ''
  constructor(
    private fb: FormBuilder,
    private ShortURLService: ShortURLService,
    private domainService: DomainService,
    private router: Router,
    // private jwtHelper: JwtHelperService
  ) {
    this.shortUrlForm = this.fb.group({
      originalUrl: ['', [Validators.required, Validators.pattern(/^\S+$/)]],
      domain: ['', Validators.required],
      alias: ['', [
        Validators.required,
        Validators.pattern(/^\S+$/),
        Validators.pattern(/^[a-zA-Z0-9]+$/)
      ]],
      checkOS: [false],
      iosLink: [''],
      androidLink: ['']
    });
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['visible'] && this.visible) {
      this.fetchDomains();
      if (this.record) {
        this.shortUrlForm.patchValue(this.record);
        this.isChecked = this.record.checkOS;
      }
    }
  }


  async fetchDomains() {
    try {
      console.log('domain123123s');
      const response = await firstValueFrom(this.domainService.getAll());
      this.domains = response.$values;
      
    } catch (error) {
      console.error('Error fetching domains:', error);
    }
  }

  async onSubmit() {
    if (this.shortUrlForm.invalid) return;
    this.loading = true;
    try {
      const updatedData = this.shortUrlForm.value;
      await this.ShortURLService.updateShortLink(this.record.id, updatedData);
      alert('Cập nhật thành công!');
      this.onUpdate.emit();
    } catch (error) {
      console.error('Error updating URL:', error);
      alert('Cập nhật thất bại!');
    }
    this.loading = false;
  }


  copyToClipboard() {
    if (this.shortUrl) {
      navigator.clipboard.writeText(this.shortUrl)
        .then(() => alert('Link đã được sao chép!'))
        .catch(() => alert('Không thể sao chép link!'));
    }
  }

  openLink() {
    if (this.shortUrl) {
      window.open(this.shortUrl, '_blank');
    }
  }

  resetForm() {
    this.shortUrlForm.reset();
    this.shortUrl = '';
    this.qrCode = '';
    this.isChecked = false;
  }

  handleCancel() {
    this.onCancel.emit();
  }


  handleCheckOSChange() {
  this.isChecked = !this.isChecked;
  if (this.isChecked) {
    this.shortUrlForm.get('iosLink')?.setValidators([Validators.required, Validators.pattern(/^\S+$/)]);
    this.shortUrlForm.get('androidLink')?.setValidators([Validators.required, Validators.pattern(/^\S+$/)]);
  } else {
    this.shortUrlForm.get('iosLink')?.clearValidators();
    this.shortUrlForm.get('androidLink')?.clearValidators();
    this.shortUrlForm.patchValue({
      iosLink: '',
      androidLink: ''
    });
  }
  this.shortUrlForm.get('iosLink')?.updateValueAndValidity();
  this.shortUrlForm.get('androidLink')?.updateValueAndValidity();
}

}