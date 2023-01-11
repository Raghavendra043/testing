import { username } from './utils';
// Data

const acknowledgements = (baseUrl: any) => {
  return {
    acknowledgements: [
      {
        name: 'Hypertension questionnaire',
        type: 'questionnaire',
        uploadTimestamp: '2021-04-05T10:30:21',
        acknowledgementTimestamp: '2021-04-05T14:17:30',
        links: {
          questionnaire: `${baseUrl}/clinician/api/patients/me/questionnaires/42/results`,
        },
      },
      {
        system: 'Measurements',
        type: 'externalMeasurement',
        uploadTimestamp: '2021-04-05T12:43:11',
        acknowledgementTimestamp: '2021-04-05T16:32:07',
      },
    ],
  };
};

// API

export const list = (req: any, res: any, baseUrl: any) => {
  const _username = username(req);
  console.log(`Acknowledgements list requested from: ${_username}`);

  if (_username === 'noAcknowledgements') {
    console.log('Empty acknowledgements list returned.');
    res.send({ acknowledgements: [] });
    return;
  }

  console.log('Acknowledgements returned.');
  res.send(acknowledgements(baseUrl));
};
