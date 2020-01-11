import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';
import { number } from '@amcharts/amcharts4/core';
import { Subject } from 'rxjs';

export interface Balance {
  date: Date;
  amount: number;
}

export interface Combined {
  date: Date;
  balance: number;
  income: number;
  expenses: number;
  profit: number;
  loss: number;
}

export interface Category {
  id: string;
  name: string;
}

export interface CategoryData {
  name: string;
  value: number;
  children: CategoryData[];
}

@Injectable()
export class SaldoService {
  dateRangeTimout = null;
  dateRange = new Subject<{min: number, max: number}>();
  granularity = new Subject<string>();
  category = new Subject<string>();

  constructor(private httpClient: HttpClient) {}

  fetchCombinedData(mode: string) {
    const url = 'http://localhost:5002/combined';
    const params = new HttpParams().set('mode', mode);
    return this.httpClient.get<Combined[]>(url, {params} );
  }

  fetchCombinedCategories(parentCategoryId: string, start: number, end: number) {
    const params = new HttpParams().append('start', '' + start).append('end', '' + end);
    const url = 'http://localhost:5002/combined_categories/' + parentCategoryId;
    return this.httpClient.get<CategoryData[]>(url, {params});
  }

  fetchCategoryData(mode: string, category: string) {
    const url = 'http://localhost:5002/categories/' + category;
    const params = new HttpParams().set('mode', mode);
    return this.httpClient.get<Balance[]>(url, {params} );
  }

  fetchCategories() {
    const url = 'http://localhost:5002/categories';
    return this.httpClient.get<Category[]>(url);
  }

  setGranularity(granularity: string) {
    this.granularity.next(granularity);
  }

  setCategory(category: string) {
    this.category.next(category);
  }

  setDateRange(min: number, max: number) {
    if (this.dateRangeTimout) {
      clearTimeout(this.dateRangeTimout);
    }
    this.dateRangeTimout = setTimeout(() => {
      this.dateRange.next({min, max});
    }, 400);
  }
}
