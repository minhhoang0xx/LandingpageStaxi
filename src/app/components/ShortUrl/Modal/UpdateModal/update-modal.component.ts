import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { ShortURLService } from '../../../../services/ShortURLService';
import { DomainService } from '../../../../services/DomainService';
import { ToastrService } from 'ngx-toastr';
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
  shortLink: string = '';
  loading: boolean = false;
  isChecked: boolean = false;
  qrCode: string = ''
  constructor(
    private fb: FormBuilder,
    private ShortURLService: ShortURLService,
    private domainService: DomainService,
    private router: Router,
    private jwtHelper: JwtHelperService,
    private toastr: ToastrService
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
        this.shortLink = this.record.shortLink;
        this.qrCode = this.record.qrCode;
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
        const data = this.shortUrlForm.value;
    try {
      const selectedDomain = this.domains.find(domain => domain.link === data.domain);
      data.projectName = selectedDomain.name;
      data.checkOS = this.isChecked;
      const token = localStorage.getItem('token'); 
      const decodedToken = this.jwtHelper.decodeToken(token || '');
      data.createdByUser = decodedToken['name'];
      const linkShort = `${data.domain}/${data.alias}`;
      const qr = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(linkShort)}`;
      data.qrCode = qr;
      const res =await firstValueFrom(this.ShortURLService.updateShortLink(this.record.id, data));
      this.shortLink = linkShort;
      this.qrCode = this.qrCode;
      this.onUpdate.emit();
      this.toastr.success('Cập nhật thành công!');
    } catch (error: any) {
      console.error('Error updating URL:', error);
      let err = "Xảy ra lỗi khi cạp nhật!";
      if (error.response?.data?.errorMessage) {
        err = error.response.data.errorMessage;
      } 
      this.toastr.error(err);
    }
    this.loading = false;
  }


  copyToClipboard() {
    if (this.shortLink) {
      navigator.clipboard.writeText(this.shortLink)
        .then(() => this.toastr.success('Link đã được sao chép!'))
        .catch(() => this.toastr.error('Không thể sao chép link!'));
    }
  }

  openLink() {
    if (this.shortLink) {
      window.open(this.shortLink, '_blank');
    }
  }

  resetForm() {
    this.shortUrlForm.reset();
    this.shortLink = '';
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