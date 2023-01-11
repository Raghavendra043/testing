import { Injectable } from "@angular/core";
import { ConfigService } from "@services/state-services/config.service";

@Injectable({
  providedIn: "root",
})
export class FakeNativeLayerService {
  constructor(private config: ConfigService) {
    const enabled = this.config.getAppConfig().fakeNativeEnabled;

    if (enabled) {
      console.debug("Fake native service enabled!");
      this.setupFakeNativeLayer();
    } else {
      console.debug("Fake native service disabled!");
    }
  }

  private setupFakeNativeLayer = () => {
    globalThis.external = {
      // @ts-ignore
      notify: (raw: string) => {
        const message = JSON.parse(raw);

        setTimeout(() => {
          switch (message.messageType) {
            case "clientLoggingEnabled":
              this.sendLogMessagesToWebView();
              break;

            case "openUrlRequest":
              this.openUrl(message.url);
              break;

            case "deviceMeasurementRequest":
              this.addDeviceListener(message.meterType, message.parameters);
              break;

            case "deviceTokenRequest":
              this.sendMessageToWebView({
                messageType: "deviceTokenResponse",
                deviceToken: "my-device-token",
                deviceOS: "iOS",
              });
              break;

            case "stopDeviceMeasurementRequest":
              break;

            case "videoEnabledRequest":
              this.sendMessageToWebView({
                messageType: "videoEnabledResponse",
                enabled: false, // set 'enabled' to true to mock the video conference feature
              });
              break;

            case "startNotificationSoundRequest":
              break;

            case "stopNotificationSoundRequest":
              break;

            case "startVideoConferenceRequest":
              this.joinConference(message);
              break;

            case "overdueQuestionnairesRequest":
              this.sendMessageToWebView({
                messageType: "overdueQuestionnairesResponse",
                questionnaireNames: ["Blodsukker (manuel)"],
              });
              break;

            case "clearUnreadMessagesRequest":
              console.info("Clear unread messages");
              break;

            case "clearScheduledQuestionnaireRequest":
              console.info(
                "Questionnaire id to clear notification for: " +
                  message.questionnaireId
              );
              if (message.questionnaireId === null) {
                throw new Error("Questionnaire ID is null");
              }
              break;

            case "updateScheduledQuestionnairesRequest":
              console.info(
                "Questionnaires to update notifications for: " +
                  JSON.stringify(message.scheduledQuestionnaires)
              );
              break;

            case "showPopupDialogRequest":
              console.info("Request for show popup dialog, returning ok");
              this.sendMessageToWebView({
                messageType: "showPopupDialogResponse",
                result: true, // The user clicked ok...
              });
              break;

            default:
              console.warn(
                "Fake native layer does not support message of type: " +
                  message.messageType
              );
          }
        }, 100);
      },
    };
  };

  weightEvents = [
    {
      timestamp: "2015-05-11T12:33:03.000+02:00",
      type: "status",
      status: {
        type: "info",
        message: "CONNECTING",
      },
    },

    {
      timestamp: "2015-05-11T12:33:05.000+02:00",
      type: "status",
      status: {
        type: "info",
        message: "CONNECTED",
      },
    },

    {
      timestamp: "2015-05-11T12:33:07.000+02:00",
      origin: {
        device_measurement: {
          connection_type: "USB",
          manufacturer: "ACME Inc",
          firmware_version: "5-t",
          model: "ABC-1234",
          primary_device_identifier: {
            serial_number: "1234-555",
          },
          additional_device_identifiers: [
            {
              other: {
                description: "eui_64",
                value: "1234567890",
              },
            },
          ],
        },
      },
      type: "measurement",
      measurement: {
        type: "weight",
        unit: "kg",
        value: 85.3,
      },
    },

    {
      timestamp: "2015-05-11T12:33:05.000+02:00",
      type: "status",
      status: {
        type: "info",
        message: "DISCONNECTED",
      },
    },
  ];

  temperatureEvents = [
    {
      timestamp: "2015-05-11T12:33:03.000+02:00",
      type: "status",
      status: {
        type: "info",
        message: "CONNECTING",
      },
    },

    {
      timestamp: "2015-05-11T12:33:05.000+02:00",
      type: "status",
      status: {
        type: "info",
        message: "CONNECTED",
      },
    },

    {
      timestamp: "2015-05-11T12:33:07.000+02:00",
      origin: {
        device_measurement: {
          connection_type: "USB",
          manufacturer: "ACME Inc",
          firmware_version: "5-t",
          model: "ABC-1234",
          primary_device_identifier: {
            serial_number: "1234-555",
          },
          additional_device_identifiers: [
            {
              other: {
                description: "eui_64",
                value: "1234567890",
              },
            },
          ],
        },
      },
      type: "measurement",
      measurement: {
        type: "temperature",
        unit: "C",
        value: 37.3,
      },
    },

    {
      timestamp: "2015-05-11T12:33:09.000+02:00",
      type: "status",
      status: {
        type: "info",
        message: "DISCONNECTED",
      },
    },
  ];

  bloodPressureEvents = [
    {
      timestamp: "2015-05-11T12:31:13.000+02:00",
      type: "status",
      status: {
        type: "info",
        message: "CONNECTING",
      },
    },

    {
      timestamp: "2015-05-11T12:31:15.000+02:00",
      type: "status",
      status: {
        type: "info",
        message: "CONNECTED",
      },
    },

    {
      timestamp: "2015-05-11T12:31:17.000+02:00",
      origin: {
        device_measurement: {
          connection_type: "USB",
          manufacturer: "ACME Inc",
          firmware_version: "5-t",
          model: "ABC-1234",
          primary_device_identifier: {
            serial_number: "1234-555",
          },
          additional_device_identifiers: [
            {
              other: {
                description: "eui_64",
                value: "1234567890",
              },
            },
          ],
        },
      },
      type: "measurement",
      measurement: {
        type: "blood pressure",
        unit: "mmHg",
        value: {
          systolic: 122,
          diastolic: 95,
          meanArterialPressure: 108,
        },
      },
    },

    {
      timestamp: "2015-05-11T12:31:17.000+02:00",
      origin: {
        device_measurement: {
          connection_type: "USB",
          manufacturer: "ACME Inc",
          firmware_version: "5-t",
          model: "ABC-1234",
          primary_device_identifier: {
            serial_number: "1234-555",
          },
          additional_device_identifiers: [
            {
              other: {
                description: "eui_64",
                value: "1234567890",
              },
            },
          ],
        },
      },
      type: "measurement",
      measurement: {
        type: "pulse",
        unit: "bpm",
        value: 80,
      },
    },

    {
      timestamp: "2015-05-11T12:31:19.000+02:00",
      type: "status",
      status: {
        type: "info",
        message: "DISCONNECTED",
      },
    },
  ];

  saturationEvents = [
    {
      timestamp: "2015-06-09T13:43:13.000+02:00",
      type: "status",
      status: {
        type: "info",
        message: "SATURATION_CONNECTING",
      },
    },

    {
      timestamp: "2015-06-09T13:43:15.000+02:00",
      type: "status",
      status: {
        type: "info",
        message: "SATURATION_CONNECTED",
      },
    },

    {
      timestamp: "2015-06-09T13:43:17.000+02:00",
      origin: {
        device_measurement: {
          connection_type: "USB",
          manufacturer: "ACME Inc",
          firmware_version: "5-t",
          model: "ABC-1234",
          primary_device_identifier: {
            serial_number: "1234-555",
          },
          additional_device_identifiers: [
            {
              other: {
                description: "eui_64",
                value: "1234567890",
              },
            },
          ],
        },
      },
      type: "measurement",
      measurement: {
        type: "saturation",
        unit: "%",
        value: 98,
      },
    },

    {
      timestamp: "2015-06-09T13:43:17.000+02:00",
      origin: {
        device_measurement: {
          connection_type: "USB",
          manufacturer: "ACME Inc",
          firmware_version: "5-t",
          model: "ABC-1234",
          primary_device_identifier: {
            serial_number: "1234-555",
          },
          additional_device_identifiers: [
            {
              other: {
                description: "eui_64",
                value: "1234567890",
              },
            },
          ],
        },
      },
      type: "measurement",
      measurement: {
        type: "pulse",
        unit: "bpm",
        value: 80,
      },
    },

    {
      timestamp: "2015-06-09T13:43:19.000+02:00",
      type: "status",
      status: {
        type: "info",
        message: "SATURATION_DISCONNECTED",
      },
    },
  ];

  spirometerEvents = [
    {
      timestamp: "2015-06-09T13:43:13.000+02:00",
      type: "status",
      status: {
        type: "info",
        message: "CONNECTING",
      },
    },

    {
      timestamp: "2015-06-09T13:43:15.000+02:00",
      type: "status",
      status: {
        type: "info",
        message: "CONNECTED",
      },
    },

    {
      timestamp: "2015-06-09T13:43:17.000+02:00",
      origin: {
        device_measurement: {
          connection_type: "USB",
          manufacturer: "ACME Inc",
          firmware_version: "5-t",
          model: "ABC-1234",
          primary_device_identifier: {
            serial_number: "1234-555",
          },
          additional_device_identifiers: [
            {
              other: {
                description: "eui_64",
                value: "1234567890",
              },
            },
          ],
        },
      },
      type: "measurement",
      measurement: {
        type: "fev1",
        unit: "L",
        value: 3.5,
      },
    },

    {
      timestamp: "2015-06-09T13:43:17.000+02:00",
      origin: {
        device_measurement: {
          connection_type: "USB",
          manufacturer: "ACME Inc",
          firmware_version: "5-t",
          model: "ABC-1234",
          primary_device_identifier: {
            serial_number: "1234-555",
          },
          additional_device_identifiers: [
            {
              other: {
                description: "eui_64",
                value: "1234567890",
              },
            },
          ],
        },
      },
      type: "measurement",
      measurement: {
        type: "fev6",
        unit: "L",
        value: 3.2,
      },
    },

    {
      timestamp: "2015-06-09T13:43:17.000+02:00",
      origin: {
        device_measurement: {
          connection_type: "USB",
          manufacturer: "ACME Inc",
          firmware_version: "5-t",
          model: "ABC-1234",
          primary_device_identifier: {
            serial_number: "1234-555",
          },
          additional_device_identifiers: [
            {
              other: {
                description: "eui_64",
                value: "1234567890",
              },
            },
          ],
        },
      },
      type: "measurement",
      measurement: {
        type: "fev1/fev6",
        unit: "%",
        value: 80.5,
      },
    },

    {
      timestamp: "2015-06-09T13:43:17.000+02:00",
      origin: {
        device_measurement: {
          connection_type: "USB",
          manufacturer: "ACME Inc",
          firmware_version: "5-t",
          model: "ABC-1234",
          primary_device_identifier: {
            serial_number: "1234-555",
          },
          additional_device_identifiers: [
            {
              other: {
                description: "eui_64",
                value: "1234567890",
              },
            },
          ],
        },
      },
      type: "measurement",
      measurement: {
        type: "fef25-75%",
        unit: "L/s",
        value: 4.4,
      },
    },

    {
      timestamp: "2015-06-09T13:43:19.000+02:00",
      type: "status",
      status: {
        type: "info",
        message: "DISCONNECTED",
      },
    },
  ];

  activityEvents = [
    {
      timestamp: "2019-05-27T11:55:58+02:00",
      type: "status",
      status: {
        type: "info",
        message: "CONNECTING",
      },
    },

    {
      timestamp: "2019-05-27T11:55:58+02:00",
      type: "status",
      status: {
        type: "info",
        message: "CONNECTED",
      },
    },

    {
      timestamp: "2019-05-27T11:55:58+02:00",
      type: "status",
      status: {
        type: "progress",
        progress: 20,
      },
    },

    {
      timestamp: "2019-05-27T11:55:58+02:00",
      type: "status",
      status: {
        type: "progress",
        progress: 40,
      },
    },

    {
      timestamp: "2019-05-27T11:55:58+02:00",
      type: "status",
      status: {
        type: "progress",
        progress: 60,
      },
    },

    {
      timestamp: "2019-05-27T11:55:58+02:00",
      type: "status",
      status: {
        type: "progress",
        progress: 80,
      },
    },

    {
      timestamp: "2019-05-27T11:55:58+02:00",
      type: "status",
      status: {
        type: "progress",
        progress: 100,
      },
    },

    {
      timestamp: "2019-05-27T11:55:58+02:00",
      origin: {
        device_measurement: {
          connection_type: "USB",
          manufacturer: "ACME Inc",
          firmware_version: "5-t",
          model: "ABC-1234",
          primary_device_identifier: {
            serial_number: "1234-555",
          },
          additional_device_identifiers: [
            {
              other: {
                description: "eui_64",
                value: "1234567890",
              },
            },
          ],
        },
      },
      type: "measurement",
      measurement: {
        type: "dailySteps",
        unit: "step count",
        value: 9654,
      },
    },

    {
      timestamp: "2019-05-27T11:55:58+02:00",
      origin: {
        device_measurement: {
          connection_type: "USB",
          manufacturer: "ACME Inc",
          firmware_version: "5-t",
          model: "ABC-1234",
          primary_device_identifier: {
            serial_number: "1234-555",
          },
          additional_device_identifiers: [
            {
              other: {
                description: "eui_64",
                value: "1234567890",
              },
            },
          ],
        },
      },
      type: "measurement",
      measurement: {
        type: "dailyStepsWeeklyAverage",
        unit: "step count",
        value: 5782,
      },
    },

    {
      timestamp: "2015-06-09T13:43:17.000+02:00",
      origin: {
        device_measurement: {
          connection_type: "USB",
          manufacturer: "ACME Inc",
          firmware_version: "5-t",
          model: "ABC-1234",
          primary_device_identifier: {
            serial_number: "1234-555",
          },
          additional_device_identifiers: [
            {
              other: {
                description: "eui_64",
                value: "1234567890",
              },
            },
          ],
        },
      },
      type: "measurement",
      measurement: {
        type: "dailyStepsHistoricalMeasurements",
        unit: "step count",
        value: [
          {
            result: 4820,
            timeOfMeasurement: "2019-05-25T00:00:00Z",
          },

          {
            result: 9124,
            timeOfMeasurement: "2019-05-24T00:00:00Z",
          },

          {
            result: 12361,
            timeOfMeasurement: "2019-05-23T00:00:00Z",
          },

          {
            result: 7343,
            timeOfMeasurement: "2019-05-22T00:00:00Z",
          },

          {
            result: 2314,
            timeOfMeasurement: "2019-05-21T00:00:00Z",
          },

          {
            result: 10322,
            timeOfMeasurement: "2019-05-20T00:00:00Z",
          },
        ],
      },
    },

    {
      timestamp: "2019-05-20T00:00:00Z",
      type: "status",
      status: {
        type: "info",
        message: "DISCONNECTED",
      },
    },
  ];

  bloodSugarEvents = [
    {
      timestamp: "Wed Mar 16 10:03:34 GMT+01:00 2016",
      type: "status",
      status: {
        type: "info",
        message: "CONNECTING_MYGLUCOHEALTH",
      },
    },

    {
      timestamp: "Wed Mar 16 10:03:38 GMT+01:00 2016",
      type: "status",
      status: {
        type: "info",
        message: "CONNECTED",
      },
    },

    {
      timestamp: "Wed Mar 16 10:03:40 GMT+01:00 2016",
      origin: {
        device_measurement: {
          connection_type: "bluetooth_spp",
          manufacturer: "Entra Health Systems / MyGlucohealth",
          model: "myglucohealth",

          primary_device_identifier: {
            serial_number: "1080853849",
          },

          additional_device_identifiers: [
            {
              mac_address: "00:13:7B:59:C4:8D",
            },
          ],
        },
      },

      type: "measurement",
      measurement: {
        type: "blood sugar",
        unit: "mmol/L",
        value: {
          measurements: [
            {
              result: 5.11,
              timeOfMeasurement: "2016-03-09T15:11:00Z",
              isAfterMeal: true,
              isBeforeMeal: false,
            },

            {
              result: 4.94,
              timeOfMeasurement: "2016-03-09T15:09:00Z",
              isAfterMeal: false,
              isBeforeMeal: true,
            },

            {
              result: 5.66,
              timeOfMeasurement: "2016-03-04T10:14:00Z",
              isAfterMeal: false,
              isBeforeMeal: false,
            },

            {
              result: 5.49,
              timeOfMeasurement: "2016-03-04T10:14:00Z",
              isAfterMeal: false,
              isBeforeMeal: false,
            },

            {
              result: null,
              timeOfMeasurement: "2016-03-04T10:13:00Z",
              isAfterMeal: true,
              isBeforeMeal: false,
            },

            {
              result: 5.11,
              timeOfMeasurement: "2016-03-04T10:12:00Z",
              isAfterMeal: false,
              isBeforeMeal: true,
            },

            {
              result: 4.5,
              timeOfMeasurement: "2016-03-01T13:11:00Z",
              isAfterMeal: true,
              isBeforeMeal: false,
            },
          ],

          transferTime: "2016-03-16T10:03:40Z",
        },
      },
    },

    {
      timestamp: "Wed Mar 16 10:03:40 GMT+01:00 2016",
      type: "status",
      status: {
        type: "info",
        message: "DISCONNECTED",
      },
    },
  ];

  ecgSampleTimeInMinutes = 0.5;
  ecgEvents = [
    {
      timestamp: "Wed Mar 16 10:03:34 GMT+01:00 2016",
      type: "status",
      status: {
        type: "info",
        message: "CONNECTING",
      },
    },

    {
      timestamp: "Wed Mar 16 10:03:38 GMT+01:00 2016",
      type: "status",
      status: {
        type: "info",
        message: "CONNECTED",
      },
    },

    {
      timestamp: "2015-06-09T13:43:19.000+02:00",
      type: "status",
      status: {
        type: "progress",
        progress: this.ecgSampleTimeInMinutes * 10,
      },
    },

    {
      timestamp: "2015-06-09T13:43:20.000+02:00",
      type: "status",
      status: {
        type: "progress",
        progress: this.ecgSampleTimeInMinutes * 20,
      },
    },

    {
      timestamp: "2015-06-09T13:43:21.000+02:00",
      type: "status",
      status: {
        type: "progress",
        progress: this.ecgSampleTimeInMinutes * 30,
      },
    },

    {
      timestamp: "2015-06-09T13:43:22.000+02:00",
      type: "status",
      status: {
        type: "progress",
        progress: this.ecgSampleTimeInMinutes * 40,
      },
    },

    {
      timestamp: "2015-06-09T13:43:23.000+02:00",
      type: "status",
      status: {
        type: "progress",
        progress: this.ecgSampleTimeInMinutes * 50,
      },
    },

    {
      timestamp: "2015-06-09T13:43:24.000+02:00",
      type: "status",
      status: {
        type: "progress",
        progress: this.ecgSampleTimeInMinutes * 60,
      },
    },

    {
      timestamp: "2015-06-09T13:43:25.000+02:00",

      origin: {
        deviceMeasurement: {
          connectionType: "bluetooth_spp",
          manufacturer: "Faros",
          model: "360",

          primaryDeviceIdentifier: {
            macAddress: "00:13:7B:59:C4:8D",
          },

          additionalDeviceIdentifiers: [
            {
              firmwareVersion: "1.0.0.0",
            },
          ],
        },
      },

      type: "measurement",
      measurement: {
        type: "ecg",
        unit: "mV",
        value: {
          startTime: "2022-03-16T14:01:24.000+02:00",
          duration: {
            unit: "s",
            value: 30,
          },
          frequency: {
            unit: "Hz",
            value: 500,
          },
          rrIntervals: {
            unit: "ms",
            value: Array.from(
              { length: this.ecgSampleTimeInMinutes * 60 },
              () => Math.round(Math.random() * 100)
            ),
          },
          samples: {
            unit: "mV",
            channels: [
              {
                channel: 1,
                data: Array.from(
                  { length: this.ecgSampleTimeInMinutes * 60 * 500 },
                  () =>
                    (Math.round(Math.random() * 5000) / 1000) *
                    (Math.random() > 0.5 ? -1 : 1)
                ),
              },
            ],
          },
        },
      },
    },

    {
      timestamp: "Wed Mar 16 10:03:38 GMT+01:00 2016",
      type: "status",
      status: {
        type: "info",
        message: "DISCONNECTED",
      },
    },
  ];

  // const openUrl = (url: string) => ($window.location.href = url);
  openUrl = (url: string) => (globalThis.location.href = url);

  joinConference = (_message: object) => {
    const events = [
      {
        timestamp: "2015-05-11T12:33:03.000+02:00",
        type: "status",
        status: {
          type: "info",
          message: "CONFERENCE_STARTED",
        },
      },
      {
        timestamp: "2015-05-11T12:33:13.000+02:00",
        type: "status",
        status: {
          type: "info",
          message: "CONFERENCE_ENDED",
        },
      },
    ];

    setTimeout(() => {
      const event = events[0];
      this.sendMessageToWebView({
        messageType: "videoConferenceResponse",
        event: event,
      });
    }, 1000);

    setTimeout(() => {
      const event = events[1];
      this.sendMessageToWebView({
        messageType: "videoConferenceResponse",
        event: event,
      });
    }, 30000);
  };

  addDeviceListener = (meterType: string, parameters: any) => {
    let events: any = [];

    switch (meterType) {
      case "weight scale":
        events = this.weightEvents;
        break;

      case "activity tracker":
        events = this.activityEvents;
        break;

      case "thermometer":
        events = this.temperatureEvents;
        break;

      case "blood pressure monitor":
        events = this.bloodPressureEvents;
        break;

      case "oximeter":
        events = this.saturationEvents;
        break;

      case "spirometer":
        events = this.spirometerEvents;
        break;

      case "glucometer":
        events = this.bloodSugarEvents;
        break;

      case "ecg":
        events = this.ecgEvents;
        break;

      default:
        console.debug(`Unknown meter type: ${meterType}`);
        return;
    }

    let i = 0;
    const eventInterval = setInterval(() => {
      if (i >= events.length) {
        clearInterval(eventInterval);
        return;
      }

      const event = events[i];
      i++;

      console.log("FakeNative: Sending deviceMeasurementResponse()");
      this.sendMessageToWebView({
        messageType: "deviceMeasurementResponse",
        meterType: meterType,
        event: event,
      });
    }, 1000);
  };

  sendLogMessagesToWebView = () => {
    setTimeout(() => {
      this.sendMessageToWebView({
        messageType: "logMessagesReady",
        entries: [
          {
            level: "info",
            message: "Info message from native layer",
            timetamp: new Date().toISOString(),
          },
          {
            level: "warn",
            message: "Warn message from native layer",
            timestamp: new Date().toISOString(),
          },
        ],
      });
    }, 5000);
  };

  sendMessageToWebView = (message: object) =>
    // @ts-ignore
    globalThis.sendMessageToWebView(JSON.stringify(message));
}
