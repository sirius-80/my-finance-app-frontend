import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';


import { AppState } from '../store/app.reducers';
import * as TransactionsActions from './store/transactions.actions';
import { Observable } from 'rxjs';
import { Category } from '../domain/category/category';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent implements OnInit {
  public categories: Observable<Category[]>;
  public selectedCategory: Observable<Category>;
  constructor(private store: Store<AppState>) { }

  ngOnInit() {
    this.categories = this.store.select(state => state.domain.categories);
    this.selectedCategory = this.store.select(state => state.transactions.selectedCategory);
  }

  onLoadTransactions() {
    this.store.dispatch(new TransactionsActions.LoadTransactions({start: new Date(0), end: new Date()}));
  }

  onCategory(categoryId: string) {
    console.log('Selecting category with id', categoryId);
    this.store.dispatch(new TransactionsActions.SelectCategoryById(categoryId));
  }
}
