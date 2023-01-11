import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FilterType } from '@app/types/filter.type';
import {
  MeasurementModel,
  SingleValueTableDatum,
  MultiValueTableDatum,
  BloodSugarConstraint,
} from '@app/types/model.type';
import {
  Measurement,
  MeasurementRef,
  MeasurementsResult,
  MeasurementTypeName,
} from '@app/types/measurement-types.type';
import { Severity } from '@app/types/questionnaire-results.type';
import { ConfigService } from '@services/state-services/config.service';
import { GraphsService } from '@services/plot-services/graphs.service';
import { TablesService } from '@services/plot-services/tables.service';
import { MeasurementsService } from '@services/rest-api-services/measurements.service';
import { StatePassingService } from '@services/state-services/state-passing.service';

@Component({
  selector: 'app-my-measurement',
  templateUrl: './my-measurement.component.html',
  styleUrls: ['./my-measurement.component.less'],
})
export class MyMeasurementComponent implements OnInit, OnDestroy {
  model: MeasurementModel;
  shouldShowSeverity: boolean;

  constructor(
    private appContext: StatePassingService,
    private config: ConfigService,
    private tables: TablesService,
    private graphs: GraphsService,
    private measurementsService: MeasurementsService,
    @Inject(DOCUMENT) private document: Document
  ) {
    const measurementRef: MeasurementRef =
      this.appContext.requestParams.getAndClear('selectedMeasurement');

    this.shouldShowSeverity = this.config.getAppConfig().showSeverity;

    this.model = {
      state: 'Loading',
      measurementRef: measurementRef,

      measurementsResult: { measurements: [] },
      hasNoMeasurements: false,
      hasOtherMeasurements: false,

      filters: [
        {
          label: 'SHOW_1_WEEK',
          filter: FilterType.WEEK,
        },
        {
          label: 'SHOW_1_MONTH',
          filter: FilterType.MONTH,
        },
        {
          label: 'SHOW_3_MONTHS',
          filter: FilterType.QUARTER,
        },
        {
          label: 'SHOW_1_YEAR',
          filter: FilterType.YEAR,
        },
        {
          label: 'SHOW_ALL',
          filter: FilterType.ALL,
        },
      ],
      filter: FilterType.WEEK,

      graph: undefined,
      graphStandardDay: undefined,
      table: undefined,
      tableStandardDay: undefined,
    };
  }

  private onOrientationChange = (): void => {
    this.retrieveMeasurements();
  };

  ngOnInit(): void {
    this.model.hasOtherMeasurements = this.appContext.requestParams.get(
      'hasOtherMeasurements'
    ) as boolean;

    this.retrieveMeasurements();

    this.document.defaultView?.screen?.orientation?.addEventListener(
      'change',
      this.onOrientationChange
    );
  }

  private retrieveMeasurements = () => {
    const filter: FilterType = this.model.filter;

    this.measurementsService
      .list(this.model.measurementRef, filter)
      .then((response: MeasurementsResult) => {
        this.model.state = 'Loaded';
        this.resetGraphsAndTables();
        this.model.measurementsResult = response;

        if (
          this.model.measurementRef.name ===
          'MEASUREMENT_TYPE_' + MeasurementTypeName.BLOOD_PRESSURE.toUpperCase()
        ) {
          this.mergeBloodPressureDataAndRender(filter);
        } else if (
          this.model.measurementRef.name ===
          'MEASUREMENT_TYPE_' + MeasurementTypeName.SPIROMETRY.toUpperCase()
        ) {
          this.mergeSpirometryDataAndRender(filter);
        } else {
          this.mergeDataAndRender(filter);
        }
      })
      .catch(this.onError);
  };

  private resetGraphsAndTables = (): void => {
    this.model.table = undefined;
    this.model.graph = undefined;
    this.model.graphStandardDay = undefined;
    this.model.tableStandardDay = undefined;
  };

  private mergeBloodPressureDataAndRender = (filter: FilterType): void => {
    this.measurementsService
      .list(this.createPulseMeasurementRef(), filter)
      .then((extraPulseMeasurement: MeasurementsResult) => {
        const bloodPressureMeasurements: Measurement[] =
          this.model.measurementsResult.measurements;
        const pulseMeasurements: Measurement[] =
          extraPulseMeasurement.measurements;
        const mergedMeasurements: MeasurementsResult =
          this.mergeBloodPressureMeasurements(
            bloodPressureMeasurements,
            pulseMeasurements
          );

        this.model.measurementsResult = mergedMeasurements;
        this.render(this.model);
        this.model.hasNoMeasurements = this.calculateHasNoMeasurements();
      });
  };

  private createPulseMeasurementRef = (): MeasurementRef => {
    const bloodPressureURL: string = this.model.measurementRef.link;
    const pulseName: string = MeasurementTypeName.PULSE;

    const pulseURLPrefix: string = bloodPressureURL.substring(
      0,
      bloodPressureURL.indexOf('blood_pressure')
    );
    const pulseURL: string = pulseURLPrefix + pulseName;

    return {
      name: pulseName,
      icon: '',
      link: pulseURL,
    };
  };

  private mergeBloodPressureMeasurements = (
    bloodPressureMeasurements: Measurement[],
    pulseMeasurements: Measurement[]
  ): MeasurementsResult => {
    const mergedMeasurements: MeasurementsResult = {
      type: MeasurementTypeName.BLOOD_PRESSURE,
      unit: 'mmHg, bpm',
      measurements: [],
    };

    let i = 0;
    let j = 0;
    while (
      i < bloodPressureMeasurements.length &&
      j < pulseMeasurements.length
    ) {
      const bloodPressureMeasurement: Measurement =
        bloodPressureMeasurements[i];
      const pulseMeasurement: Measurement = pulseMeasurements[j];

      if (
        new Date(bloodPressureMeasurement.timestamp).getTime() >
        new Date(pulseMeasurement.timestamp).getTime()
      ) {
        mergedMeasurements.measurements.push(bloodPressureMeasurement);
        i++;
      } else if (
        new Date(bloodPressureMeasurement.timestamp).getTime() ===
        new Date(pulseMeasurement.timestamp).getTime()
      ) {
        const newMeasurement = bloodPressureMeasurement;
        const pulseValue: number = pulseMeasurement.measurement.value!;
        newMeasurement.measurement.pulse = pulseValue;
        mergedMeasurements.measurements.push(newMeasurement);
        i++;
        j++;
      } else {
        j++;
      }
    }

    if (i < bloodPressureMeasurements.length) {
      mergedMeasurements.measurements = mergedMeasurements.measurements.concat(
        bloodPressureMeasurements.slice(i)
      );
    }

    return mergedMeasurements;
  };

  private mergeSpirometryDataAndRender = (filter: FilterType): void => {
    const measurementsResult = this.model.measurementsResult;

    const additionalMeasurementTypes: string[] = [
      MeasurementTypeName.FEV6,
      MeasurementTypeName.FEV1_PERCENTAGE,
      MeasurementTypeName.FEV6_PERCENTAGE,
    ];

    const mergedMeasurements: MeasurementsResult = {
      type: MeasurementTypeName.SPIROMETRY,
      unit: 'L, %',
      measurements: measurementsResult.measurements.map((baseMeasurement) => {
        const newMeasurement = baseMeasurement;
        const severity: Severity | undefined = baseMeasurement.severity
          ? baseMeasurement.severity
          : undefined;

        newMeasurement.measurement[MeasurementTypeName.FEV1] = {
          value: baseMeasurement.measurement.value,
          severity: severity,
        };
        return newMeasurement;
      }),
    };

    // TODO: This can probably be modeled way cleaner with rxjs
    const requests: any[] = [];
    additionalMeasurementTypes.forEach((typeName: string) => {
      const deferred = this.defer();
      requests.push(deferred.promise);

      const measurementRef = this.createSpirometryMeasurementRef(typeName);
      this.measurementsService
        .list(measurementRef, filter)
        .then((extraMeasurements: MeasurementsResult) => {
          let i = 0;
          let j = 0;
          while (
            i < mergedMeasurements.measurements.length &&
            j < extraMeasurements.measurements.length
          ) {
            const baseMeasurement = mergedMeasurements.measurements[i];
            const extraMeasurement = extraMeasurements.measurements[j];
            if (
              new Date(baseMeasurement.timestamp).getTime() <
              new Date(extraMeasurement.timestamp).getTime()
            ) {
              mergedMeasurements.measurements[i] = baseMeasurement;
              i++;
            } else if (
              new Date(baseMeasurement.timestamp).getTime() ===
              new Date(extraMeasurement.timestamp).getTime()
            ) {
              const newMeasurement = baseMeasurement;
              const severity: Severity | undefined = extraMeasurement.severity
                ? extraMeasurement.severity
                : undefined;
              newMeasurement.measurement[measurementRef.name] = {
                value: extraMeasurement.measurement.value,
                severity: severity,
              };
              mergedMeasurements.measurements[i] = newMeasurement;
              i++;
              j++;
            } else {
              j++;
            }
          }
          deferred.resolve();
        });
    });

    Promise.all(requests).then(() => {
      this.model.measurementsResult = mergedMeasurements;
      this.render(this.model);
      this.model.hasNoMeasurements = this.calculateHasNoMeasurements();
    });
  };

  defer(): any {
    const deferred: any = {};
    const promise = new Promise(function (resolve, reject) {
      deferred.resolve = resolve;
      deferred.reject = reject;
    });
    deferred.promise = promise;
    return deferred;
  }

  createSpirometryMeasurementRef = (typeName: string) => {
    const measurementUrl: string = this.model.measurementRef?.link!;
    const measurementUrlBase: string =
      measurementUrl.substring(
        0,
        measurementUrl.indexOf('measurements?type=')
      ) + 'measurements?type=';

    return {
      name: typeName,
      icon: '',
      link: measurementUrlBase + encodeURIComponent(typeName),
    };
  };

  private mergeDataAndRender = (filter: FilterType): void => {
    const measurementsResult = this.model.measurementsResult;

    if (measurementsResult.measurements.length > 0) {
      this.model.measurementsResult.type =
        measurementsResult.measurements[0].type;
      this.model.measurementsResult.unit =
        measurementsResult.measurements[0].measurement.unit;
      this.render(this.model);
    }

    this.model.hasNoMeasurements = this.calculateHasNoMeasurements();
  };

  onError = (error: object) => {
    this.model.state = 'Failed';
    console.error(`Failed to load measurements due to error: ${error}`);
  };

  showPopup = (datum: SingleValueTableDatum | MultiValueTableDatum) => {
    if ('comment' in datum && datum.comment !== undefined) {
      this.model.popupMeasurement = datum;
    }
  };

  hidePopup() {
    delete this.model.popupMeasurement;
  }

  showFilter = (filter: FilterType): void => {
    this.model.state = 'Loading';
    this.model.hasNoMeasurements = false;
    this.model.filter = filter;
    this.retrieveMeasurements();
  };

  render = (model: MeasurementModel): void => {
    this.model.table = this.tables.createTable(model.measurementsResult);
    this.model.graph = this.graphs.createGraph(model.measurementsResult);

    if (
      this.model.measurementRef.name ===
        'MEASUREMENT_TYPE_' + MeasurementTypeName.BLOOD_SUGAR.toUpperCase() ||
      this.model.measurementRef.name ===
        'MEASUREMENT_TYPE_' +
          MeasurementTypeName.BLOOD_SUGAR_MG_DL.toUpperCase()
    ) {
      this.model.graphStandardDay = this.graphs.createStandardDayGraph(
        model.measurementsResult
      );
      this.model.tableStandardDay = this.tables.createStandardDayTable(
        model.measurementsResult
      );
    }
  };

  calculateHasNoMeasurements = (): boolean => {
    const noSeriesData =
      this.model.graph === undefined ||
      this.model.graph.data.datasets.length === 0;

    const noTableData =
      this.model.table === undefined || this.model.table.data.length === 0;

    return noTableData && noSeriesData;
  };

  ngOnDestroy() {
    this.document.defaultView?.screen?.orientation?.removeEventListener(
      'change',
      this.onOrientationChange
    );
  }

  trackByIndex(index: number) {
    return index;
  }

  severity(severity?: Severity) {
    if (!this.config.getAppConfig().showSeverity) {
      return 'severity-none';
    }

    if (severity !== undefined) {
      return `severity-${severity}`;
    } else {
      return 'severity-none';
    }
  }
}
