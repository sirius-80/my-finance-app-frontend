import { Component, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource, MatTable} from '@angular/material/table';

import { AppState } from 'src/app/store/app.reducers';
import { Observable } from 'rxjs';
import * as TransactionsActions from '../store/transactions.actions';
import { Category } from 'src/app/domain/category/category';

export interface TableTransaction {
  id: string;
  date: Date;
  account: string;
  amount: number;
  name: string;
  category: Category;
  category_name: string;
  description: string;
  counterAccount: string;
  internal: boolean;
}

@Component({
  selector: 'app-transactions-table',
  templateUrl: './transactions-table.component.html',
  styleUrls: ['./transactions-table.component.css']
})
export class TransactionsTableComponent implements OnInit {
  categories: Observable<Category[]>;

  displayedColumns: string[] = ['date', 'account', 'amount', 'name', 'description', 'category', 'counterAccount', 'internal'];
  dataSource = new MatTableDataSource<TableTransaction>();

  @ViewChild(MatPaginator, {static: true})
  paginator: MatPaginator;
  @ViewChild(MatSort, {static: true})
  sort: MatSort;
  @ViewChild(MatTable, {static: true})
  table: MatTable<TableTransaction>;

  constructor(private store: Store<AppState>) { }

  ngOnInit() {
    this.categories = this.store.select(state => state.domain.categories);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    // Assign the data to the data source for the table to render
    this.store.select(state => state.transactions.selectedTransactions).subscribe(
      transactions => {
        console.log('Updating transactions', transactions.length);
        const tableTransations = [];
        // console.log(transactions);

        for (const t of transactions) {
          tableTransations.push({
            id: t.id,
            date: t.date,
            account: t.account,
            amount: t.amount,
            name: t.name,
            category: t.category,
            category_name: t.category && t.category.name || null,
            description: t.description,
            counterAccount: t.counterAccount,
            internal: t.internal
          });
        }
        this.dataSource.data = tableTransations;
        console.log('Done updating transaction table');
      }
    );
    this.dataSource.sort.sort({id: 'date', start: 'asc', disableClear: false});
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onSetCategory(transactionId: string, categoryId: string) {
    console.log('Setting category of transaction ', transactionId, ' to ', categoryId);
    this.store.dispatch(new TransactionsActions.UpdateTransactionCategory({transactionId, categoryId}));
  }
}
