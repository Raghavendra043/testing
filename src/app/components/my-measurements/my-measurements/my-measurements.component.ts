import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '@app/types/user.type';
import { MeasurementsService } from 'src/app/services/rest-api-services/measurements.service';
import { StatePassingService } from 'src/app/services/state-services/state-passing.service';
import { MyMeasurementsModel } from '@app/types/model.type';
import {
  MeasurementRef,
  MeasurementType,
  MeasurementTypesResult,
  MeasurementTypeName,
} from '@app/types/measurement-types.type';

@Component({
  selector: 'app-my-measurements',
  templateUrl: './my-measurements.component.html',
  styleUrls: ['./my-measurements.component.less'],
})
export class MyMeasurementsComponent implements OnInit {
  model: MyMeasurementsModel = {
    measurementRefs: [],
    state: 'Loading',
  };
  user: User;

  constructor(
    private appContext: StatePassingService,
    private router: Router,
    private measurementsService: MeasurementsService
  ) {
    this.user = this.appContext.getUser();
  }

  ngOnInit() {
    this.measurementsService
      .listTypes(this.user)
      .then((measurementTypes) => this.onSuccess(measurementTypes))
      .catch((error) => this.onError(error));
  }

  typeToIcon(measurementName: string): string {
    switch (measurementName) {
      case MeasurementTypeName.BLOOD_PRESSURE:
      case MeasurementTypeName.PULSE:
        return 'fal fa-heartbeat';
      case MeasurementTypeName.TEMPERATURE:
      case MeasurementTypeName.TEMPERATURE_FAHRENHEIT:
        return 'fal fa-thermometer-three-quarters';
      case MeasurementTypeName.DAILY_STEPS:
      case MeasurementTypeName.DAILY_STEPS_WEEKLY_AVERAGE:
      case MeasurementTypeName.SIT_TO_STAND:
        return 'fal fa-walking';
      case MeasurementTypeName.FAT_MASS:
      case MeasurementTypeName.WEIGHT:
      case MeasurementTypeName.WEIGHT_POUND:
        return 'fal fa-weight';
      case MeasurementTypeName.SPIROMETRY:
      case MeasurementTypeName.RESPIRATORY_RATE:
      case MeasurementTypeName.PEAK_FLOW:
      case MeasurementTypeName.FEV1:
      case MeasurementTypeName.FEV6:
      case MeasurementTypeName.FEF25_75:
      case MeasurementTypeName.FEV1_FEV6_RATIO:
      case MeasurementTypeName.FEV1_PERCENTAGE:
      case MeasurementTypeName.FEV6_PERCENTAGE:
      case MeasurementTypeName.OXYGEN_FLOW:
      case MeasurementTypeName.SATURATION:
        return 'fal fa-lungs';
      case MeasurementTypeName.PROTEIN_IN_URINE:
      case MeasurementTypeName.GLUCOSE_IN_URINE:
      case MeasurementTypeName.URINE_BLOOD:
      case MeasurementTypeName.URINE_NITRITE:
      case MeasurementTypeName.URINE_LEUKOCYTES:
      case MeasurementTypeName.CRP:
        return 'fal fa-vial';
      case MeasurementTypeName.DURATION:
      case MeasurementTypeName.DURATION_HOURS:
        return 'fal fa-bed';
      case MeasurementTypeName.BLOOD_SUGAR:
      case MeasurementTypeName.BLOOD_SUGAR_MG_DL:
      case MeasurementTypeName.HEMOGLOBIN:
        return 'fal fa-raindrops';
      case MeasurementTypeName.HEIGHT:
        return 'fal fa-ruler-vertical';
      case MeasurementTypeName.PAIN_SCALE:
      case MeasurementTypeName.BODY_CELL_MASS:
      case MeasurementTypeName.PHASE_ANGLE:
        return 'fal fa-male';
    }

    throw new Error(`Unknown measurement type: ${measurementName}`);
  }

  showMeasurement(selected: number) {
    const measurementsList = this.model.measurementRefs;
    const measurementRef: MeasurementRef = measurementsList[selected];
    this.appContext.requestParams.set('selectedMeasurement', measurementRef);
    this.appContext.requestParams.set(
      'hasOtherMeasurements',
      measurementsList.length > 1
    );

    const extras = measurementsList.length === 1 ? { replaceUrl: true } : {};
    void this.router.navigate(
      ['my_measurements', selected, 'measurement'],
      extras
    );
  }

  onSuccess = (response: MeasurementTypesResult) => {
    // Contains deprecated types due to backwards-compatibility
    const ignoredMeasurementTypes = [
      'FEF25-75%',
      'FEV1/FEV6',
      'FEV1%',
      'FEV6',
      'FEV6%',
      'ECG',
      'CTG',
      'LEAK_50%',
      'LEAK_95%',
      'RESPIRATORY_RATE_50%',
      'RESPIRATORY_RATE_95%',
      'SATURATION_50%',
      'SATURATION_95%',
      'TIDAL_VOLUME_50%',
      'TIDAL_VOLUME_95%',
    ];

    let measurementRefs: MeasurementRef[] = [];

    response.measurements.forEach((measurementType: MeasurementType) => {
      if (
        ignoredMeasurementTypes.includes(measurementType.name.toUpperCase())
      ) {
        return;
      }

      const measurementRef = {
        icon: this.typeToIcon(measurementType.name),
        name: `MEASUREMENT_TYPE_${measurementType.name.toUpperCase()}`,
        link: measurementType.links.measurements,
      };

      if (measurementRef.name === 'MEASUREMENT_TYPE_FEV1') {
        measurementRef.name = 'MEASUREMENT_TYPE_SPIROMETRY';
        measurementRefs.push(measurementRef);
      } else {
        measurementRefs.push(measurementRef);
      }
    });

    measurementRefs = measurementRefs.sort(
      (m1: MeasurementRef, m2: MeasurementRef) => {
        const nameM1 = m1.name.toUpperCase();
        const nameM2 = m2.name.toUpperCase();

        if (nameM1 < nameM2) {
          return -1;
        }

        if (nameM1 > nameM2) {
          return 1;
        }

        return 0;
      }
    );

    this.model.measurementRefs = measurementRefs;
    this.model.state = 'Loaded';
    if (response.measurements.length === 1) {
      this.showMeasurement(0);
    }
  };

  onError = (error: string) => {
    this.model.state = 'Failed';
    console.error(`Failed to load measurements due to error: ${error}`);
  };
}
