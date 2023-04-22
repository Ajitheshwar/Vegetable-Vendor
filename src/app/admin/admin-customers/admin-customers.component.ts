import { Component, OnInit } from '@angular/core';
import { AdminDataService } from '../admin-data.service';

@Component({
  selector: 'app-admin-customers',
  templateUrl: './admin-customers.component.html',
  styleUrls: ['./admin-customers.component.css'],
})
export class AdminCustomersComponent implements OnInit {
  constructor(private data: AdminDataService) {}

  ngOnInit(): void {
    this.page = 0;
    this.loadCustomersData(1)
  }

  loadedCustomersData : boolean = false;
  page: number = 1;
  customers: any[] = [];
  maxPages : number = 0;

  loadCustomersData(page : number){
    this.page = page
    this.data.getCustomers(this.page).subscribe({
      next: (result) => {
        this.customers = result.data;
        this.maxPages = result.maxPages
        this.loadedCustomersData = true
      },
    });
  }
}
