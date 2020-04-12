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
  private categories: Observable<Category[]>;
  constructor(private store: Store<AppState>) { }

  ngOnInit() {
    this.categories = this.store.select(state => state.domain.categories);
  }

  onLoadTransactions() {
    this.store.dispatch(new TransactionsActions.LoadCategories());
    this.store.dispatch(new TransactionsActions.LoadTransactions({start: new Date('1970-01-01'), end: new Date()}));
  }

  onCategory(categoryId: string) {
    console.log(categoryId);
    this.store.dispatch(new TransactionsActions.SelectCategory(categoryId));
  }
}
