import { Injectable } from '@angular/core';
import {
  Table,
  StandardDayTable,
  SingleColumnTableOptions,
  MultiColumnTableOptions,
  SingleValueTableDatum,
  MultiValueTableDatum,
  MeasurementDate,
  ValueSeverityPair,
  BloodSugarTableDatum,
  BloodSugarConstraint,
} from '@app/types/model.type';
import {
  Measurement,
  MeasurementValue,
  MeasurementsResult,
  MeasurementTypeName,
} from '@app/types/measurement-types.type';

@Injectable({
  providedIn: 'root',
})
export class TablesService {
  constructor() {}

  createTable = (measurementsResult: MeasurementsResult): undefined | Table => {
    if (
      measurementsResult.measurements.length == 0 ||
      measurementsResult.type === MeasurementTypeName.BLOOD_SUGAR ||
      measurementsResult.type === MeasurementTypeName.BLOOD_SUGAR_MG_DL
    ) {
      return undefined;
    } else if (measurementsResult.type === MeasurementTypeName.SPIROMETRY) {
      const tableOptions =
        this.createMultiColumnTableOptions(measurementsResult);
      const tableData = this.createSpirometryTableData(measurementsResult);

      return {
        kind: 'multiColumn',
        options: tableOptions,
        data: tableData,
      };
    } else {
      const tableOptions =
        this.createSingleColumnTableOptions(measurementsResult);
      const tableData = this.createDefaultTableData(measurementsResult);
      return {
        kind: 'singleColumn',
        options: tableOptions,
        data: tableData,
      };
    }
  };

  createSingleColumnTableOptions = (
    measurementsResult: MeasurementsResult
  ): SingleColumnTableOptions => {
    const dateFormat =
      measurementsResult.type === MeasurementTypeName.DAILY_STEPS ||
      measurementsResult.type === MeasurementTypeName.DAILY_STEPS_WEEKLY_AVERAGE
        ? 'll'
        : 'lll';

    const unit: string = measurementsResult.unit!;

    return {
      dateFormat: dateFormat,
      numberFormat: measurementsResult.type
        ? this.getNumberFormat(measurementsResult.type)
        : undefined,
      unit: unit,
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
      return '1.1-1';
    } else {
      return '1.0-0';
    }
  };

  createDefaultTableData = (
    measurementsResult: MeasurementsResult
  ): SingleValueTableDatum[] => {
    if (measurementsResult.type === MeasurementTypeName.BLOOD_PRESSURE) {
      return measurementsResult.measurements.map(
        (measurement: Measurement): SingleValueTableDatum => {
          const measurementValue = measurement.measurement;
          const pulseStr = measurementValue.pulse
            ? `, ${measurementValue.pulse}`
            : '';

          const bloodPressureValue =
            measurementValue.systolic +
            '/' +
            measurementValue.diastolic +
            pulseStr;

          return {
            kind: 'singleValue',
            timestamp: measurement.timestamp,
            value: bloodPressureValue,
            comment: measurement.comment,
            severity: measurement.severity,
            constraint: undefined,
          };
        }
      );
    } else if (measurementsResult.type == MeasurementTypeName.CRP) {
      return measurementsResult.measurements.map(
        (measurement: Measurement): SingleValueTableDatum => {
          const measurementValue = measurement.measurement;
          let updatedValue;
          if (0 <= measurementValue.value && measurementValue.value < 5) {
            updatedValue = '< 5';
          } else {
            updatedValue = measurementValue.value;
          }

          return {
            kind: 'singleValue',
            timestamp: measurement.timestamp,
            value: updatedValue,
            comment: measurement.comment,
            severity: measurement.severity,
            constraint: undefined,
          };
        }
      );
    } else {
      return measurementsResult.measurements.map(
        (measurement: Measurement): SingleValueTableDatum => {
          return {
            kind: 'singleValue',
            timestamp: measurement.timestamp,
            value: measurement.measurement.value,
            comment: measurement.comment,
            severity: measurement.severity,
            constraint: undefined,
          };
        }
      );
    }
  };

  createMultiColumnTableOptions = (
    _measurementsResult: MeasurementsResult
  ): MultiColumnTableOptions => {
    const dateFormat = 'lll';
    const units: string[] = ['fev1[L]', 'fev6[L]', 'fev1[%]', 'fev6[%]'];
    const numberFormats: string[] = ['1.1-1', '1.1-1', '1.0-0', '1.0-0'];

    return {
      dateFormat: dateFormat,
      numberFormats: numberFormats,
      units: units,
    };
  };

  createSpirometryTableData = (
    measurementsResult: MeasurementsResult
  ): MultiValueTableDatum[] => {
    return measurementsResult.measurements.map((measurement: Measurement) => {
      const measurementValue = measurement.measurement;

      const orDefaultValue = (
        measurementValue: MeasurementValue,
        key: string
      ): ValueSeverityPair => {
        const defaultValueSeverityPair = {
          value: undefined,
          unit: '',
          severity: undefined,
        };
        return measurementValue[key]
          ? measurementValue[key]
          : defaultValueSeverityPair;
      };

      return {
        kind: 'multiValue',
        timestamp: measurement.timestamp,
        comment: measurement.comment,
        values: [
          orDefaultValue(measurementValue, 'fev1'),
          orDefaultValue(measurementValue, 'fev6'),
          orDefaultValue(measurementValue, 'fev1%'),
          orDefaultValue(measurementValue, 'fev6%'),
        ],
      };
    });
  };

  createStandardDayTable = (
    measurementsResult: MeasurementsResult
  ): undefined | StandardDayTable => {
    if (
      measurementsResult.measurements.length == 0 ||
      (measurementsResult.type !== MeasurementTypeName.BLOOD_SUGAR &&
        measurementsResult.type !== MeasurementTypeName.BLOOD_SUGAR_MG_DL)
    ) {
      return undefined;
    } else {
      const measurementDates = this.createMeasurementDates(
        measurementsResult.measurements
      );
      
      return { measurementDates: measurementDates };
    }
  };

  /**
   * Partitions the measurements by date and returns a list of `MeasurementDate`.
   */
  private createMeasurementDates = (
    measurements: Measurement[]
  ): MeasurementDate[] => {
    const partitions: Map<string, Measurement[]> = new Map();

    const getDateWithoutTime = (timestamp: string): string => {
      const date = new Date(timestamp);
      const year = date.getFullYear();
      let month;

      if (date.getMonth() + 1 > 9) {
        month = date.getMonth() + 1;
      } else {
        month = `0${date.getMonth() + 1}`;
      }

      const day: string =
        date.getDate() > 9 ? date.getDate().toString() : `0${date.getDate()}`;
      return `${year}-${month}-${day}`;
    };

    measurements.forEach((measurement: Measurement) => {
      const dateKey: string = getDateWithoutTime(measurement.timestamp);
      measurement.measurement.value =
        Math.round(measurement.measurement.value * 10) / 10;

      if (!partitions.hasOwnProperty(dateKey)) {
        partitions[dateKey] = [];
      }
      partitions[dateKey].push(measurement);
    });

    const measurementDates: MeasurementDate[] = Object.entries(partitions).map(
      ([dateKey, measurements]): MeasurementDate =>
        this.createMeasurementDate(dateKey, measurements)
    );

    return measurementDates;
  };

  /**
   * Partitions the measurements by time of day and returns a `MeasurementDate`.
   */
  private createMeasurementDate = (
    date: string,
    measurements: Measurement[]
  ): MeasurementDate => {
    const assignToPartition = (
      partitionedMeasurement: MeasurementDate,
      tableDatum: BloodSugarTableDatum,
      hour: number
    ): void => {
      if (0 <= hour && hour < 5) {
        partitionedMeasurement.night.push(tableDatum);
      } else if (5 <= hour && hour < 11) {
        partitionedMeasurement.morning.push(tableDatum);
      } else if (11 <= hour && hour < 17) {
        partitionedMeasurement.afternoon.push(tableDatum);
      } else {
        partitionedMeasurement.evening.push(tableDatum);
      }
    };

    const partitionedMeasurement: MeasurementDate = {
      date: date,
      night: [],
      morning: [],
      afternoon: [],
      evening: [],
    };

    const determineConstraint = (
      measurement: MeasurementValue
    ): BloodSugarConstraint => {
      if (measurement.isAfterMeal) {
        return BloodSugarConstraint.IS_AFTER_MEAL;
      } else if (measurement.isBeforeMeal) {
        return BloodSugarConstraint.IS_BEFORE_MEAL;
      } else if (measurement.isFasting) {
        return BloodSugarConstraint.IS_FASTING;
      } else {
        return BloodSugarConstraint.NONE;
      }
    };

    measurements.forEach((measurement: Measurement): void => {
      const dateHours = new Date(measurement.timestamp).getHours();

      const tableDatum: BloodSugarTableDatum = {
        kind: 'singleValue',
        timestamp: measurement.timestamp,
        value: measurement.measurement.value,
        comment: measurement.comment,
        severity: measurement.severity,
        constraint: determineConstraint(measurement.measurement),
      };

      assignToPartition(partitionedMeasurement, tableDatum, dateHours);
    });

    return partitionedMeasurement;
  };
}
