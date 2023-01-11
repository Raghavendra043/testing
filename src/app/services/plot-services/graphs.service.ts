import { Injectable } from "@angular/core";
import { formatNumber } from "@angular/common";
import { TranslateService } from "@ngx-translate/core";
import {
  Measurement,
  MeasurementsResult,
  MeasurementTypeName,
} from "@app/types/measurement-types.type";
import {
  ChartConfiguration,
  ChartData,
  ChartOptions,
  ScatterDataPoint,
} from "chart.js";
import { parse, parseISO, format } from "date-fns";
import { graphColors } from "src/app/product-flavor/colors";

@Injectable({
  providedIn: "root",
})
export class GraphsService {
  private pointSize = 5;

  constructor(private translate: TranslateService) {}

  createGraph = (
    measurementsResult: MeasurementsResult
  ): undefined | ChartConfiguration => {
    if (measurementsResult.measurements.length == 0) {
      return undefined;
    }

    const ignoredTypes = [
      MeasurementTypeName.URINE_BLOOD,
      MeasurementTypeName.URINE_NITRITE,
      MeasurementTypeName.URINE_LEUKOCYTES,
      MeasurementTypeName.PROTEIN_IN_URINE,
      MeasurementTypeName.GLUCOSE_IN_URINE,
    ];

    const typeName: MeasurementTypeName = measurementsResult.type!;

    if (ignoredTypes.includes(typeName)) {
      return undefined;
    }

    let measurements: Measurement[] = measurementsResult.measurements;

    const bloodSugarTypes: MeasurementTypeName[] = [
      MeasurementTypeName.BLOOD_SUGAR,
      MeasurementTypeName.BLOOD_SUGAR_MG_DL,
    ];

    let graphData: GraphData | undefined;
    if (typeName == MeasurementTypeName.BLOOD_PRESSURE) {
      graphData = this.createBloodPressureGraph(measurements);
    } else if (typeName == MeasurementTypeName.SPIROMETRY) {
      graphData = this.createSpirometryGraph(measurements);
    } else if (bloodSugarTypes.includes(typeName)) {
      graphData = this.createBloodSugarGraph(measurements, typeName);
    } else {
      graphData = this.createNormalGraph(measurements, typeName);
    }

    const graphOptions: ChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      scales: graphData.scales,
      plugins: {
        tooltip: graphData.tooltip,
        legend: graphData.legend,
      },
    };

    return {
      type: "line",
      data: graphData.chartData,
      options: graphOptions,
    };
  };

  createBloodPressureGraph = (measurements: Measurement[]): GraphData => {
    const systolicSeries: ScatterDataPoint[] = [];
    const diastolicSeries: ScatterDataPoint[] = [];
    const pulseSeries: ScatterDataPoint[] = [];

    measurements.forEach((measurement: Measurement) => {
      const timestamp = measurement.timestamp;
      const measurementValue = measurement.measurement;
      if (measurementValue.systolic !== undefined) {
        systolicSeries.push({
          x: timestamp as unknown as number,
          y: measurementValue.systolic,
        });
      }

      if (measurementValue.diastolic !== undefined) {
        diastolicSeries.push({
          x: timestamp as unknown as number,
          y: measurementValue.diastolic,
        });
      }

      if (measurementValue.pulse !== undefined) {
        pulseSeries.push({
          x: timestamp as unknown as number,
          y: measurementValue.pulse,
        });
      }
    });

    const scales = {
      x: {
        type: "time",
        position: "bottom",
      },
      y: {
        suggestedMin: 40,
        suggestedMax: 200,
      },
    };

    const legend = {
      display: true,
      position: "top",
    };

    const tooltip = undefined;

    const chartData = {
      labels: [],
      datasets: [
        {
          data: systolicSeries,
          backgroundColor: graphColors[0],
          borderColor: graphColors[0],
          pointBackgroundColor: graphColors[0],
          pointBorderColor: graphColors[0],
          pointBorderWidth: 0,
          pointRadius: this.pointSize,
          label: this.translate.instant("BLOOD_PRESSURE_SYSTOLIC"),
        },
        {
          data: diastolicSeries,
          backgroundColor: graphColors[1],
          borderColor: graphColors[1],
          pointBackgroundColor: graphColors[1],
          pointBorderColor: graphColors[1],
          pointBorderWidth: 0,
          pointRadius: this.pointSize,
          label: this.translate.instant("BLOOD_PRESSURE_DIASTOLIC"),
        },
        {
          data: pulseSeries,
          backgroundColor: graphColors[2],
          borderColor: graphColors[2],
          pointBackgroundColor: graphColors[2],
          pointBorderColor: graphColors[2],
          pointBorderWidth: 3,
          pointRadius: this.pointSize,
          label: this.translate.instant("BLOOD_PRESSURE_PULSE"),
          pointStyle: "cross",
          rotation: 45,
          showLine: false,
        },
      ],
    };

    return {
      scales: scales,
      legend: legend,
      chartData: chartData,
      tooltip: tooltip,
    };
  };

  createSpirometryGraph = (measurements: Measurement[]): GraphData => {
    const fev1Series: ScatterDataPoint[] = [];
    const fev6Series: ScatterDataPoint[] = [];
    const fev1PercentageSeries: ScatterDataPoint[] = [];
    const fev6PercentageSeries: ScatterDataPoint[] = [];

    measurements.forEach((measurement: Measurement) => {
      const timestamp = measurement.timestamp;
      const measurementValue = measurement.measurement;
      if (measurementValue.fev1 !== undefined) {
        fev1Series.push({
          x: timestamp as unknown as number,
          y: measurementValue.fev1.value,
        });
      }

      if (measurementValue.fev6 !== undefined) {
        fev6Series.push({
          x: timestamp as unknown as number,
          y: measurementValue.fev6.value,
        });
      }

      if (measurementValue["fev1%"] !== undefined) {
        fev1PercentageSeries.push({
          x: timestamp as unknown as number,
          y: measurementValue["fev1%"].value,
        });
      }

      if (measurementValue["fev6%"] !== undefined) {
        fev6PercentageSeries.push({
          x: timestamp as unknown as number,
          y: measurementValue["fev6%"].value,
        });
      }
    });

    const scales = {
      x: {
        type: "time",
        position: "bottom",
      },
      yPercentage: {
        position: "right",
        suggestedMin: 50,
        suggestedMax: 100,
        grid: {
          display: false,
        },
      },
      yValue: {
        suggestedMin: 2.0,
        suggestedMax: 5.0,
      },
    };

    const legend = {
      display: true,
      position: "right",
    };

    const tooltip = {
      callbacks: {
        label: (context: any) => {
          let label = context.dataset.label || "";

          if (context.parsed.y !== null) {
            label =
              this.translate.instant(
                `MEASUREMENT_TYPE_${label.toUpperCase()}`
              ) +
              " " +
              formatNumber(
                context.parsed.y,
                this.translate.currentLang,
                this.getNumberFormat(MeasurementTypeName.SPIROMETRY)
              );
          }
          return label;
        },
      },
    };

    const chartData = {
      labels: [],
      datasets: [
        {
          data: fev1Series,
          yAxisID: "yValue",
          borderColor: graphColors[0],
          pointBackgroundColor: graphColors[0],
          pointBorderWidth: 0,
          pointRadius: this.pointSize,
          label: this.translate.instant("MEASUREMENT_TYPE_FEV1"),
        },
        {
          data: fev6Series,
          yAxisID: "yValue",
          borderColor: graphColors[1],
          pointBackgroundColor: graphColors[1],
          pointBorderWidth: 0,
          pointRadius: this.pointSize,
          label: this.translate.instant("MEASUREMENT_TYPE_FEV6"),
        },
        {
          data: fev1PercentageSeries,
          yAxisID: "yPercentage",
          borderColor: graphColors[2],
          pointBackgroundColor: graphColors[2],
          pointBorderWidth: 0,
          pointRadius: this.pointSize,
          label: this.translate.instant("MEASUREMENT_TYPE_FEV1%"),
        },
        {
          data: fev6PercentageSeries,
          yAxisID: "yPercentage",
          borderColor: graphColors[3],
          pointBackgroundColor: graphColors[3],
          pointBorderWidth: 0,
          pointRadius: this.pointSize,
          label: this.translate.instant("MEASUREMENT_TYPE_FEV6%"),
        },
      ],
    };

    return {
      scales: scales,
      legend: legend,
      tooltip: tooltip,
      chartData: chartData,
    };
  };

  createBloodSugarGraph = (
    measurements: Measurement[],
    typeName: MeasurementTypeName
  ): GraphData => {
    const normalSeries: ScatterDataPoint[] = [];
    const beforeMealSeries: ScatterDataPoint[] = [];
    const afterMealSeries: ScatterDataPoint[] = [];
    const fastingSeries: ScatterDataPoint[] = [];

    measurements.forEach((measurement: Measurement) => {
      const timestamp = measurement.timestamp;
      const measurementValue = measurement.measurement;

      if (measurementValue.isBeforeMeal) {
        beforeMealSeries.push({
          x: timestamp as unknown as number,
          y: measurementValue.value,
        });
      } else if (measurementValue.isAfterMeal) {
        afterMealSeries.push({
          x: timestamp as unknown as number,
          y: measurementValue.value,
        });
      } else if (measurementValue.isFasting) {
        fastingSeries.push({
          x: timestamp as unknown as number,
          y: measurementValue.value,
        });
      } else {
        normalSeries.push({
          x: timestamp as unknown as number,
          y: measurementValue.value,
        });
      }
    });

    let yScale;
    if (typeName == MeasurementTypeName.BLOOD_SUGAR_MG_DL) {
      yScale = {
        suggestedMin: 60,
        suggestedMax: 100,
      };
    } else {
      yScale = {
        suggestedMin: 2,
        suggestedMax: 10,
      };
    }

    const scales = {
      x: {
        type: "time",
        position: "bottom",
      },
    };

    const legend = {
      display: true,
      position: "right",
    };

    const tooltip = undefined;

    const bloodSugarPointSize = 3;

    const chartData = {
      labels: [],
      datasets: [
        {
          data: beforeMealSeries,
          backgroundColor: graphColors[0],
          borderColor: graphColors[0],
          pointBackgroundColor: graphColors[0],
          pointBorderColor: graphColors[0],
          pointBorderWidth: 3,
          pointRadius: bloodSugarPointSize,
          label: this.translate.instant("BEFORE_MEAL"),
          showLine: false,
        },
        {
          data: afterMealSeries,
          backgroundColor: graphColors[1],
          borderColor: graphColors[1],
          pointBackgroundColor: graphColors[1],
          pointBorderColor: graphColors[1],
          pointBorderWidth: 3,
          pointRadius: bloodSugarPointSize,
          label: this.translate.instant("AFTER_MEAL"),
          showLine: false,
        },
        {
          data: fastingSeries,
          backgroundColor: graphColors[2],
          borderColor: graphColors[2],
          pointBackgroundColor: graphColors[2],
          pointBorderColor: graphColors[2],
          pointBorderWidth: 3,
          pointRadius: bloodSugarPointSize,
          label: this.translate.instant("FASTING"),
          showLine: false,
        },
        {
          data: normalSeries,
          backgroundColor: graphColors[3],
          borderColor: graphColors[3],
          pointBackgroundColor: graphColors[3],
          pointBorderColor: graphColors[3],
          pointBorderWidth: 3,
          pointRadius: bloodSugarPointSize,
          label: this.translate.instant("UNKNOWN"),
          showLine: false,
        },
      ],
    };

    return {
      scales: scales,
      legend: legend,
      tooltip: tooltip,
      chartData: chartData,
    };
  };

  createNormalGraph = (
    measurements: Measurement[],
    typeName: MeasurementTypeName
  ): GraphData => {
    const dataSeries: ScatterDataPoint[] = measurements.map(
      (m: Measurement) => {
        return {
          x: m.timestamp as unknown as number,
          y: m.measurement.value,
        };
      }
    );

    const scales = {
      x: {
        type: "time",
        position: "bottom",
      },
    };

    const legend = {
      display: false,
    };

    const tooltip = {
      callbacks: {
        label: (context: any) => {
          let label = context.dataset.label || "";

          if (context.parsed.y !== null) {
            label =
              this.translate.instant(
                `MEASUREMENT_TYPE_${label.toUpperCase()}`
              ) +
              " " +
              formatNumber(
                context.parsed.y,
                this.translate.currentLang,
                this.getNumberFormat(typeName)
              );
          }
          return label;
        },
      },
    };

    const chartData = {
      labels: [],
      datasets: [
        {
          data: dataSeries,
          label: typeName,
          borderColor: "#166296",
          pointBackgroundColor: "#166296",
          pointBorderWidth: 0,
          pointRadius: this.pointSize,
        },
      ],
    };

    return {
      scales: scales,
      legend: legend,
      tooltip: tooltip,
      chartData: chartData,
    };
  };

  createStandardDayGraph = (
    measurementsResult: MeasurementsResult
  ): undefined | ChartConfiguration => {
    const typeName: MeasurementTypeName = measurementsResult.type!;
    const measurements: Measurement[] = measurementsResult.measurements;

    if (
      measurementsResult.measurements.length == 0 ||
      ![
        MeasurementTypeName.BLOOD_SUGAR,
        MeasurementTypeName.BLOOD_SUGAR_MG_DL,
      ].includes(typeName)
    ) {
      return undefined;
    }

    let graphData: ChartData;
    let scales: { [key: string]: any };
    let legend: any;
    let tooltip: any;

    const normalSeries: any[] = [];
    const beforeMealSeries: any[] = [];
    const afterMealSeries: any[] = [];
    const fastingSeries: any[] = [];

    measurements.forEach((measurement: Measurement) => {
      const timestamp = measurement.timestamp;
      const measurementValue = measurement.measurement;
      const timeOfDay = parse(
        timestamp.split("T")[1],
        "HH:mm:ss",
        new Date()
      ) as any;

      if (measurementValue.isBeforeMeal) {
        beforeMealSeries.push({
          x: timestamp as unknown as number,
          y: measurementValue.value,
          t: timeOfDay,
        });
      } else if (measurementValue.isAfterMeal) {
        afterMealSeries.push({
          x: timestamp as unknown as number,
          y: measurementValue.value,
          t: timeOfDay,
        });
      } else if (measurementValue.isFasting) {
        fastingSeries.push({
          x: timestamp as unknown as number,
          y: measurementValue.value,
          t: timeOfDay,
        });
      } else {
        normalSeries.push({
          x: timestamp as unknown as number,
          y: measurementValue.value,
          t: timeOfDay,
        });
      }
    });

    scales = {
      x: {
        type: "time",
        position: "bottom",
        min: "00:00",
        max: "23:59",
        time: {
          unit: "hour",
        },
      },
    };

    legend = {
      display: true,
      position: "right",
    };

    tooltip = {
      callbacks: {
        title: (context: any) => {
          const timestamp = parseISO(context[0].raw.x);
          return format(timestamp, "PPpp");
        },
      },
    };

    const bloodSugarPointSize = 3;

    graphData = {
      labels: [],
      datasets: [
        {
          data: beforeMealSeries,
          backgroundColor: graphColors[0],
          borderColor: graphColors[0],
          pointBackgroundColor: graphColors[0],
          pointBorderColor: graphColors[0],
          pointBorderWidth: 3,
          pointRadius: bloodSugarPointSize,
          label: this.translate.instant("BEFORE_MEAL"),
          showLine: false,
        },
        {
          data: afterMealSeries,
          backgroundColor: graphColors[1],
          borderColor: graphColors[1],
          pointBackgroundColor: graphColors[1],
          pointBorderColor: graphColors[1],
          pointBorderWidth: 3,
          pointRadius: bloodSugarPointSize,
          label: this.translate.instant("AFTER_MEAL"),
          showLine: false,
        },
        {
          data: fastingSeries,
          backgroundColor: graphColors[2],
          borderColor: graphColors[2],
          pointBackgroundColor: graphColors[2],
          pointBorderColor: graphColors[2],
          pointBorderWidth: 3,
          pointRadius: bloodSugarPointSize,
          label: this.translate.instant("FASTING"),
          showLine: false,
        },
        {
          data: normalSeries,
          backgroundColor: graphColors[3],
          borderColor: graphColors[3],
          pointBackgroundColor: graphColors[3],
          pointBorderColor: graphColors[3],
          pointBorderWidth: 3,
          pointRadius: bloodSugarPointSize,
          label: this.translate.instant("UNKNOWN"),
          showLine: false,
        },
      ],
    };

    const graphOptions: ChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      scales: scales,
      parsing: {
        xAxisKey: "t",
      },
      plugins: {
        tooltip: tooltip,
        legend: legend,
      },
    };

    return {
      type: "line",
      data: graphData,
      options: graphOptions,
    };
  };

  getNumberFormat = (
    measurementTypeName: MeasurementTypeName
  ): string | undefined => {
    const floatTypes: MeasurementTypeName[] = [
      MeasurementTypeName.BLOOD_SUGAR,
      MeasurementTypeName.BLOOD_SUGAR_MG_DL,
      MeasurementTypeName.CRP,
      MeasurementTypeName.DURATION_HOURS,
      MeasurementTypeName.FEF25_75,
      MeasurementTypeName.FEV1,
      MeasurementTypeName.FEV6,
      MeasurementTypeName.HEMOGLOBIN,
      MeasurementTypeName.PAIN_SCALE,
      MeasurementTypeName.SPIROMETRY,
      MeasurementTypeName.TEMPERATURE,
      MeasurementTypeName.TEMPERATURE_FAHRENHEIT,
      MeasurementTypeName.WEIGHT,
      MeasurementTypeName.WEIGHT_POUND,
    ];

    const noFormat: MeasurementTypeName[] = [
      MeasurementTypeName.BLOOD_PRESSURE,
      MeasurementTypeName.GLUCOSE_IN_URINE,
      MeasurementTypeName.PROTEIN_IN_URINE,
      MeasurementTypeName.URINE_BLOOD,
      MeasurementTypeName.URINE_LEUKOCYTES,
      MeasurementTypeName.URINE_NITRITE,
    ];

    if (noFormat.indexOf(measurementTypeName) >= 0) {
      return undefined;
    } else if (floatTypes.indexOf(measurementTypeName) >= 0) {
      return "1.1-1";
    } else {
      return "1.0-0";
    }
  };
}

interface GraphData {
  scales: { [key: string]: any };
  legend: any;
  tooltip: any;
  chartData: ChartData;
}
