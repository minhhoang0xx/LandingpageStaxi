import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { UpdateModalComponent } from '../Modal/UpdateModal/update-modal.component';
import { DeleteModalComponent } from '../Modal/DeleteModal/delete-modal.component';
import { CreateModalComponent } from '../Modal/CreateModal/create-modal.component';
import { ShortURLService } from '../../../services/ShortURLService';
import { DownloadService } from '../../../services/DownloadService';
import { ToastrService } from 'ngx-toastr';
import { DomainService } from '../../../services/DomainService';

import dayjs from 'dayjs'; 

interface ShortLink {
  id: string;
  STT: number;
  projectName: string;
  alias: string;
  originalUrl: string;
  shortLink: string;
  createAt: string;
  userName: string;
}

@Component({
  selector: 'app-list-short-url',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    UpdateModalComponent,
    DeleteModalComponent,
    CreateModalComponent
  ],
  templateUrl: './list-short-url.component.html',
  styleUrls: ['./list-short-url.component.css']
})
export class ListShortLinkComponent implements OnInit {
  data: ShortLink[] = [];
  filteredData: ShortLink[] = [];
  domains: string[] = [];
  isLoading = false;
  searchText = '';
  selectedProject = 'all';

  // Modal states
  showUpdateModal = false;
  showDeleteModal = false;
  showCreateModal = false;
  selectedRecord: ShortLink | null = null;
  recordToDelete: ShortLink | null = null;

  constructor(
    private router: Router,
    private shortURLService: ShortURLService,
    private downloadService: DownloadService,
    private domainService: DomainService,
    private toastr: ToastrService
  ) { }

  columns = [
    { title: 'STT', width: '40px' },
    { title: 'Dự án', key: 'projectName' },
    { title: 'Tên đường dẫn', key: 'alias' },
    { title: 'URL gốc', key: 'originalUrl' },
    { title: 'Shortlink', key: 'shortLink' },
    { title: 'Ngày tạo', key: 'createAt' },
    { title: 'Người chỉnh sửa', key: 'userName' },
    { title: 'Chức Năng', width: '90px' }
  ];

  ngOnInit() {
    this.checkAuth();
    this.fetchData();
    this.fetchDomains();
  }

  checkAuth() {
      const token = localStorage.getItem('token');
      if (!token) {
          this.router.navigate(['/login']);
      }
  }


  async fetchData() {
    this.isLoading = true;
    try {
      const urls = await firstValueFrom(this.shortURLService.getAllLinks());
      const formattedData = urls.$values.map((url: any, index: number) => ({
        ...url,
        key: url.id,
        STT: index + 1
      }));
      this.data = formattedData;
      this.filterData();
    } catch (error) {
      console.error('Failed to fetch data:', error);
      this.toastr.error('Failed to load short links');
    }
    this.isLoading = false;
  }

  async fetchDomains() {
    try {
      const response = await firstValueFrom(this.domainService.getAll());
      console.log("domain", response)
      this.domains = response.$values.map((domain: any) => domain.name);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      this.toastr.error('Failed to load domain');
    }

  }

  filterData() {
    let result = [...this.data];
    if (this.selectedProject !== 'all') {
      result = result.filter(item =>
        item.projectName?.toLowerCase() === this.selectedProject.toLowerCase()
      );
    }
    if (this.searchText) {
      result = result.filter(item =>
        item.alias?.toLowerCase().includes(this.searchText.toLowerCase())
      );
    }
    this.filteredData = result;
  }

  openUpdateModal(record: ShortLink) {
    this.selectedRecord = record;
    this.showUpdateModal = true;

    console.log("record", record)
  }

  openDeleteModal(record: ShortLink) {
    this.recordToDelete = record;
    this.showDeleteModal = true;
  }



  openCreateModal() {
    this.showCreateModal = true;
  }

  closeModal() {
    this.showUpdateModal = false;
    this.showDeleteModal = false;
    this.showCreateModal = false;
    this.selectedRecord = null;
    this.recordToDelete = null;
  }

  onSearch() {
    this.filterData();
  }

 async exportExcel() {
    this.isLoading = true;
    try {
        const blob = await firstValueFrom(this.downloadService.download());
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Excel.xlsx';
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
    } catch (error) {
      this.toastr.error('Export failed!');
    }
    this.isLoading = false;
  }

  formatDate(date: string): string {
    return date ? dayjs(date).format('HH:mm DD/MM/YYYY') : 'N/A';
    return date;
  }

  handleDelete() {
    this.fetchData();
    this.closeModal();
  }
  handleAction(){
    this.fetchData();
  }
}