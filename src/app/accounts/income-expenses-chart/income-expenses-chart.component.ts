import {
  Component,
  OnInit,
  NgZone,
  AfterViewInit,
  OnDestroy
} from '@angular/core';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import am4lang_nl_NL from '@amcharts/amcharts4/lang/nl_NL';

import {
  SaldoService,
  IncomeExpensesProfitLoss
} from '../saldo.service';

@Component({
  selector: 'app-income-expenses-chart',
  templateUrl: './income-expenses-chart.component.html',
  styleUrls: ['./income-expenses-chart.component.css']
})
export class IncomeExpensesChartComponent
  implements OnInit, AfterViewInit, OnDestroy {
  chart: am4charts.XYChart;
  mode: string = 'monthly';
  constructor(private zone: NgZone, private saldoService: SaldoService) {}

  ngOnInit() {
    am4core.useTheme(am4themes_animated);
  }

  ngAfterViewInit(): void {
    this.zone.runOutsideAngular(() => {
      const chart = am4core.create(
        'chart-income-expenses-div',
        am4charts.XYChart
      );
      chart.language.locale = am4lang_nl_NL;
      chart.numberFormatter.numberFormat = '€ #,###.';

      chart.paddingRight = 20;
      const title = chart.titles.create();
      title.text = 'Income & expenses';

      // fetch data
      this.populateChart();

      const dateAxis = chart.xAxes.push(new am4charts.DateAxis());
      dateAxis.renderer.grid.template.location = 0;
      dateAxis.renderer.labels.template.rotation = 90;
      dateAxis.renderer.minGridDistance = 10;

      // categoryAxis.renderer.labels.template.adapter.add('dy', function(dy, target) {
      //   if (target.dataItem && (target.dataItem.index & 2) === 2) {
      //     return dy + 25;
      //   }
      //   return dy;
      // });

      const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      const tooltipText = '{dateX}: \nIncome: {income.formatNumber("€ #,###.")}\nExpenses: {expenses.formatNumber("€ #,###.")}\nProfit: [bold]{profit.formatNumber("€ #,###.")}[/]\nLoss: [bold]{loss.formatNumber("€ #,###.")}[/]';

      // Create series
      const income = chart.series.push(new am4charts.ColumnSeries());
      income.dataFields.valueY = 'income';
      income.dataFields.dateX = 'date';
      income.name = 'Income';
      income.columns.template.tooltipText = tooltipText;
      income.columns.template.fillOpacity = 0.8;
      income.clustered = false;

      const expenses = chart.series.push(new am4charts.ColumnSeries());
      expenses.dataFields.valueY = 'expenses';
      expenses.dataFields.dateX = 'date';
      expenses.name = 'Expenses';
      expenses.columns.template.tooltipText = tooltipText;
      expenses.columns.template.fillOpacity = 0.8;
      expenses.columns.template.fill = am4core.color('orange');
      expenses.clustered = false;

      const profit = chart.series.push(new am4charts.ColumnSeries());
      profit.dataFields.valueY = 'profit';
      profit.dataFields.dateX = 'date';
      profit.name = 'Profit';
      profit.columns.template.tooltipText = tooltipText;
      profit.columns.template.fillOpacity = 0.8;
      profit.columns.template.fill = am4core.color('green');
      profit.clustered = false;

      const loss = chart.series.push(new am4charts.ColumnSeries());
      loss.dataFields.valueY = 'loss';
      loss.dataFields.dateX = 'date';
      loss.name = 'Loss';
      loss.columns.template.tooltipText = tooltipText;
      loss.columns.template.fillOpacity = 0.8;
      loss.columns.template.fill = am4core.color('red');
      loss.clustered = false;

      const columnTemplate = income.columns.template;
      columnTemplate.strokeWidth = 2;
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
    });
  }

  populateChart() {
    return this.saldoService
      .fetchIncomeExpensesProfitLoss(this.mode)
        .subscribe((incomeExpenses: IncomeExpensesProfitLoss[]) => {
          const data = [];
          for (const item of incomeExpenses) {
            data.push({
              date: new Date(item.date),
              income: +item.income,
              expenses: +item.expenses,
              profit: +item.profit,
              loss: +item.loss
            });
          }
        console.log('Updating income/expenses chart with data: ', data);

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
  }
}
