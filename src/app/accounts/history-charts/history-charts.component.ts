import { Component, OnInit, NgZone, AfterViewInit, OnDestroy } from '@angular/core';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { SaldoService, Balance } from '../saldo.service';
import am4lang_nl_NL from '@amcharts/amcharts4/lang/nl_NL';
import { Combined } from '../saldo.service';

@Component({
  selector: 'app-history-charts',
  templateUrl: './history-charts.component.html',
  styleUrls: ['./history-charts.component.css']
})
export class HistoryChartsComponent implements OnInit, OnDestroy, AfterViewInit {
  mode = 'monthly';
  private chart: am4charts.XYChart;
  constructor(private zone: NgZone,
              private saldoService: SaldoService) { }

  ngOnInit() {
    am4core.useTheme(am4themes_animated);
  }

  ngAfterViewInit(): void {
    this.zone.runOutsideAngular(() => {
      const chart = am4core.create('history-chart-div', am4charts.XYChart);
      chart.leftAxesContainer.layout = 'vertical';
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

      const balanceSeries = this.createBalanceSubchart(chart);
      this.createIncomeExpensesSubchart(chart);

      chart.cursor = new am4charts.XYCursor();
      const scrollbarX = new am4charts.XYChartScrollbar();
      scrollbarX.series.push(balanceSeries);
      chart.scrollbarX = scrollbarX;
      this.chart = chart;
      this.chart.numberFormatter.numberFormat = '€ #,###.';

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

  private createBalanceSubchart(chart: am4charts.XYChart) {
    const valueAxisBalance = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxisBalance.tooltip.disabled = true;

    const balanceSeries = chart.series.push(new am4charts.LineSeries());
    balanceSeries.dataFields.dateX = 'date';
    balanceSeries.dataFields.valueY = 'balance';
    balanceSeries.fillOpacity = 0.2;
    balanceSeries.tooltipText = '{dateX}: {balance}';
    balanceSeries.yAxis = valueAxisBalance;
    return balanceSeries;
  }

  private createIncomeExpensesSubchart(chart: am4charts.XYChart) {
    const valueAxisIncomeExpenses = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxisIncomeExpenses.marginTop = 50;
    // tslint:disable-next-line: max-line-length
    const tooltipText = '{dateX}: \nIncome: {income.formatNumber("€ #,###.")}\nExpenses: {expenses.formatNumber("€ #,###.")}\nProfit: [bold]{profit.formatNumber("€ #,###.")}[/]\nLoss: [bold]{loss.formatNumber("€ #,###.")}[/]';

      // Create series
    const income = chart.series.push(new am4charts.ColumnSeries());
    income.dataFields.valueY = 'income';
    income.dataFields.dateX = 'date';
    income.name = 'Income';
    income.columns.template.fill = am4core.color('blue').lighten(.9);
    income.columns.template.tooltipText = tooltipText;
    income.columns.template.fillOpacity = 0.8;
    income.clustered = false;
    income.yAxis = valueAxisIncomeExpenses;

    const expenses = chart.series.push(new am4charts.ColumnSeries());
    expenses.dataFields.valueY = 'expenses';
    expenses.dataFields.dateX = 'date';
    expenses.name = 'Expenses';
    // expenses.columns.template.tooltipText = tooltipText;
    expenses.columns.template.fillOpacity = 0.8;
    expenses.columns.template.fill = am4core.color('blue').lighten(.9);
    expenses.clustered = false;
    expenses.yAxis = valueAxisIncomeExpenses;
    // expenses.columns.template.fill = income.columns.template.fill;
    // expenses.columns.template.fillModifier = income.columns.template.fillModifier;

    const profit = chart.series.push(new am4charts.ColumnSeries());
    profit.dataFields.valueY = 'profit';
    profit.dataFields.dateX = 'date';
    profit.name = 'Profit';
    // profit.columns.template.tooltipText = tooltipText;
    profit.columns.template.fillOpacity = 0.8;
    profit.columns.template.fill = am4core.color('lime');
    profit.clustered = false;
    profit.yAxis = valueAxisIncomeExpenses;

    const loss = chart.series.push(new am4charts.ColumnSeries());
    loss.dataFields.valueY = 'loss';
    loss.dataFields.dateX = 'date';
    loss.name = 'Loss';
    // loss.columns.template.tooltipText = tooltipText;
    loss.columns.template.fillOpacity = 0.8;
    loss.columns.template.fill = am4core.color('tomato');
    loss.clustered = false;
    loss.yAxis = valueAxisIncomeExpenses;
  }

  private populateChart() {
    return this.saldoService.fetchCombinedData(this.mode).subscribe((combined: Combined[]) => {
      const data = [];
      for (const items of combined) {
        data.push({
          date: items.date,
          name: items.date,
          balance: items.balance,
          income: items.income,
          expenses: items.expenses,
          profit: items.profit,
          loss: items.loss });
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
