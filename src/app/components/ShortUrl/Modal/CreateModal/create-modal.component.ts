
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { ShortURLService } from '../../../../services/ShortURLService';
import { DomainService } from '../../../../services/DomainService';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-create-modal',
  templateUrl: './create-modal.component.html',
  styleUrls: ['./create-modal.component.css'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule
  ]
})
export class CreateModalComponent implements OnChanges {
  @Input() visible: boolean = false;
  @Output() onCancel = new EventEmitter<void>();
  @Output() onCreate = new EventEmitter<void>();

  shortUrlForm: FormGroup;
  qrCode: string = '';
  shortUrl: string = '';
  domains: any[] = [];
  loading: boolean = false;
  isChecked: boolean = false;

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
    }
  }

  async fetchDomains() {
    try {
      const response = await firstValueFrom(this.domainService.getAll());
      this.domains = response.$values;
      console.log('domains', response);
    } catch (error) {
      console.error('Error fetching domains:', error);
    }
  }

  onFormValuesChange() {
    const domain = this.shortUrlForm.get('domain')?.value;
    const alias = this.shortUrlForm.get('alias')?.value || '';
    if (domain) {
      const combinedUrl = alias ? `${domain}/${alias}` : domain;
      this.shortUrl = combinedUrl;
      console.log('combinedUrl', combinedUrl)
    }
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

      const response = await firstValueFrom(this.ShortURLService.createShortLink(data));
      if (response && response.shortLink) {
        this.shortUrl = linkShort;
        this.qrCode = qr;
        console.log('qrcode', this.qrCode)
        console.log('res', response.shortLink)
        this.onCreate.emit();
        this.toastr.success('Tạo thành công!');
      } else {
        throw new Error('Tạo thất bại!');
      }
    } catch (error: any) {
      console.error("API Error:", error);
      let err = "Xảy ra lỗi khi tạo mới";
      if (error.error.errorMessage) {
        err = error.error.errorMessage;
      } 
      this.toastr.error(err); 
    }
    this.loading = false;
  }
    copyToClipboard() {
      if (this.shortUrl) {
        navigator.clipboard.writeText(this.shortUrl)
          .then(() => this.toastr.success('Link đã được sao chép!'))
          .catch(() => this.toastr.error('Không thể sao chép link!'));
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
  }