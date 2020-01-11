import { Component, OnInit, NgZone, AfterViewInit, OnDestroy } from '@angular/core';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { SaldoService, Balance } from '../saldo.service';
import am4lang_nl_NL from '@amcharts/amcharts4/lang/nl_NL';
import { Combined } from '../saldo.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-history-charts',
  templateUrl: './history-charts.component.html',
  styleUrls: ['./history-charts.component.css']
})
export class HistoryChartsComponent implements OnInit, OnDestroy, AfterViewInit {
  subscription: Subscription;
  subscriptionCategory: Subscription;
  category: string;
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

      const balanceSeries = this.createBalanceSubchart(chart);
      this.createIncomeExpensesSubchart(chart);
      this.createCategorySubchart(chart);

      chart.cursor = new am4charts.XYCursor();
      const scrollbarX = new am4charts.XYChartScrollbar();
      scrollbarX.series.push(balanceSeries);
      // scrollbarX.updateWhileMoving = false;
      chart.scrollbarX = scrollbarX;
      this.chart = chart;
      this.chart.numberFormatter.numberFormat = '€ #,###.';

      scrollbarX.events.on('rangechanged', (event) => {
        console.log('Scrollbar!');
        this.saldoService.setDateRange(dateAxis.minZoomed, dateAxis.maxZoomed);
        return event;
      }, this);
      this.subscription = this.saldoService.granularity.subscribe((granularity) => {
        this.mode = granularity;
        this.zone.runOutsideAngular(() => {
          this.populateChart();
        });
      });
      this.subscriptionCategory = this.saldoService.category.subscribe((category) => {
        this.category = category;
        this.zone.runOutsideAngular(() => {
          this.updateCategory();
        });
      });
    });
  }

  private createBalanceSubchart(chart: am4charts.XYChart) {
    const valueAxisBalance = chart.yAxes.push(new am4charts.ValueAxis());

    const interfaceColors = new am4core.InterfaceColorSet();
    valueAxisBalance.renderer.gridContainer.background.fill = interfaceColors.getFor('alternativeBackground');
    valueAxisBalance.renderer.gridContainer.background.fillOpacity = 0.05;

    valueAxisBalance.tooltip.disabled = true;

    const balanceSeries = chart.series.push(new am4charts.LineSeries());
    balanceSeries.dataFields.dateX = 'date';
    balanceSeries.dataFields.valueY = 'balance';
    balanceSeries.fillOpacity = 0.2;
    balanceSeries.tooltipText = '{dateX}: {balance}';
    balanceSeries.yAxis = valueAxisBalance;
    return balanceSeries;
  }

  private createCategorySubchart(chart: am4charts.XYChart) {
    const valueAxisCategory = chart.yAxes.push(new am4charts.ValueAxis());

    const interfaceColors = new am4core.InterfaceColorSet();
    valueAxisCategory.renderer.gridContainer.background.fill = interfaceColors.getFor('alternativeBackground');
    valueAxisCategory.renderer.gridContainer.background.fillOpacity = 0.05;

    valueAxisCategory.marginTop = 50;

    // Create series
    const amount = chart.series.push(new am4charts.ColumnSeries());
    amount.dataFields.valueY = 'category_amount';
    amount.dataFields.dateX = 'date';
    amount.name = 'Amount';
    amount.columns.template.tooltipText = '{dateX}: Amount: {category_amount.formatNumber("€ #,###.")}';
    amount.columns.template.fillOpacity = 0.8;
    amount.clustered = false;
    amount.yAxis = valueAxisCategory;
  }

  private createIncomeExpensesSubchart(chart: am4charts.XYChart) {
    const valueAxisIncomeExpenses = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxisIncomeExpenses.marginTop = 50;

    const interfaceColors = new am4core.InterfaceColorSet();
    valueAxisIncomeExpenses.renderer.gridContainer.background.fill = interfaceColors.getFor('alternativeBackground');
    valueAxisIncomeExpenses.renderer.gridContainer.background.fillOpacity = 0.05;

    // tslint:disable-next-line: max-line-length
    const tooltipText = '{dateX}: \nIncome: {income.formatNumber("€ #,###.")}\nExpenses: {expenses.formatNumber("€ #,###.")}\nProfit: [bold]{profit.formatNumber("€ #,###.")}[/]\nLoss: [bold]{loss.formatNumber("€ #,###.")}[/]';

      // Create series
    const income = chart.series.push(new am4charts.ColumnSeries());
    income.dataFields.valueY = 'income';
    income.dataFields.dateX = 'date';
    income.name = 'Income';
    income.columns.template.properties.fill = chart.colors.getIndex(0).lighten(0.5);
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
    expenses.columns.template.properties.fill = chart.colors.getIndex(0).lighten(0.5);
    expenses.clustered = false;
    expenses.yAxis = valueAxisIncomeExpenses;

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

  private updateCategory() {
    return this.saldoService.fetchCombinedData(this.mode, this.category).subscribe((combined: Combined[]) => {
      if (this.chart.data) {
        combined.forEach((items, index) => {
          this.chart.data[index].category_amount = items.category_amount;
        });
        this.chart.validateData();
      }
    });
  }

  private populateChart() {
    return this.saldoService.fetchCombinedData(this.mode, this.category).subscribe((combined: Combined[]) => {
      const data = [];
      for (const items of combined) {
        data.push({
          date: items.date,
          name: items.date,
          balance: items.balance,
          income: items.income,
          expenses: items.expenses,
          profit: items.profit,
          loss: items.loss,
          category_amount: items.category_amount });
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
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
