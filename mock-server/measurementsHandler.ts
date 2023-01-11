import { username } from './utils';
import { getBloodPressure } from './measurements/blood_pressure';
import { getBloodSugar } from './measurements/bloodsugar';
import { getBodyCellMass } from './measurements/body_cell_mass';
import { getCrp } from './measurements/crp';
import { getDailySteps } from './measurements/daily_steps';
import { getDuration } from './measurements/duration';
import { getFatMass } from './measurements/fat_mass';
import { getFef } from './measurements/fef25-75%';
import { getFev1_6 } from './measurements/fev1-fev6';
import { getFev1 } from './measurements/fev1';
import { getFev1Percentage } from './measurements/fev1%';
import { getFev6 } from './measurements/fev6';
import { getFev6Percentage } from './measurements/fev6%';
import { getGlucoseInUrine } from './measurements/glucose_in_urine';
import { getHemoglobin } from './measurements/hemoglobin';
import { getLeukocytesInUrine } from './measurements/leukocytes_in_urine';
import { getPainScale } from './measurements/pain_scale';
import { getPhaseAngle } from './measurements/phase_angle';
import { getProteinInUrine } from './measurements/protein_in_urine';
import { getPulse } from './measurements/pulse';
import { getSaturation } from './measurements/saturation';
import { getTemperature } from './measurements/temperature';
import { getWeight } from './measurements/weight';

// Data
type MeasurementTypeName =
  | 'weight'
  | 'daily_steps'
  | 'pulse'
  | 'temperature'
  | 'pain_scale'
  | 'protein_in_urine'
  | 'leukocytes_in_urine'
  | 'glucose_in_urine'
  | 'hemoglobin'
  | 'saturation'
  | 'crp'
  | 'fev1'
  | 'fev6'
  | 'fev1/fev6'
  | 'fef25-75%'
  | 'fev1%'
  | 'fev6%'
  | 'duration'
  | 'blood_pressure'
  | 'bloodsugar'
  | 'body_cell_mass'
  | 'fat_mass'
  | 'phase_angle';

const measurementsList = (baseUrl: any) => {
  const types: MeasurementTypeName[] = [
    'weight',
    'daily_steps',
    'pulse',
    'temperature',
    'pain_scale',
    'protein_in_urine',
    'leukocytes_in_urine',
    'glucose_in_urine',
    'hemoglobin',
    'saturation',
    'crp',
    'fev1',
    'fev6',
    'fev1/fev6',
    'fef25-75%',
    'fev1%',
    'fev6%',
    'duration',
    'blood_pressure',
    'bloodsugar',
    'body_cell_mass',
    'fat_mass',
    'phase_angle',
  ];

  return {
    measurements: types.map((typeName) => {
      return {
        name: typeName,
        links: {
          measurements: `${baseUrl}/clinician/api/patients/me/measurements?type=${typeName}`,
        },
      };
    }),
  };
};

// API

export const listTypes = (req: any, res: any, baseUrl: any) => {
  const _username = username(req);
  console.log(`Measurements list requested from: ${_username}`);

  if (_username === 'measurementsNoMeasurements') {
    console.log('Empty measurements list returned.');
    res.send({
      measurements: [],
    });
    return;
  }

  if (_username === 'rene') {
    res.send({
      links: {
        self: `${baseUrl}/clinician/api/patients/me/measurement-types`,
      },
      measurements: [
        {
          name: 'blood_pressure',
          links: {
            measurements:
              `${baseUrl}/clinician/api/patients/me/measurements` +
              `?type=blood_pressure&from=2014-11-04&to=2014-11-11`,
          },
        },
      ],
    });
    return;
  }

  console.log('Measurements returned.');
  res.send(measurementsList(baseUrl));
};

const filterData = (from: any, data: any) => {
  const weekTime = 1000 * 60 * 60 * 24 * 7;
  let filterDate = new Date(new Date().getTime() - weekTime);

  if (from !== undefined) {
    filterDate = new Date(from);
  }

  let measurements = data.results;
  const links = data.links;

  measurements = measurements.filter((measurement: any) => {
    const measurementDate = new Date(measurement.timestamp);
    return measurementDate > filterDate;
  });

  if (measurements.length == 0) {
    delete links.next;
  }

  return {
    results: measurements,
    links: links,
  };
};

export const list = (req: any, res: any, baseUrl: any) => {
  const type: measurementTypes = req.query.type;
  const from = req.query.from;
  let data: any;
  switch (type) {
    case 'blood_pressure':
      data = getBloodPressure(baseUrl);
      break;
    case 'bloodsugar':
      data = getBloodSugar(baseUrl);
      break;
    case 'body_cell_mass':
      data = getBodyCellMass(baseUrl);
      break;
    case 'crp':
      data = getCrp(baseUrl);
      break;
    case 'daily_steps':
      data = getDailySteps(baseUrl);
      break;
    case 'duration':
      data = getDuration(baseUrl);
      break;
    case 'fat_mass':
      data = getFatMass(baseUrl);
      break;
    case 'fef25-75%':
      data = getFef(baseUrl);
      break;
    case 'fev1/fev6':
      data = getFev1_6(baseUrl);
      break;
    case 'fev1':
      data = getFev1(baseUrl);
      break;
    case 'fev1%':
      data = getFev1Percentage(baseUrl);
      break;
    case 'fev6':
      data = getFev6(baseUrl);
      break;
    case 'fev6%':
      data = getFev6Percentage(baseUrl);
      break;
    case 'glucose_in_urine':
      data = getGlucoseInUrine(baseUrl);
      break;
    case 'hemoglobin':
      data = getHemoglobin(baseUrl);
      break;
    case 'leukocytes_in_urine':
      data = getLeukocytesInUrine(baseUrl);
      break;
    case 'pain_scale':
      data = getPainScale(baseUrl);
      break;
    case 'phase_angle':
      data = getPhaseAngle(baseUrl);
      break;
    case 'protein_in_urine':
      data = getProteinInUrine(baseUrl);
      break;
    case 'pulse':
      data = getPulse(baseUrl);
      break;
    case 'saturation':
      data = getSaturation(baseUrl);
      break;
    case 'temperature':
      data = getTemperature(baseUrl);
      break;
    case 'weight':
      data = getWeight(baseUrl);
      break;
    default:
      res.status(404).end();
  }
  if (!data) {
    throw Error(`No measurement data pressent for type ${type}`);
  }
  res.send(filterData(from, data));
};

const measurementMap: any = {
  1: {
    timestamp: '2014-11-11T15:35:00.000+02:00',
    measurement: {
      systolic: 120,
      diastolic: 90,
    },
  },
};

export const get = (req: any, res: any) => {
  const id = req.params.id;

  if (measurementMap.hasOwnProperty(id)) {
    res.send(measurementMap[id]);
  } else {
    res.status(404).end();
  }
};

export const getMoreBloodPressure = (req: any, res: any, baseUrl: any) => {
  const typeName = 'blood_pressure';

  const bloodPressureMeasurementsPartTwo = {
    total: 15,
    max: 10,
    offset: 10,
    links: {
      self: `${baseUrl}/clinician/api/patients/me/measurements?offset=10&max10&type=${typeName}`,
    },
    results: [
      {
        timestamp: '2014-03-19T00:00:00.000+01:00',
        type: typeName,
        measurement: {
          unit: 'mmHg',
          systolic: 100,
          diastolic: 80,
        },
      },
      {
        timestamp: '2014-02-19T03:44:00.000+01:00',
        type: typeName,
        measurement: {
          unit: 'mmHg',
          systolic: 95,
          diastolic: 70,
        },
      },
      {
        timestamp: '2014-01-19T07:25:00.000+01:00',
        type: typeName,
        measurement: {
          unit: 'mmHg',
          systolic: 88,
          diastolic: 60,
        },
      },
      {
        timestamp: '2013-12-19T00:00:00.000+01:00',
        type: typeName,
        measurement: {
          unit: 'mmHg',
          systolic: 86,
          diastolic: 55,
        },
      },
      {
        timestamp: '2012-12-19T21:23:00.000+01:00',
        type: typeName,
        measurement: {
          unit: 'mmHg',
          systolic: 70,
          diastolic: 42,
        },
      },
    ],
  };

  res.send(bloodPressureMeasurementsPartTwo);
};
