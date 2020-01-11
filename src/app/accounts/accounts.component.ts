import { Component, OnInit } from '@angular/core';
import { SaldoService, Category } from './saldo.service';

@Component({
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.css'],
  providers: [SaldoService],
})
export class AccountsComponent implements OnInit {
  categories: Category[];
  constructor(private saldoService: SaldoService) {}

  ngOnInit() {
    this.saldoService.fetchCategories()
      .subscribe((categories) => {
        this.categories = categories;
        // console.log(categories);
        if (categories.length) {
          this.onCategory(this.categories[0].id);
        }
      });
  }

  onGranularity(granularity: string) {
    this.saldoService.granularity.next(granularity);
  }

  onCategory(category) {
    // console.log(category);

    this.saldoService.setCategory(category);
  }

}
