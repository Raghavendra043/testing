import { TestBed, fakeAsync, tick } from "@angular/core/testing";
import { Utils } from "../util-services/util.service";
import { MeasurementsService } from "./measurements.service";
import { FilterType } from "@app/types/filter.type";
import { validUser } from "@app/mocks/user.mock";
import { HttpClient } from "@angular/common/http";
import { of, throwError } from "rxjs";
const baseUrl = "http://localhost:7000";

const response = {
  links: {
    self: `${baseUrl}/clinician/api/patients/me/measurement-types`,
  },
  measurements: [
    {
      name: "blood_pressure",
      links: {
        measurements: `${baseUrl}/clinician/api/patients/me/measurements?type=blood_pressure`,
      },
    },
    {
      name: "pulse",
      links: {
        measurements: `${baseUrl}/clinician/api/patients/me/measurements?type=pulse`,
      },
    },
    {
      name: "bloodsugar",
      links: {
        measurements: `${baseUrl}/clinician/api/patients/me/measurements?type=bloodsugar`,
      },
    },
  ],
};

describe("MeasurementsService", () => {
  let service: MeasurementsService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;
  let utils: Utils;

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj("HttpClient", ["get"]);
    utils = new Utils();

    service = new MeasurementsService(utils, httpClientSpy);
  });

  describe("list all measurements for user", () => {
    it("should not invoke callback when status is 401", fakeAsync(() => {
      httpClientSpy.get.and.returnValue(throwError(response));
      let successCallbackInvoked = true;

      service
        .listTypes(validUser)
        .then(
          (response: any) => {
            successCallbackInvoked = true;
          },
          () => {
            successCallbackInvoked = false;
          }
        )
        .catch((): any => null);
      tick();

      expect(successCallbackInvoked).toBe(false);
    }));

    // it('should throw exception when user has no link to myMeasurements', fakeAsync(() => { // TODO: Should be deleted due to links.measurements is required?
    //   // instantiateService(200, {});
    //   httpClientSpy.get.and.returnValue(of(response));
    //   tick();

    //   expect(() => {
    //     service.listTypes({});
    //   }).toThrow();
    //   expect(() => {
    //     service.listTypes({ links: {} });
    //   }).toThrow();
    // }));

    it("should invoke success callback when response is valid", fakeAsync(() => {
      httpClientSpy.get.and.returnValue(of(response));
      let successCallbackInvoked = false;

      service.listTypes(validUser).then(() => {
        successCallbackInvoked = true;
      });
      tick();
      expect(successCallbackInvoked).toEqual(true);
    }));

    it("should transform response to client object", fakeAsync(() => {
      httpClientSpy.get.and.returnValue(of(response));

      let data: any = {};
      service.listTypes(validUser).then((response: any) => {
        data = response;
      });
      tick();

      expect(data.measurements.length).toEqual(3);
      expect(data.measurements[0].name).toEqual("blood_pressure");
      expect(data.measurements[0].links.measurements).toEqual(
        `${baseUrl}/clinician/api/patients/me/measurements?type=blood_pressure`
      );
      expect(data.measurements[1].name).toEqual("pulse");
      expect(data.measurements[1].links.measurements).toEqual(
        `${baseUrl}/clinician/api/patients/me/measurements?type=pulse`
      );
      expect(data.measurements[2].name).toEqual("bloodsugar");
      expect(data.measurements[2].links.measurements).toEqual(
        `${baseUrl}/clinician/api/patients/me/measurements?type=bloodsugar`
      );
    }));
  });

  describe("get specific measurement", () => {
    const testMeasurement = {
      links: {
        self: `${baseUrl}/clinician/api/patients/me/measurements?type=blood_pressure`,
      },
      results: [
        {
          timestamp: "2014-11-11T00:00:00.000+02:00",
          type: "blood_pressure",
          measurement: {
            unit: "mmHg",
            systolic: 120,
            diastolic: 90,
          },
        },
        {
          timestamp: "2014-11-08T00:00:00.000+02:00",
          type: "blood_pressure",
          measurement: {
            unit: "mmHg",
            systolic: 153,
            diastolic: 100,
          },
        },
        {
          timestamp: "2014-11-06T00:00:00.000+02:00",
          type: "blood_pressure",
          measurement: {
            unit: "mmHg",
            systolic: 174,
            diastolic: 120,
          },
        },
      ],
    };

    it("should transform response to client object", fakeAsync(() => {
      httpClientSpy.get.and.returnValue(of(testMeasurement));

      const measurementRef = {
        name: "blood_pressure",
        icon: "icon",
        link: `${baseUrl}/clinician/api/patients/me/measurements?type=blood_pressure`,
      };

      let data: any = {};
      service.list(measurementRef, FilterType.WEEK).then((response: any) => {
        data = response;
      });
      tick();

      expect(data.type).toEqual("blood_pressure");
      expect(data.unit).toEqual("mmHg");

      expect(data.measurements[0].timestamp).toEqual(
        "2014-11-11T00:00:00.000+02:00"
      );
      expect(data.measurements[0].measurement.systolic).toEqual(120);
      expect(data.measurements[0].measurement.diastolic).toEqual(90);

      expect(data.measurements[1].timestamp).toEqual(
        "2014-11-08T00:00:00.000+02:00"
      );
      expect(data.measurements[1].measurement.systolic).toEqual(153);
      expect(data.measurements[1].measurement.diastolic).toEqual(100);

      expect(data.measurements[2].timestamp).toEqual(
        "2014-11-06T00:00:00.000+02:00"
      );
      expect(data.measurements[2].measurement.systolic).toEqual(174);
      expect(data.measurements[2].measurement.diastolic).toEqual(120);
    }));

    // it('should throw exception if links is not defined', fakeAsync(() => { // TODO: Should be deleted due to links is required?
    //   instantiateService(200, {});
    //   tick();

    //   const wrapperEmpty = () => {
    //     service.list({}, 'WEEK').then((response: any) => {});
    //   };
    //   const wrapperNoLink = () => {
    //     service.list({ links: {} }, 'WEEK').then((response: any) => {});
    //   };
    //   expect(wrapperEmpty).toThrow();
    //   expect(wrapperNoLink).toThrow();
    // }));
  });
});
