import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { UpdateModalComponent } from '../Modal/UpdateModal/update-modal.component';
import { DeleteModalComponent } from '../Modal/DeleteModal/delete-modal.component';
import { CreateModalComponent } from '../Modal/CreateModal/create-modal.component';
// import { ShortUrlService } from '';
// import { DownloadService } from '';
// import { DomainService } from '';
// import * as dayjs from 'dayjs';

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
        // private shortUrlService: ShortUrlService,
        // private downloadService: DownloadService,
        // private domainService: DomainService
    ) { }

    columns = [
        { title: 'STT', width: '40px' },
        { title: 'Dự án', key: 'projectName', width: '100px' },
        { title: 'Tên đường dẫn', key: 'alias', width: '120px' },
        { title: 'URL gốc', key: 'originalUrl', width: '560px' },
        { title: 'Shortlink', key: 'shortLink', width: '280px' },
        { title: 'Ngày tạo', key: 'createAt', width: '130px' },
        { title: 'Người chỉnh sửa', key: 'userName', width: '130px' },
        { title: 'Chức Năng', width: '90px' }
    ];

    ngOnInit() {
        this.checkAuth();
        this.fetchData();
        // this.fetchDomains();
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
            // Dữ liệu mẫu cơ bản
            const baseData: ShortLink = {
                id: "1",
                STT: 1,
                projectName: "Project A",
                alias: "link",
                originalUrl: "https://example.com/page",
                shortLink: "https://short.ly/abc",
                createAt: "2025-03-30 10:00",
                userName: "user1"
            };

            // Tạo 20 hàng dựa trên dữ liệu mẫu
            const mockData: ShortLink[] = Array.from({ length: 10 }, (_, index) => ({
                ...baseData,
                id: (index + 1).toString(), // ID tăng dần
                STT: index + 1, // STT từ 1 đến 20
                alias: `link${index + 1}`, // Alias khác nhau cho mỗi hàng
                originalUrl: `https://example.com/page${index + 1}`, // URL gốc khác nhau
                shortLink: `https://short.ly/abc${index + 1}` // Shortlink khác nhau
            }));

            // Gán mock data
            this.data = mockData;
            this.filterData();
            console.log('Filtered Data:', this.filteredData);
        } catch (error) {
            console.error('Failed to process data:', error);
            alert('Failed to load short links');
        }
        this.isLoading = false;
    }

    //   async fetchData() {
    //     this.isLoading = true;
    //     try {
    //     //   const urls = await this.shortUrlService.getAllLink().toPromise();
    //     //   const formattedData = urls.$values.map((url: any, index: number) => ({
    //     //     ...url,
    //     //     key: url.id,
    //     //     STT: index + 1
    //     //   }));
    //     //   this.data = formattedData;
    //       this.filterData();
    //     } catch (error) {
    //       console.error('Failed to fetch data:', error);
    //       alert('Failed to load short links');
    //     }
    //     this.isLoading = false;
    //   }

    //   async fetchDomains() {
    //     const response = await this.domainService.getAll().toPromise();
    //     this.domains = response.$values.map((domain: any) => domain.name);
    //   }

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
    }

    openDeleteModal(record: ShortLink) {
        this.recordToDelete = record;
        this.showDeleteModal = true;
    }

    handleDelete() {
        if (!this.recordToDelete) return;
        this.isLoading = true;
        try {
        //   await this.shortUrlService.deleteShortLink(this.recordToDelete.id).toPromise();
          alert('Deleted successfully!');
          this.fetchData();
          this.showDeleteModal = false;
        } catch (error) {
          alert('Delete failed!');
        }
        this.isLoading = false;
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

 exportExcel() {
        this.isLoading = true;
        try {
        //   const blob = await this.downloadService.download().toPromise();
        //   const url = window.URL.createObjectURL(blob);
        //   const a = document.createElement('a');
        //   a.href = url;
        //   a.download = 'Excel.xlsx';
        //   document.body.appendChild(a);
        //   a.click();
        //   a.remove();
        //   window.URL.revokeObjectURL(url);
        } catch (error) {
          alert('Export failed!');
        }
        this.isLoading = false;
      }

      formatDate(date: string): string {
        //return date ? dayjs(date).format('HH:mm DD/MM/YYYY') : 'N/A';
return date;    
      }

    handleUpdate() {
        this.fetchData();
        this.closeModal();
    }

    handleCreate() {
        this.fetchData();
        this.closeModal();
    }
}