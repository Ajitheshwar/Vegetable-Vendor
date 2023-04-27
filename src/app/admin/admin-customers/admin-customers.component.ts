import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminUserDetails } from 'src/models/user';
import { AdminDataService } from '../admin-data.service';

@Component({
  selector: 'app-admin-customers',
  templateUrl: './admin-customers.component.html',
  styleUrls: ['./admin-customers.component.css'],
})
export class AdminCustomersComponent implements OnInit {
  constructor(private data: AdminDataService, private router : Router) {}

  ngOnInit(): void {
    this.page = 0;
    this.loadCustomersData(1);
  }

  loadedCustomersData: boolean = false;
  page: number = 1;
  customers: AdminUserDetails[] = [];
  maxPages: number = 0;
  searchBy: string = 'name';
  search: string = '';
  timerId: any = undefined;
  getCustomersOfSearch: boolean = false;

  loadCustomersData(page: number) {
    this.page = page;
    if (this.getCustomersOfSearch) {
      this.getCustomersBySearch();
    } else {
      this.getAllCustomers();
    }
  }

  getAllCustomers() {
    this.data.getCustomers(this.page).subscribe({
      next: (result) => {
        this.customers = result.data;
        this.maxPages = result.maxPages;
        this.loadedCustomersData = true;
      },
      error: console.log,
    });
  }

  getCustomersBySearch() {
    if (!this.getCustomersOfSearch) this.page = 1;
    this.getCustomersOfSearch = true;
    if (this.timerId) clearTimeout(this.timerId);
    this.timerId = setTimeout(() => {
      this.applySearchFilter();
      this.timerId = undefined;
    }, 1000);
  }

  applySearchFilter() {
    console.log(this.search);
    this.data
      .getCustomersBySearch(this.searchBy, this.search, this.page)
      .subscribe({
        next: (result) => {
          console.log(result);
          this.maxPages = result.maxPages;
          this.customers = result.data;
        },
        error: console.log,
      });
  }

  reset() {
    this.getCustomersOfSearch = false;
    this.loadCustomersData(1);
  }

  navigateToSinglePage(id : string){
    console.log(id)
    this.router.navigateByUrl("/admin/customer/"+id)
  }
}
