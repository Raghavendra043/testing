import { username } from './utils';
import { getBloodSugarManual } from './questionnaires/bloodSugarManual';
import { getBloodSugar } from './questionnaires/bloodSugar';
import { getBloodPressureManual } from './questionnaires/bloodPressureManual';
import { getBloodPressure } from './questionnaires/bloodPressure';
import { getPainScaleManual } from './questionnaires/painScaleManual';
import { getWeightManual } from './questionnaires/weightManual';
import { getWeight } from './questionnaires/weight';
import { getDelayManual } from './questionnaires/delayManual';
import { getInputManual } from './questionnaires/inputManual';
import { getActivity } from './questionnaires/activity';
import { getSaturation } from './questionnaires/saturation';
import { getSpirometry } from './questionnaires/spirometry';
import { getTemperature } from './questionnaires/temperature';
import { getEcg } from './questionnaires/ecg';
import { getMultipleChoiceWithBranch } from './questionnaires/multipleChoiceWithBranch';
import { getMultipleChoiceWithSummationAndBranch } from './questionnaires/multipleChoiceWithSummationAndBranch';
import { getAllManualMeasurements } from './questionnaires/allManualMeasurements';
import { getAllAutomaticMeasurements } from './questionnaires/allAutomaticMeasurements';
import { getOxygenFlowManual } from './questionnaires/oxygenFlowManual';
// Data

const questionnairesList = (baseUrl: any) => {
  return {
    results: [
      {
        name: 'Blood sugar (manual) with help text',
        version: '1.0',
        links: {
          questionnaire: `${baseUrl}/clinician/api/patients/me/questionnaires/1`,
        },
      },
      {
        name: 'Blood sugar (automatic)',
        version: '1.0',
        links: {
          questionnaire: `${baseUrl}/clinician/api/patients/me/questionnaires/2`,
        },
      },
      {
        name: 'Blood pressure (manual)',
        version: '1.0',
        links: {
          questionnaire: `${baseUrl}/clinician/api/patients/me/questionnaires/3`,
        },
      },
      {
        name: 'Blood pressure (automatic)',
        version: '1.0',
        links: {
          questionnaire: `${baseUrl}/clinician/api/patients/me/questionnaires/4`,
        },
      },
      {
        name: 'Pain scale (manual)',
        version: '1.0',
        links: {
          questionnaire: `${baseUrl}/clinician/api/patients/me/questionnaires/5`,
        },
      },
      {
        name: 'Weight (manual with branching)',
        version: '1.0',
        links: {
          questionnaire: `${baseUrl}/clinician/api/patients/me/questionnaires/6`,
        },
      },
      {
        name: 'Weight (automatic)',
        version: '1.0',
        links: {
          questionnaire: `${baseUrl}/clinician/api/patients/me/questionnaires/7`,
        },
      },
      {
        name: 'Delay (manual)',
        version: '1.0',
        links: {
          questionnaire: `${baseUrl}/clinician/api/patients/me/questionnaires/8`,
        },
      },
      {
        name: 'Input (manual)',
        version: '1.0',
        links: {
          questionnaire: `${baseUrl}/clinician/api/patients/me/questionnaires/9`,
        },
      },
      {
        name: 'Activity (automatic)',
        version: '1.0',
        links: {
          questionnaire: `${baseUrl}/clinician/api/patients/me/questionnaires/10`,
        },
      },
      {
        name: 'Saturation (automatic)',
        version: '1.0',
        links: {
          questionnaire: `${baseUrl}/clinician/api/patients/me/questionnaires/11`,
        },
      },
      {
        name: 'Spirometry (automatic)',
        version: '1.0',
        links: {
          questionnaire: `${baseUrl}/clinician/api/patients/me/questionnaires/12`,
        },
      },
      {
        name: 'Temperature (automatic)',
        version: '1.0',
        links: {
          questionnaire: `${baseUrl}/clinician/api/patients/me/questionnaires/13`,
        },
      },
      {
        name: 'ECG (automatic)',
        version: '1.0',
        links: {
          questionnaire: `${baseUrl}/clinician/api/patients/me/questionnaires/14`,
        },
      },
      {
        name: 'Multiple Choice (with branching)',
        version: '1.0',
        links: {
          questionnaire: `${baseUrl}/clinician/api/patients/me/questionnaires/16`,
        },
      },
      {
        name: 'Multiple Choice (with summation and branching)',
        version: '1.0',
        links: {
          questionnaire: `${baseUrl}/clinician/api/patients/me/questionnaires/17`,
        },
      },
      {
        name: 'All manual measurements',
        version: '1.0',
        links: {
          questionnaire: `${baseUrl}/clinician/api/patients/me/questionnaires/18`,
        },
      },
      {
        name: 'All automatic measurements',
        version: '1.0',
        links: {
          questionnaire: `${baseUrl}/clinician/api/patients/me/questionnaires/19`,
        },
      },
      {
        name: 'Oxygen Flow Manual',
        version: '1.0',
        links: {
          questionnaire: `${baseUrl}/clinician/api/patients/me/questionnaires/20`,
        },
      },
    ],
  };
};

// API

export const list = (req: any, res: any, baseUrl: any) => {
  const _username = username(req);
  console.log(`Questionnaire list requested from: ${_username}`);

  if (_username === 'measurements401') {
    console.log('User no longer authenticated. Returning 401.');
    res.status(401).end();
    return;
  }

  if (_username === 'measurements500') {
    console.log('Simulation server error. Returning 500.');
    res.status(500).end();
    return;
  }

  console.log('Questionnaires returned');
  res.send(questionnairesList(baseUrl));
};

export const get = (req: any, res: any, baseUrl: any) => {
  const questionnaireId = req.params.id;
  console.log(`Questionnaire id ${questionnaireId}`);
  switch (questionnaireId) {
    case '1':
      res.send(getBloodSugarManual(baseUrl));
      break;
    case '2':
      res.send(getBloodSugar(baseUrl));
      break;
    case '3':
      res.send(getBloodPressureManual(baseUrl));
      break;
    case '4':
      res.send(getBloodPressure(baseUrl));
      break;
    case '5':
      res.send(getPainScaleManual(baseUrl));
      break;
    case '6':
      res.send(getWeightManual(baseUrl));
      break;
    case '7':
      res.send(getWeight(baseUrl));
      break;
    case '8':
      res.send(getDelayManual(baseUrl));
      break;
    case '9':
      res.send(getInputManual(baseUrl));
      break;
    case '10':
      res.send(getActivity(baseUrl));
      break;
    case '11':
      res.send(getSaturation(baseUrl));
      break;
    case '12':
      res.send(getSpirometry(baseUrl));
      break;
    case '13':
      res.send(getTemperature(baseUrl));
      break;
    case '14':
      res.send(getEcg(baseUrl));
      break;
    case '16':
      res.send(getMultipleChoiceWithBranch(baseUrl));
      break;
    case '17':
      res.send(getMultipleChoiceWithSummationAndBranch(baseUrl));
      break;
    case '18':
      res.send(getAllManualMeasurements(baseUrl));
      break;
    case '19':
      res.send(getAllAutomaticMeasurements(baseUrl));
      break;
    case '20':
      res.send(getOxygenFlowManual(baseUrl));
      break;
    default:
      res.status(404).end();
  }
};

let retryCount = 0;
export const upload = (req: any, res: any) => {
  const _username = username(req);
  if (_username === 'uploadfails' && retryCount < 2) {
    retryCount += 1;
    res.status(500).end();
    return;
  }

  retryCount = 0;
  res.status(200).end();
};
