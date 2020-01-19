import { Component, OnInit, NgZone, AfterViewInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import am4lang_nl_NL from '@amcharts/amcharts4/lang/nl_NL';

import { AppState } from '../../store/app.reducers';
import * as AccountsActions from '../store/accounts.actions';


@Component({
  selector: 'app-history-charts-rx',
  templateUrl: './history-charts-rx.component.html',
  styleUrls: ['./history-charts-rx.component.css']
})
export class HistoryChartsRxComponent implements OnInit, OnDestroy, AfterViewInit {
  category: string;
  mode = 'monthly';
  private chart: am4charts.XYChart;

  constructor(private zone: NgZone,
              private store: Store<AppState>) { }

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

      const dateAxis = chart.xAxes.push(new am4charts.DateAxis());
      dateAxis.renderer.grid.template.location = 0;

      const balanceSeries = this.createBalanceSubchart(chart);
      this.createIncomeExpensesSubchart(chart);

      chart.cursor = new am4charts.XYCursor();
      chart.cursor.lineY.disabled = true;
      const scrollbarX = new am4charts.XYChartScrollbar();
      scrollbarX.series.push(balanceSeries);
      chart.scrollbarX = scrollbarX;
      this.chart = chart;
      this.chart.numberFormatter.numberFormat = '€ #,###.';

      // fetch data
      this.populateChart();

      dateAxis.events.on('selectionextremeschanged', (event) => {
        this.store.dispatch(new AccountsActions.SetPeriod(
          {start: new Date(event.target.minZoomed), end: new Date(event.target.maxZoomed)}));
        return event;
      });
      this.store.select(state => state.accounts.granularity).subscribe(granularity => {
        this.mode = granularity;

        this.zone.runOutsideAngular(() => {
          this.populateChart();
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

  private createIncomeExpensesSubchart(chart: am4charts.XYChart) {
    const valueAxisIncomeExpenses = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxisIncomeExpenses.cursorTooltipEnabled = false;
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

  private populateChart() {
    this.store.select(state => state.accounts.currentData).subscribe(
      (currentData) => {
        const data = [];
        for (const items of currentData) {
          data.push({
            date: items.date,
            balance: items.balance,
            income: items.income,
            expenses: items.expenses,
            profit: items.profit,
            loss: items.loss,
          });
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
