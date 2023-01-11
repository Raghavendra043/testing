import { fakeAsync, tick, TestBed } from "@angular/core/testing";
import { Utils } from "../util-services/util.service";
import { QuestionnairesService } from "./questionnaires.service";
import { ClinicianService } from "./clinician.service";
import { StatePassingService } from "../state-services/state-passing.service";
import { HttpClient } from "@angular/common/http";
import { User } from "@app/types/user.type";
import { validUser } from "@app/mocks/user.mock";
import { of, throwError } from "rxjs";
import { AppConfig, OIDCConfig } from "@app/types/config.type";

const baseUrl = "http://localhost:7000";
const user: User = {
  ...validUser,
  links: { ...validUser.links },
};

describe("QuestionnairesService", () => {
  let service: QuestionnairesService;
  let clinicianService: ClinicianService;
  let appContext: StatePassingService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;
  let utils = new Utils();

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj("HttpClient", ["get", "post"]);
    TestBed.configureTestingModule({
      providers: [
        { provide: HttpClient, useValue: httpClientSpy },
        { provide: Utils, useValue: utils },
      ],
    });

    clinicianService = TestBed.inject(ClinicianService);
    appContext = TestBed.inject(StatePassingService);

    service = new QuestionnairesService(
      utils,
      clinicianService,
      appContext,
      httpClientSpy
    );
  });

  describe("list all questionnaires for user", () => {
    it("should not invoke callback when status is 401", fakeAsync(() => {
      let successCallbackInvoked = false;

      // @ts-ignore
      httpClientSpy.get.and.callFake((url: any) => {
        if (url === user.links.questionnaires) {
          return throwError({ status: 401, data: {} });
        } else {
          return of({ status: 200, data: {} });
        }
      });

      service
        .list(user)
        .then(() => {
          successCallbackInvoked = true;
        })
        .catch((): any => null);
      tick();

      expect(successCallbackInvoked).toBe(false);
    }));

    // it('should throw exception when user has no link to questionnaires', fakeAsync(() => { // TODO: outcommented since questionnaires url is required
    //   instantiateService(200, {});
    //   tick();
    //   expect(() => {
    //     service.list({}).then(() => {});
    //   }).toThrow();
    //   expect(() => {
    //     service.list({ links: {} }).then(() => {});
    //   }).toThrow();
    // }));

    it("should invoke success callback when response is valid", fakeAsync(() => {
      let successCallbackInvoked = false;

      // @ts-ignore
      httpClientSpy.get.and.callFake((url: any) => {
        if (url === user.links.questionnaires) {
          return of({ questionnaires: [] });
        } else {
          return throwError({ status: 404, data: {} });
        }
      });

      service.list(user).then(() => {
        successCallbackInvoked = true;
      });

      tick();
      expect(successCallbackInvoked).toEqual(true);
    }));

    it("should transform response to client object", fakeAsync(() => {
      // @ts-ignore
      httpClientSpy.get.and.callFake((url: any) => {
        if (url === user.links.questionnaires) {
          return of({
            questionnaires: [
              {
                name: "blodsukker",
                version: "1.0",
                links: {
                  questionnaire: "http://localhost/questionnaires/42",
                },
              },
              {
                name: "blodtryk",
                version: "0.1",
                links: {
                  questionnaire: "http://localhost/questionnaires/44",
                },
              },
            ],
          });
        } else {
          return throwError({ status: 404, data: {} });
        }
      });

      let data: any = {};
      service.list(user).then((response: any) => {
        data = response;
      });

      tick();
      expect(data.questionnaires.length).toEqual(2);
      expect(data.questionnaires[0].name).toEqual("blodsukker");
      expect(data.questionnaires[0].version).toEqual("1.0");
      expect(data.questionnaires[0].links.questionnaire).toMatch(/42/);
      expect(data.questionnaires[1].name).toEqual("blodtryk");
      expect(data.questionnaires[1].version).toEqual("0.1");
      expect(data.questionnaires[1].links.questionnaire).toMatch(/44/);
    }));
  });

  describe("get specific questionnaire", () => {
    const testQuestionnaire = {
      name: "Blodsukker (manuel)",
      id: 27,
      version: "0.1",
      startNode: "157",
      endNode: "159",
      nodes: [
        {
          IONode: {
            nodeName: "157",
            elements: [
              {
                TextViewElement: {
                  text: "Så skal der måles blodsukker!",
                },
              },
              {
                ButtonElement: {
                  text: "Nest",
                  gravity: "center",
                  next: "158",
                },
              },
            ],
          },
        },
        {
          EndNode: { nodeName: "159" },
        },
      ],
      output: [
        { name: "158.BS##CANCEL", type: "Boolean" },
        { name: "158.BS#DEVICE_ID", type: "String" },
        { name: "158.BS##SEVERITY", type: "String" },
        { name: "158.BS#BLOODSUGARMEASUREMENTS", type: "Integer" },
      ],
      links: {
        questionnaireResult: `${baseUrl}/clinician/api/patients/me/questionnaires/27/results`,
      },
    };

    it("should transform response to client object", fakeAsync(() => {
      const questionnaireRef = {
        version: "0.1",
        links: {
          questionnaire: `${baseUrl}/clinician/api/patients/me/questionnaires/27`,
        },
      };

      // @ts-ignore
      httpClientSpy.get.and.callFake((url: any) => {
        if (url === questionnaireRef.links.questionnaire) {
          return of(testQuestionnaire);
        } else {
          return throwError({ status: 404, data: {} });
        }
      });

      let data: any = {};
      service.get(questionnaireRef).then((response: any) => {
        data = response;
      });

      tick();
      expect(data.name).toBe("Blodsukker (manuel)");
      expect(data.startNode).toBe("157");
      expect(data.nodes.length).toBe(2);
      expect(data.version).toBeDefined();
      expect(data.version).toBe("0.1");
      expect(data.links).toBeDefined();
      expect(data.links.questionnaireResult).toMatch(
        /patients\/me\/questionnaires\/27\/results/
      );
    }));

    it("should throw exception if links is not defined", fakeAsync(() => {
      const wrapperEmpty = () => {
        service.get({}).then((r: any) => {});
      };
      const wrapperNoLink = () => {
        service.get({ links: {} }).then((r: any) => {});
      };
      expect(wrapperEmpty).toThrow();
      expect(wrapperNoLink).toThrow();
    }));
  });

  describe("reply to questionnaire", () => {
    const questionnaire = {
      name: "blodsukker",
      version: "0.1",
      id: 27,
      links: {
        questionnaireResult: `${baseUrl}/clinician/api/patients/me/questionnaires/27/results`,
      },
    };

    const outputs = [
      {
        name: "SOME_OUTPUT",
        value: "hello there",
        type: "String",
      },
    ];

    it("should format request and send to server", fakeAsync(() => {
      let actualData: any;
      // @ts-ignore
      httpClientSpy.post.and.callFake((url: string, body: any) => {
        if (url.match(/.*\/questionnaires\/27\/results/)) {
          actualData = body;
          return of({});
        } else {
          return throwError({ status: 404, data: {} });
        }
      });

      service.replyTo(questionnaire, outputs).then(
        () => {},
        () => {}
      );

      tick();
      expect(actualData).toBeDefined();
      expect(actualData.version).toBe(questionnaire.version);
      expect(actualData.date).toBeDefined();
      expect(actualData.output).toEqual(outputs);
    }));

    it("should throw exception if links is not defined", fakeAsync(() => {
      tick();
      const wrapperEmpty = () => {
        service
          .replyTo(
            {
              questionnaire: {
                questionnaire: { questionnaire: {}, outputs: {} },
              },
            },
            {}
          )
          .then(
            (r: any) => {},
            () => {}
          );
      };
      const wrapperNoLink = () => {
        service
          .replyTo(
            {
              questionnaire: {
                questionnaire: { questionnaire: { links: {} }, outputs: {} },
              },
            },
            {}
          )
          .then(
            (r: any) => {},
            () => {}
          );
      };
      expect(wrapperEmpty).toThrow();
      expect(wrapperNoLink).toThrow();
    }));

    it("should invoke success callback", fakeAsync(() => {
      const questionnaire = {
        name: "blodsukker",
        version: "0.1",
        id: 27,
        links: {
          questionnaireResult: `${baseUrl}/clinician/api/patients/me/questionnaires/27/results`,
        },
      };

      const outputs = [
        {
          name: "SOME_OUTPUT",
          value: "hello there",
          type: "String",
        },
      ];
      // @ts-ignore
      httpClientSpy.post.and.callFake((url: string, body: any) => {
        if (url.match(/.*\/patients\/me\/questionnaires\/27\/results/)) {
          return of({});
        } else {
          return throwError({ status: 404, data: {} });
        }
      });

      let successInvoked = false;
      service.replyTo(questionnaire, {}).then(
        () => {
          successInvoked = true;
        },
        () => {}
      );

      tick();
      expect(successInvoked).toBe(true);
    }));
  });
});
