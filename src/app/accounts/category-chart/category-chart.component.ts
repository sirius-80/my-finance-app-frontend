import { Component, OnInit, AfterViewInit, OnDestroy, NgZone } from '@angular/core';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { SaldoService, Balance } from '../saldo.service';
import am4lang_nl_NL from '@amcharts/amcharts4/lang/nl_NL';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-category-chart',
  templateUrl: './category-chart.component.html',
  styleUrls: ['./category-chart.component.css']
})
export class CategoryChartComponent implements OnInit, AfterViewInit, OnDestroy {
  mode = 'monthly';
  category: string;
  subscription: Subscription;
  private chart: am4charts.XYChart;

  constructor(private zone: NgZone,
              private saldoService: SaldoService) { }

  ngOnInit() {
    this.subscription = this.saldoService.category.subscribe((category) => {
      this.category = category;
    });
  }

  ngAfterViewInit(): void {
    this.zone.runOutsideAngular(() => {
      const chart = am4core.create(
        'chart-category-div',
        am4charts.XYChart
      );
      chart.language.locale = am4lang_nl_NL;
      chart.numberFormatter.numberFormat = '€ #,###.';

      chart.paddingRight = 20;
      const title = chart.titles.create();
      title.text = 'Category';

      // fetch data
      this.populateChart();

      const dateAxis = chart.xAxes.push(new am4charts.DateAxis());
      dateAxis.renderer.grid.template.location = 0;
      dateAxis.renderer.labels.template.rotation = 90;
      dateAxis.renderer.minGridDistance = 10;

      const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis.renderer.minWidth = 100;

      // Create series
      const amount = chart.series.push(new am4charts.ColumnSeries());
      amount.dataFields.valueY = 'amount';
      amount.dataFields.dateX = 'date';
      amount.name = 'Amount';
      amount.columns.template.tooltipText = '{dateX}: Amount: {amount.formatNumber("€ #,###.")}';
      amount.columns.template.fillOpacity = 0.8;
      amount.clustered = false;

      // Create active state
      let activeState = amount.columns.template.states.create('active');
      activeState.properties.fill = chart.colors.getIndex(4);

      const columnTemplate = amount.columns.template;
      // columnTemplate.strokeWidth = 2;
      columnTemplate.strokeOpacity = 1;
      this.chart = chart;

      this.saldoService.dateRange.subscribe((range: {min: number, max: number}) => {
        // console.log('Update range!', range);
        dateAxis.min = range.min;
        dateAxis.max = range.max;
        dateAxis.validateDataRange();
        this.chart.validate();
      });
      this.saldoService.granularity.subscribe((granularity) => {
        this.mode = granularity;
        this.zone.runOutsideAngular(() => {
          this.populateChart();
        });
      });
      this.subscription.unsubscribe();
      this.subscription = this.saldoService.category.subscribe((category) => {
        this.category = category;
        this.zone.runOutsideAngular(() => {
          this.populateChart();
        });
      });
      amount.columns.template.events.on('hit', (event) => {
        event.target.isActive = !event.target.isActive;
        if (event.target.isActive) {
          for (const column of amount.columns) {
            if (column !== event.target) {
              column.isActive = false;
            }
          }
        }
      });
    });
  }

  private populateChart() {
    return this.saldoService.fetchCategoryData(this.mode, this.category).subscribe((balances: Balance[]) => {
      const data = [];
      for (const balance of balances) {
        data.push({ date: balance.date, name: this.category, amount: balance.amount });
      }
      // console.log('Populate category chart ', this.category, data);

      this.chart.data = data;
      this.chart.validate();
    });
  }

  ngOnDestroy(): void {
    this.zone.runOutsideAngular(() => {
      if (this.chart) {
        this.chart.dispose();
        this.chart = null;
      }
    });
    this.subscription.unsubscribe();
  }
}
