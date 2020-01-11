import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';
import { number } from '@amcharts/amcharts4/core';
import { Subject } from 'rxjs';

export interface Balance {
  date: Date;
  amount: number;
}

export interface IncomeExpensesProfitLoss {
  date: Date;
  income: number;
  expenses: number;
  profit: number;
  loss: number;
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

@Injectable()
export class SaldoService {
  dateRange = new Subject<{min: number, max: number}>();
  granularity = new Subject<string>();
  category = new Subject<string>();

  constructor(private httpClient: HttpClient) {}

  fetchBalances(mode: string) {
    const url = 'http://localhost:5002/balance';
    const params = new HttpParams().set('mode', mode);
    return this.httpClient.get<Balance[]>(url, {params} );
  }

  fetchIncomeExpensesProfitLoss(mode: string) {
    const url = 'http://localhost:5002/income-expenses';
    const params = new HttpParams().set('mode', mode);
    return this.httpClient.get<IncomeExpensesProfitLoss[]>(url, {params} );
  }

  fetchCombinedData(mode: string) {
    const url = 'http://localhost:5002/combined';
    const params = new HttpParams().set('mode', mode);
    return this.httpClient.get<Combined[]>(url, {params} );
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
}
