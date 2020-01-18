import { Component, OnInit, NgZone, AfterViewInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import am4lang_nl_NL from '@amcharts/amcharts4/lang/nl_NL';

import { AppState } from '../../store/app.reducers';
import { Category } from '../accounts.model';
import * as AccountsActions from '../store/accounts.actions';


@Component({
  selector: 'app-category-bar-chart',
  templateUrl: './category-bar-chart.component.html',
  styleUrls: ['./category-bar-chart.component.css']
})
export class CategoryBarChartComponent implements OnInit, AfterViewInit, OnDestroy {
  private chart: am4charts.XYChart;
  private category: Category;

  constructor(private zone: NgZone,
              private store: Store<AppState>) { }

  ngOnInit() {
    am4core.useTheme(am4themes_animated);
  }

  ngAfterViewInit() {
    this.zone.runOutsideAngular(() => {
      const chart = am4core.create('category-bar-chart-div', am4charts.XYChart);
      chart.leftAxesContainer.layout = 'vertical';
      chart.language.locale = am4lang_nl_NL;
      chart.zoomOutButton.disabled = true;

      const dateAxis = chart.xAxes.push(new am4charts.DateAxis());
      dateAxis.renderer.grid.template.location = 0;

      this.createCategorySeries(chart);

      this.chart = chart;
      this.chart.numberFormatter.numberFormat = '€ #,###.';
      chart.cursor = new am4charts.XYCursor();
      chart.cursor.lineY.disabled = true;

      this.populateChart();

      this.store.select(state => state.accounts.period).subscribe(period => {
        dateAxis.zoomToDates(period.start, period.end);
      });

      chart.cursor.behavior = 'selectX';
      chart.cursor.events.on('selectended', ev => {
        const range = ev.target.xRange;
        if (range) {
          const axis = ev.target.chart.xAxes.getIndex(0);
          const start = axis.getSeriesDataItem(chart.series.getIndex(0), axis.toAxisPosition(range.start)).dateX;
          const end = axis.getSeriesDataItem(chart.series.getIndex(0), axis.toAxisPosition(range.end)).dateX;
          console.log('Selected from ', start, ' to ', end);
          this.store.dispatch(new AccountsActions.SelectPeriod({start, end}));
        } else {
          this.store.dispatch(new AccountsActions.SelectPeriod(null));
        }
      });
    });
  }

  private createCategorySeries(chart: am4charts.XYChart) {
    const valueAxisCategory = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxisCategory.cursorTooltipEnabled = false;

    const interfaceColors = new am4core.InterfaceColorSet();
    valueAxisCategory.renderer.gridContainer.background.fill = interfaceColors.getFor('alternativeBackground');
    valueAxisCategory.renderer.gridContainer.background.fillOpacity = 0.05;

    valueAxisCategory.marginTop = 50;

    // Create series
    const amount = chart.series.push(new am4charts.ColumnSeries());
    amount.dataFields.valueY = 'amount';
    amount.dataFields.dateX = 'date';
    amount.name = 'Amount';
    amount.columns.template.tooltipText = '{dateX}: Amount: {amount.formatNumber("€ #,###.")}';
    amount.columns.template.fillOpacity = 0.8;
    amount.clustered = false;
    amount.yAxis = valueAxisCategory;
  }

  private populateChart() {
    this.store.select(state => state.accounts.currentCategoryData).subscribe(
      (currentCategoryData) => {
        console.log('Update category bar chart', currentCategoryData);
        this.chart.data = currentCategoryData;
      });
  }

  ngOnDestroy(): void {
    this.zone.runOutsideAngular(() => {
      if (this.chart) {
        this.chart.dispose();
        this.chart = null;
      }
    });
  }
}
