import { Component, OnInit, Injectable } from '@angular/core';
import { SaldoService } from './saldo.service';
import { Category } from './accounts.model';

@Component({
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.css'],
  providers: [SaldoService],
})
@Injectable()
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
