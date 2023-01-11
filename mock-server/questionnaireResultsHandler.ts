import { username } from './utils';

// Data

const questionnaireResultsList = (baseUrl: any) => {
  return {
    results: [
      {
        name: 'Blood pressure and pulse',
        severity: 'red',
        acknowledged: false,
        resultDate: '2016-03-29T10:30:00.000+02:00',
        links: {
          patient: `${baseUrl}/clinician/api/patients/me`,
          questionnaire: `${baseUrl}/clinician/api/questionnaires/28`,
          questionnaireResult: `${baseUrl}/clinician/api/patients/me/questionnaire-results/1`,
        },
      },
      {
        name: 'Saturation',
        severity: 'green',
        acknowledged: true,
        resultDate: '2016-03-28T00:20:47.903+02:00',
        links: {
          patient: `${baseUrl}/clinician/api/patients/me`,
          questionnaire: `${baseUrl}/clinician/api/questionnaires/29`,
          questionnaireResult: `${baseUrl}/clinician/api/patients/me/questionnaire-results/2`,
        },
      },
      {
        name: 'Weight',
        severity: 'yellow',
        acknowledged: true,
        resultDate: '2016-03-23T08:15:00.000+01:00',
        links: {
          patient: `${baseUrl}/clinician/api/patients/me`,
          questionnaire: `${baseUrl}/clinician/api/questionnaires/30`,
          questionnaireResult: `${baseUrl}/clinician/api/patients/me/questionnaire-results/3`,
        },
      },
      {
        name: 'Blood sugar',
        severity: 'red',
        acknowledged: false,
        resultDate: '2016-03-22T11:35:00.000+01:00',
        links: {
          patient: `${baseUrl}/clinician/api/patients/me`,
          questionnaire: `${baseUrl}/clinician/api/questionnaires/31`,
          questionnaireResult: `${baseUrl}/clinician/api/patients/me/questionnaire-results/4`,
        },
      },
      {
        name: 'Spirometry',
        severity: 'yellow',
        acknowledged: false,
        resultDate: '2016-03-21T07:10:00.000+01:00',
        links: {
          patient: `${baseUrl}/clinician/api/patients/me`,
          questionnaire: `${baseUrl}/clinician/api/questionnaires/32`,
          questionnaireResult: `${baseUrl}/clinician/api/patients/me/questionnaire-results/5`,
        },
      },
    ],
    total: 200,
    max: 5,
    offset: 0,
    links: {
      self: `${baseUrl}/clinician/api/patients/me/questionnaire-results?offset=0&max=5`,
    },
  };
};

const questionnaireResultOne = (baseUrl: any) => {
  return {
    name: 'Blood pressure and pulse',
    severity: 'yellow',
    resultDate: '2016-03-29T10:30:00.000+02:00',
    questions: [
      {
        patientText: 'Are you feeling well?',
        text: 'Feeling well',
        reply: {
          answer: 'No',
        },
      },
      {
        patientText: 'Measure your blood pressure',
        text: 'Blood pressure',
        severity: 'yellow',
        reply: {
          measurements: [
            {
              timestamp: '2016-03-29T10:30:00.000+02:00',
              type: 'blood_pressure',
              measurement: {
                unit: 'mmHg',
                systolic: 129,
                diastolic: 80,
              },
              origin: {
                manual_measurement: {
                  entered_by: 'citizen',
                },
              },
              links: {
                measurement: `${baseUrl}/clinician/api/patients/me/measurements/1`,
              },
            },
          ],
        },
      },
    ],
    links: {
      questionnaire: `${baseUrl}/clinician/api/questionnaires/28`,
      patient: `${baseUrl}/clinician/api/patients/me`,
      self: `${baseUrl}/clinician/api/patients/me/questionnaire-results/1`,
    },
  };
};

const questionnaireResultTwo = (baseUrl: any) => {
  return {
    name: 'Saturation',
    severity: 'green',
    resultDate: '2016-03-28T09:45:00.000+02:00',
    acknowledgement: {
      by: {
        firstName: 'Helle',
        lastName: 'Andersen',
        email: 'helle@andersen',
        links: {
          clinician: `${baseUrl}/clinician/api/clinicians/2`,
        },
      },
      note: 'some note',
      date: '2016-03-29:12:30.000+02:00',
      visibleForPatient: false,
    },
    questions: [
      {
        patientText: 'Are you feeling well?',
        text: 'Feeling well',
        reply: {
          answer: 'Yes',
        },
      },
      {
        patientText: 'Measure your saturation',
        text: 'Saturation',
        severity: 'green',
        reply: {
          measurements: [
            {
              timestamp: '2016-03-23T09:45:00.000+02:00',
              type: 'saturation',
              measurement: {
                unit: '%',
                value: 98,
              },
              origin: {
                manual_measurement: {
                  entered_by: 'citizen',
                },
              },
              links: {
                measurement: `${baseUrl}/clinician/api/patients/me/measurements/2`,
              },
            },
            {
              timestamp: '2016-03-23T09:45:00.000+02:00',
              type: 'pulse',
              severity: 'green',
              measurement: {
                unit: 'BPM',
                value: 54,
              },
              origin: {
                manual_measurement: {
                  entered_by: 'citizen',
                },
              },
              links: {
                measurement: `${baseUrl}/clinician/api/patients/me/measurements/3`,
              },
            },
          ],
        },
      },
    ],
    links: {
      questionnaire: `${baseUrl}/clinician/api/questionnaires/29`,
      patient: `${baseUrl}/clinician/api/patients/me`,
      self: `${baseUrl}/clinician/api/patients/me/questionnaire-results/2`,
    },
  };
};

const questionnaireResultThree = (baseUrl: any) => {
  return {
    name: 'Weight',
    severity: 'red',
    resultDate: '2016-03-23T08:15:00.000+02:00',
    acknowledgement: {
      by: {
        firstName: 'Helle',
        lastName: 'Andersen',
        email: 'helle@andersen',
        links: {
          clinician: `${baseUrl}/clinician/api/clinicians/2`,
        },
      },
      note: 'some note',
      date: '2016-03-24:15:00.000+02:00',
      visibleForPatient: true,
    },
    questions: [
      {
        patientText: 'Are you feeling well?',
        text: 'Feeling well',
        reply: {
          answer: 'Yes',
        },
      },
      {
        patientText: 'Measure your weight',
        text: 'Weight',
        severity: 'red',
        reply: {
          measurements: [
            {
              timestamp: '2016-03-23T08:15:00.000+02:00',
              type: 'weight',
              measurement: {
                unit: 'kg',
                value: 100,
              },
              origin: {
                manual_measurement: {
                  entered_by: 'citizen',
                },
              },
              links: {
                measurement: `${baseUrl}/clinician/api/patients/me/measurements/4`,
              },
            },
          ],
        },
      },
    ],
    links: {
      questionnaire: `${baseUrl}/clinician/api/questionnaires/30`,
      patient: `${baseUrl}/clinician/api/patients/me`,
      self: `${baseUrl}/clinician/api/patients/me/questionnaire-results/3`,
    },
  };
};

const questionnaireResultFour = (baseUrl: any) => {
  return {
    name: 'Blood sugar',
    severity: 'red',
    resultDate: '2016-03-22T10:30:00.000+02:00',
    questions: [
      {
        patientText: 'Are you ready for taking your blood sugar?',
        text: 'Ready',
        reply: {
          answer: 'Yes',
        },
      },
      {
        patientText: 'Measure your blood sugar',
        text: 'Blood sugar',
        severity: 'red',
        comment: "I couldn't stop eating cake",
        reply: {
          measurements: [
            {
              timestamp: '2016-03-29T10:30:00.000+02:00',
              type: 'bloodsugar',
              measurement: {
                unit: 'mmol/L',
                value: 12.4,
                isAfterMeal: true,
              },
              origin: {
                manual_measurement: {
                  entered_by: 'citizen',
                },
              },
              links: {
                measurement: `${baseUrl}/clinician/api/patients/me/measurements/5`,
              },
            },
          ],
        },
      },
    ],
    links: {
      questionnaire: `${baseUrl}/clinician/api/questionnaires/31`,
      patient: `${baseUrl}/clinician/api/patients/me`,
      self: `${baseUrl}/clinician/api/patients/me/questionnaire-results/4`,
    },
  };
};

const questionnaireResultFive = (baseUrl: any) => {
  return {
    name: 'Spirometry',
    severity: 'yellow',
    resultDate: '2016-03-21T10:30:00.000+02:00',
    questions: [
      {
        patientText: 'Do you have lungs?',
        text: 'Lungs',
        reply: {
          answer: 'No',
        },
      },
      {
        patientText: 'Measure your spirometry values',
        text: 'Spirometry',
        severity: 'yellow',
        reply: {
          measurements: [
            {
              timestamp: '2016-03-21T10:30:00.000+02:00',
              type: 'fev1',
              measurement: {
                unit: 'L',
                value: 3.2,
              },
              origin: {
                manual_measurement: {
                  entered_by: 'citizen',
                },
              },
              links: {
                measurement: `${baseUrl}/clinician/api/patients/me/measurements/6`,
              },
            },
            {
              timestamp: '2016-03-21T10:30:00.000+02:00',
              type: 'fev6',
              measurement: {
                unit: 'L',
                value: 2.7,
              },
              origin: {
                manual_measurement: {
                  entered_by: 'citizen',
                },
              },
              links: {
                measurement: `${baseUrl}/clinician/api/patients/me/measurements/7`,
              },
            },
            {
              timestamp: '2016-03-21T10:30:00.000+02:00',
              type: 'fev1/fev6',
              measurement: {
                unit: '%',
                value: 85,
              },
              origin: {
                manual_measurement: {
                  entered_by: 'citizen',
                },
              },
              links: {
                measurement: `${baseUrl}/clinician/api/patients/me/measurements/8`,
              },
            },
            {
              timestamp: '2016-03-21T10:30:00.000+02:00',
              type: 'fef25-75%',
              measurement: {
                unit: 'L/s',
                value: 3.2,
              },
              origin: {
                manual_measurement: {
                  entered_by: 'citizen',
                },
              },
              links: {
                measurement: `${baseUrl}/clinician/api/patients/me/measurements/9`,
              },
            },
          ],
        },
      },
    ],
    links: {
      questionnaire: `${baseUrl}/clinician/api/questionnaires/31`,
      patient: `${baseUrl}/clinician/api/patients/me`,
      self: `${baseUrl}/clinician/api/patients/me/questionnaire-results/4`,
    },
  };
};

// API

export const list = (req: any, res: any, baseUrl: any) => {
  const _username = username(req);
  console.log(`Questionnaire results list requested from: ${_username}`);
  res.send(questionnaireResultsList(baseUrl));
};

export const get = (req: any, res: any, baseUrl: any) => {
  const questionnaireResultId = parseInt(req.params.id);
  console.log(`Questionnaire result id ${questionnaireResultId}`);

  switch (questionnaireResultId) {
    case 1:
      res.send(questionnaireResultOne(baseUrl));
      break;

    case 2:
      res.send(questionnaireResultTwo(baseUrl));
      break;

    case 3:
      res.send(questionnaireResultThree(baseUrl));
      break;

    case 4:
      res.send(questionnaireResultFour(baseUrl));
      break;

    case 5:
      res.send(questionnaireResultFive(baseUrl));
      break;

    default:
      res.send(404);
      break;
  }
};
