import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { Router } from '@angular/router';
import { StatePassingService } from 'src/app/services/state-services/state-passing.service';
import { Location } from '@angular/common';
import { MyMeasurementsComponent } from './my-measurements.component';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { MyMeasurementComponent } from '../my-measurement/my-measurement.component';
import { HeaderModule } from '../../header/header.module';
import { Utils } from 'src/app/services/util-services/util.service';
import { MeasurementsService } from 'src/app/services/rest-api-services/measurements.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { LoadingModule } from '../../loading/loading.module';
import { FakeMeasurementsService } from '@app/mocks/rest-service.mock';

const restServiceResult = {
  measurements: [
    {
      name: 'blood_pressure',
      links: {
        measurements: `${'http://localhost:7000/clinician/api/patients/me'}/measurements?type=blood_pressure`,
      },
    },
    {
      name: 'pulse',
      links: {
        measurements: `${'http://localhost:7000/clinician/api/patients/me'}/measurements?type=pulse`,
      },
    },
    {
      name: 'weight',
      links: {
        measurements: `${'http://localhost:7000/clinician/api/patients/me'}/measurements?type=weight`,
      },
    },
    {
      name: 'bloodsugar',
      links: {
        measurements: `${'http://localhost:7000/clinician/api/patients/me'}/measurements?type=bloodsugar`,
      },
    },
  ],
};

const newRestServiceResult = {
  measurements: [
    {
      name: 'blood_pressure',
      links: {
        measurements: `${'http://localhost:7000/clinician/api/patients/me'}/measurements?type=blood_pressure`,
      },
    },
  ],
};

describe('MyMeasurementsComponent', () => {
  let component: MyMeasurementsComponent;
  let fixture: ComponentFixture<MyMeasurementsComponent>;
  let router: Router;
  let location: Location;
  let appContext: StatePassingService;
  let utilsService: Utils;
  let measurementsService: FakeMeasurementsService;

  const beforeEachAsyncFn = async (response: any) => {
    appContext = new StatePassingService(router);
    utilsService = new Utils();
    measurementsService = new FakeMeasurementsService(response);

    await TestBed.configureTestingModule({
      declarations: [MyMeasurementsComponent],
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot(),
        RouterTestingModule.withRoutes([
          {
            path: 'my_measurements/:id/measurement',
            component: MyMeasurementComponent,
          },
        ]),
        HeaderModule,
        LoadingModule,
      ],
      providers: [
        { provide: StatePassingService, useValue: appContext },
        { provide: Utils, useValue: utilsService },
        { provide: MeasurementsService, useValue: measurementsService },
      ],
    }).compileComponents();
  };

  const beforeEachFn = () => {
    router = TestBed.get(Router);
    location = TestBed.get(Location);
    appContext = TestBed.get(StatePassingService);
    fixture = TestBed.createComponent(MyMeasurementsComponent);
    component = fixture.componentInstance;
    router.initialNavigation();
    fixture.detectChanges();
  };

  const instantiateComponent = (response: any) => {
    beforeEachAsyncFn(response);
    beforeEachFn();
  };

  it('should be instantiated', fakeAsync(() => {
    instantiateComponent(restServiceResult);
    tick();

    expect(component).toBeDefined();
  }));

  it('should have measurements', fakeAsync(() => {
    instantiateComponent(restServiceResult);
    tick();

    expect(component.model.measurementRefs).toBeDefined();
    expect(component.model.measurementRefs.length).toEqual(4);
  }));

  it('should open measurement when clicked', fakeAsync(() => {
    instantiateComponent(restServiceResult);
    tick();

    component.showMeasurement(1);
    fixture.detectChanges();
    tick();

    expect(location.path()).toEqual('/my_measurements/1/measurement');
    expect(
      appContext.requestParams.getAndClear('selectedMeasurement')
    ).toBeDefined();
  }));

  it('should automatically redirect to measurements if list only contains one', fakeAsync(() => {
    instantiateComponent(newRestServiceResult);
    tick();

    expect(location.path()).toEqual('/my_measurements/0/measurement');
  }));
});
