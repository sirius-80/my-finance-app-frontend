import { Component, OnInit, OnDestroy, AfterViewInit, NgZone } from '@angular/core';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import am4lang_nl_NL from '@amcharts/amcharts4/lang/nl_NL';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.reducers';
import * as TransactionsActions from '../store/transactions.actions';
import { Subscription } from 'rxjs';
import { Category } from 'src/app/domain/category/category';

@Component({
  selector: 'app-category-transactions',
  templateUrl: './category-transactions.component.html',
  styleUrls: ['./category-transactions.component.css']
})
export class CategoryTransactionsComponent implements OnInit, OnDestroy, AfterViewInit {
  private chart: am4charts.XYChart;
  private category: Category;
  private subscription: Subscription;
  private updateTableTimeout;

  constructor(private zone: NgZone,
              private store: Store<AppState>) { }

  ngOnInit() {
    am4core.useTheme(am4themes_animated);
  }

  ngAfterViewInit() {
    this.zone.runOutsideAngular(() => {
      const chart = am4core.create('category-transactions-div', am4charts.XYChart);
      chart.language.locale = am4lang_nl_NL;

      const dateAxis = chart.xAxes.push(new am4charts.DateAxis());

      const amountSeries = this.createCategorySeries(chart);

      this.chart = chart;

      const scrollbarX = new am4charts.XYChartScrollbar();
      scrollbarX.series.push(amountSeries);
      chart.scrollbarX = scrollbarX;
      chart.plotContainer.visible = false;
      chart.leftAxesContainer.visible = false;
      chart.rightAxesContainer.visible = false;
      chart.bottomAxesContainer.visible = false;
      chart.padding(0, 15, 0, 15);

      dateAxis.events.on('selectionextremeschanged', (event) => {
        if (this.updateTableTimeout) {
          clearTimeout(this.updateTableTimeout);
        }
        this.updateTableTimeout = setTimeout(() => {
          this.updateTableTimeout = null;
          this.store.dispatch(new TransactionsActions.SelectPeriod(
            {start: new Date(event.target.minZoomed), end: new Date(event.target.maxZoomed)}));
        }, 100);
        return event;
      });
      this.populateChart();
    });
  }

  private createCategorySeries(chart: am4charts.XYChart) {
    const valueAxisCategory = chart.yAxes.push(new am4charts.ValueAxis());

    // Create series
    const amount = chart.series.push(new am4charts.ColumnSeries());
    amount.dataFields.valueY = 'amount';
    amount.dataFields.dateX = 'date';

    return amount;
  }

  private populateChart() {
    this.subscription = this.store.select(state => state.transactions.barChartData).subscribe(
      (currentCategoryData) => {
        // console.log('Update category bar chart', currentCategoryData);
        this.chart.data = currentCategoryData;
      });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }
    this.zone.runOutsideAngular(() => {
      if (this.chart) {
        this.chart.dispose();
        this.chart = null;
      }
    });
  }
}
