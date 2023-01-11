import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { appConfig, FakeConfigService } from '@app/mocks/config-service.mock';
import { FakeMeasurementsService } from '@app/mocks/rest-service.mock';
import { AppType } from '@app/types/config.type';
import { FilterType } from '@app/types/filter.type';
import { HeaderModule } from '@components/header/header.module';
import { LoadingModule } from '@components/loading/loading.module';
import { TranslateModule } from '@ngx-translate/core';
import { GraphsService } from '@services/plot-services/graphs.service';
import { MeasurementsService } from '@services/rest-api-services/measurements.service';
import { ConfigService } from '@services/state-services/config.service';
import { StatePassingService } from '@services/state-services/state-passing.service';
import { MyMeasurementsModule } from '../my-measurements.module';

import { MyMeasurementComponent } from './my-measurement.component';

const restServiceResult = {
  links: {
    self: 'http://localhost:5000/opentele-server/rest/patient/measurements/blood_pressure',
  },
  type: 'blood_pressure',
  unit: 'mmHg',
  measurements: [
    {
      timestamp: '2014-11-11T00:00:00.000+02:00',
      unit: 'mmHg',
      measurement: {
        systolic: 120,
        diastolic: 90,
      },
    },
    {
      timestamp: '2014-11-08T00:00:00.000+02:00',
      unit: 'mmHg',
      measurement: {
        systolic: 153,
        diastolic: 100,
      },
    },
  ],
};

describe('MyMeasurementComponent', () => {
  let component: MyMeasurementComponent;
  let fixture: ComponentFixture<MyMeasurementComponent>;
  let router: Router;
  let appContext: StatePassingService;
  let configService: any;

  async function init(severity: boolean) {
    appContext = new StatePassingService(router);
    configService = new FakeConfigService();
    configService.appConfig = {
      appType: AppType.CLINICIAN_AND_PATIENT,
      version: '2.76.0',
      fakeNativeEnabled: true,
      idleTimeoutInSeconds: 600,
      idleWarningCountdownInSeconds: 0.1,
      showSeverity: severity,
      showReplies: true,
      baseUrl: 'http://localhost:7000/',
    };

    await TestBed.configureTestingModule({
      declarations: [MyMeasurementComponent],
      providers: [
        { provide: StatePassingService, useValue: appContext },
        { provide: ConfigService, useValue: configService },
        {
          provide: MeasurementsService,
          useValue: new FakeMeasurementsService(restServiceResult),
        },
      ],
      imports: [
        HeaderModule,
        LoadingModule,
        TranslateModule.forRoot(),
        HttpClientTestingModule,
        MyMeasurementsModule,
        RouterTestingModule.withRoutes([]),
      ],
    }).compileComponents();

    router = TestBed.get(Router);
    appContext = TestBed.get(StatePassingService);
    appContext.requestParams.set('selectedMeasurement', {
      name: 'blood_pressure',
      links: {
        measurements:
          'http://localhost:5000/opentele-server/rest/' +
          'patient/measurements/blood_pressure',
      },
    });
    configService = TestBed.get(ConfigService);
    fixture = TestBed.createComponent(MyMeasurementComponent);
    component = fixture.componentInstance;

    router.initialNavigation();
    fixture.detectChanges();
    await fixture.whenStable();
  }

  describe('when severity is true the component', () => {
    beforeEach(async () => {
      await init(true);
    });

    it('should have a measurement', () => {
      expect(component.model.measurementsResult).toBeDefined();
      expect(component.model.measurementRef.name).toEqual('blood_pressure');

      //@ts-ignore
      expect(component.model.measurementRef.links.measurements).toEqual(
        'http://' +
          'localhost:5000/opentele-server/rest/patient/measurements/blood_pressure'
      );
    });

    it('should call plotService with model', () => {
      expect(component.model.measurementRef).toEqual({
        name: 'blood_pressure',
        //@ts-ignore
        links: {
          measurements:
            'http://localhost:5000/opentele-server/' +
            'rest/patient/measurements/blood_pressure',
        },
      });
      expect(component.model.filter).toEqual('WEEK');
    });

    it('should call plotService with model and filter', async () => {
      component.showFilter(FilterType.WEEK);
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.model.measurementRef).toEqual({
        name: 'blood_pressure',
        //@ts-ignore
        links: {
          measurements:
            'http://localhost:5000/opentele-server/' +
            'rest/patient/measurements/blood_pressure',
        },
      });
      expect(component.model.filter).toEqual('WEEK');
    });

    it('should set popup offsets as expected', () => {
      const bloodSugarMeasurement = {
        timestamp: '2014-11-09 16:43',
        measurement: {
          value: 3.4,
          isAfterMeal: false,
          isBeforeMeal: true,
        },
        comment: 'foobar',
      };
      //@ts-ignore
      component.showPopup(bloodSugarMeasurement);
      //@ts-ignore
      expect(component.model.popupMeasurement).toEqual(bloodSugarMeasurement);
    });

    it('should set flag to false when calling hidePopup', () => {
      const bloodSugarMeasurement = {
        timestamp: '2014-11-09 16:43',
        measurement: {
          value: 3.4,
          isAfterMeal: false,
          isBeforeMeal: true,
        },
      };
      //@ts-ignore
      component.model.popupMeasurement = bloodSugarMeasurement;
      component.hidePopup();

      expect(component.model.popupMeasurement).toEqual(undefined);
    });
  });

  describe('@requirement - OPENTELE-1590', () => {
    beforeEach(async () => {
      await init(true);
    });
    it('as a citizen, I want to be able to see if my measurement values are in compliance with defined thresholds', () => {
      const redMeasurement = 'red';
      const yellowMeasurement = 'yellow';
      const greenMeasurement = 'green';
      const noSeverityMeasurement = 'none';
      expect(component.severity(redMeasurement)).toBe('severity-red');
      expect(component.severity(yellowMeasurement)).toBe('severity-yellow');
      expect(component.severity(greenMeasurement)).toBe('severity-green');
      //@ts-ignore
      expect(component.severity(noSeverityMeasurement)).toBe('severity-none');
    });
  });

  describe('when severity is false the component', () => {
    beforeEach(async () => {
      await init(false);
    });
    it('it will always set severity none if display of severity class has been disabled', async () => {
      const redMeasurement = 'red';
      expect(component.severity(redMeasurement)).toBe('severity-none');
    });
  });
});
