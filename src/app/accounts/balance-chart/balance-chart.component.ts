import { Component, OnInit, NgZone, AfterViewInit, OnDestroy } from '@angular/core';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { SaldoService, Balance } from '../saldo.service';
import am4lang_nl_NL from '@amcharts/amcharts4/lang/nl_NL';

@Component({
  selector: 'app-balance-chart',
  templateUrl: './balance-chart.component.html',
  styleUrls: ['./balance-chart.component.css'],
})
export class BalanceChartComponent implements OnInit, AfterViewInit, OnDestroy {
  mode = 'monthly';
  private chart: am4charts.XYChart;

  constructor(private zone: NgZone,
              private saldoService: SaldoService) { }

  ngOnInit() {
    am4core.useTheme(am4themes_animated);
  }

  ngAfterViewInit(): void {
    this.zone.runOutsideAngular(() => {
      const chart = am4core.create('chartdiv', am4charts.XYChart);
      chart.language.locale = am4lang_nl_NL;

      chart.paddingRight = 20;
      const title = chart.titles.create();
      title.text = 'Account balance';

      // fetch data
      this.populateChart();

      const dateAxis = chart.xAxes.push(new am4charts.DateAxis());
      dateAxis.renderer.grid.template.location = 0;
      dateAxis.events.on('datarangechanged', (event) => {
        this.saldoService.dateRange.next({min: event.target.minZoomed, max: event.target.maxZoomed});
        console.log('Data-range changed: ', event);
      });

      const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis.tooltip.disabled = true;
      valueAxis.renderer.minWidth = 100;

      const series = chart.series.push(new am4charts.LineSeries());
      series.dataFields.dateX = 'date';
      series.dataFields.valueY = 'value';
      series.strokeWidth = 2;
      series.fillOpacity = 0.5;

      series.tooltipText = '{valueY.value}';
      chart.cursor = new am4charts.XYCursor();

      const scrollbarX = new am4charts.XYChartScrollbar();
      scrollbarX.series.push(series);
      chart.scrollbarX = scrollbarX;
      this.chart = chart;
      this.chart.numberFormatter.numberFormat = "€ #,###.";


      scrollbarX.events.on('rangechanged', (event) => {
        this.saldoService.dateRange.next({min: dateAxis.minZoomed, max: dateAxis.maxZoomed});
      });
      this.saldoService.granularity.subscribe((granularity) => {
        this.mode = granularity;
        this.zone.runOutsideAngular(() => {
          this.populateChart();
        });
      });
    });
  }

  private populateChart() {
    return this.saldoService.fetchBalances(this.mode).subscribe((balances: Balance[]) => {
      const data = [];
      for (const balance of balances) {
        data.push({ date: balance.date, name: balance.date, value: balance.amount });
      }
      this.chart.data = data;
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

