import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.reducers';
import { Transaction } from '../store/transactions.reducers';
import { Observable } from 'rxjs';
import { Category } from 'src/app/accounts-rx/accounts.model';

@Component({
  selector: 'app-transactions-table',
  templateUrl: './transactions-table.component.html',
  styleUrls: ['./transactions-table.component.css']
})
export class TransactionsTableComponent implements OnInit {
  transactions: Observable<Transaction[]>;
  categories: Observable<Category[]>;
  constructor(private store: Store<AppState>) { }

  ngOnInit() {
    this.transactions = this.store.select(state => state.transactions.transactions);
    this.categories = this.store.select(state => state.accounts.categories);
  }

  onSetCategory(transaction: Transaction, categoryId: string) {
    console.log('Setting category of transaction ', transaction, ' to ', categoryId);

  }
}
