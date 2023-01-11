import { Injectable } from '@angular/core';
import { FilterType } from '@app/types/filter.type';
import { User } from '@app/types/user.type';
import { Utils } from '@services/util-services/util.service';
import { minTime, subWeeks, subMonths, subQuarters, subYears } from 'date-fns';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import {
  MeasurementTypesResult,
  MeasurementValue,
  MeasurementRef,
  MeasurementsResult,
  Measurement,
  MeasurementTypeName,
} from '@app/types/measurement-types.type';

@Injectable({
  providedIn: 'root',
})
export class MeasurementsService {
  constructor(private utils: Utils, private http: HttpClient) {}

  listTypes(user: User): Promise<MeasurementTypesResult> {
    if (!this.utils.hasNestedProperty(user, 'links.measurements')) {
      throw new TypeError(
        'User object does not contain a link ' + 'relation to my measurements'
      );
    }
    return lastValueFrom(
      this.http.get<MeasurementTypesResult>(user.links.measurements)
    );
  }

  addFilterParameters(url: string, filter: FilterType): string {
    const now = new Date();
    let from: Date;

    switch (filter) {
      case FilterType.WEEK:
        from = subWeeks(now, 1);
        break;

      case FilterType.MONTH:
        from = subMonths(now, 1);
        break;

      case FilterType.QUARTER:
        from = subQuarters(now, 1);
        break;

      case FilterType.YEAR:
        from = subYears(now, 1);
        break;

      case FilterType.ALL:
        from = new Date(minTime);
        break;
    }

    return `${url}&from=${from.toISOString()}`;
  }

  async list(
    measurementRef: MeasurementRef,
    filter?: FilterType
  ): Promise<MeasurementsResult> {
    let url = measurementRef.link;

    if (this.utils.exists(filter) && filter.length > 0) {
      url = this.addFilterParameters(url, filter);
    }

    const response = await lastValueFrom(
      this.http.get<RawMeasurementsResult>(url)
    );
    return this.wrapSuccess([])(response);
  }

  private wrapSuccess = (
    accMeasurements: Measurement[]
  ): ((response: RawMeasurementsResult) => Promise<MeasurementsResult>) => {
    return async (
      response: RawMeasurementsResult
    ): Promise<MeasurementsResult> => {
      const measurements: Measurement[] = accMeasurements.concat(
        response.results
      );

      if (response.links.next !== undefined) {
        const nextUrl: string = response.links.next;

        return lastValueFrom(
          this.http.get<RawMeasurementsResult>(nextUrl)
        ).then((newResponse: RawMeasurementsResult) => {
          return this.wrapSuccess(measurements)(newResponse);
        });
      } else {
        // Transform data from API
        const measurementsResult: MeasurementsResult = {
          measurements: measurements
            .filter(this.filterNullResult)
            .map(this.mapNullToFalse),
        };

        if (measurements.length > 0) {
          measurementsResult.type = measurements[0].type;
          measurementsResult.unit = measurements[0].measurement.unit;
        }

        return measurementsResult;
      }
    };
  };

  private filterNullResult = (measurement: Measurement): boolean => {
    const specialValueMeasurementTypes: MeasurementTypeName[] = [
      MeasurementTypeName.BLOOD_PRESSURE,
      MeasurementTypeName.PROTEIN_IN_URINE,
      MeasurementTypeName.GLUCOSE_IN_URINE,
      MeasurementTypeName.URINE_BLOOD,
      MeasurementTypeName.URINE_NITRITE,
      MeasurementTypeName.URINE_LEUKOCYTES,
    ];

    if (specialValueMeasurementTypes.includes(measurement.type)) {
      return true;
    } else {
      return measurement.measurement.value !== null;
    }
  };

  private mapNullToFalse = (measurement: Measurement): Measurement => {
    const bloodSugarMeasurementTypes = [
      MeasurementTypeName.BLOOD_SUGAR,
      MeasurementTypeName.BLOOD_SUGAR_MG_DL,
    ];
    if (bloodSugarMeasurementTypes.includes(measurement.type)) {
      const measurementValue: MeasurementValue = measurement.measurement;
      if (measurementValue.isFasting == null) {
        measurementValue.isFasting = false;
      }
      if (measurementValue.isAfterMeal == null) {
        measurementValue.isAfterMeal = false;
      }
      if (measurementValue.isBeforeMeal == null) {
        measurementValue.isBeforeMeal = false;
      }
      return measurement;
    } else {
      return measurement;
    }
  };
}

interface RawMeasurementsResult {
  max: number;
  offset: number;
  results: Measurement[];
  links: { self: string; next?: string; previous?: string };
}
