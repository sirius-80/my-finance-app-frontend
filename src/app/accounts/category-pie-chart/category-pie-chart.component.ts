import { Component, OnInit, NgZone, AfterViewInit } from '@angular/core';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import * as am4plugins_sunburst from '@amcharts/amcharts4/plugins/sunburst';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { SaldoService } from '../saldo.service';
import { CategoryData } from "../accounts.model";
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-category-pie-chart',
  templateUrl: './category-pie-chart.component.html',
  styleUrls: ['./category-pie-chart.component.css']
})
export class CategoryPieChartComponent implements OnInit, AfterViewInit {
  private parentCategoryId: string;
  private subscription: Subscription;
  private dateRange =  {min: undefined, max: undefined};

  constructor(private ngZone: NgZone,
              private saldoService: SaldoService) {}

  ngOnInit() {
    // Themes begin
    am4core.useTheme(am4themes_animated);
    // Themes end
  }

  ngAfterViewInit() {
    // create chart
    const chart = am4core.create(
      'category-pie-chart-div',
      am4plugins_sunburst.Sunburst
    );
    chart.padding(0, 0, 0, 0);
    chart.radius = am4core.percent(98);

    this.populateChart(chart);

    chart.colors.step = 2;
    chart.fontSize = 11;
    chart.innerRadius = am4core.percent(10);

    // define data fields
    chart.dataFields.value = 'value';
    chart.dataFields.name = 'name';
    chart.dataFields.children = 'children';

    const level0SeriesTemplate = new am4plugins_sunburst.SunburstSeries();
    level0SeriesTemplate.hiddenInLegend = false;
    chart.seriesTemplates.setKey('0', level0SeriesTemplate);

    // this makes labels to be hidden if they don't fit
    level0SeriesTemplate.labels.template.truncate = true;
    level0SeriesTemplate.labels.template.hideOversized = true;

    level0SeriesTemplate.labels.template.adapter.add('rotation', function(
      rotation,
      target
    ) {
      target.maxWidth =
        target.dataItem.slice.radius - target.dataItem.slice.innerRadius - 10;
      target.maxHeight = Math.abs(
        ((target.dataItem.slice.arc *
          (target.dataItem.slice.innerRadius + target.dataItem.slice.radius)) /
          2) *
          am4core.math.RADIANS
      );

      return rotation;
    });

    const level1SeriesTemplate = level0SeriesTemplate.clone();
    chart.seriesTemplates.setKey('1', level1SeriesTemplate);
    level1SeriesTemplate.fillOpacity = 0.75;
    level1SeriesTemplate.hiddenInLegend = true;

    const level2SeriesTemplate = level0SeriesTemplate.clone();
    chart.seriesTemplates.setKey('2', level2SeriesTemplate);
    level2SeriesTemplate.fillOpacity = 0.5;
    level2SeriesTemplate.hiddenInLegend = true;

    chart.legend = new am4charts.Legend();

    this.subscription = this.saldoService.category.subscribe(category => {
      this.parentCategoryId = category;
      this.populateChart(chart);
    });
    this.saldoService.dateRange.subscribe(range => {
      this.dateRange = range;
      this.populateChart(chart);
    });
  }

  populateChart(chart) {
    this.saldoService.fetchCombinedCategories(this.parentCategoryId, this.dateRange.min, this.dateRange.max)
      .subscribe((data: CategoryData[]) => {
        console.log(data);

        chart.data = data;
      });
  }
}
