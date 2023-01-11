import { username } from './utils';

// Data

const linksCategoriesList = (baseUrl: any) => {
  return {
    total: 2,
    max: 100,
    offset: 0,
    results: [
      {
        name: 'General user information',
        resources: [
          {
            title: 'OpenTele user manual',
            url: 'https://opentelehealth.zendesk.com/hc/en-us/article_attachments/360021235880/Clinician_Portal_-_Administrator_Manual.pdf',
          },
          {
            title: 'A nice chart',
            url: 'https://www.oth.io/wp-content/uploads/2020/01/OTH_PLATFORM_220120_A.png',
          },
        ],
        patientGroups: [`${baseUrl}/clinician/api/patientgroups/2`],
        links: {
          category: `${baseUrl}/guidance/categories/1`,
        },
      },
      {
        name: 'Video instructions for hypertension',
        resources: [
          {
            title: 'Introduction to OTH',
            url: 'https://www.youtube.com/watch?v=tlz70Rz_XwQ',
          },
        ],
        patientGroups: [
          `${baseUrl}/clinician/api/patientgroups/1`,
          `${baseUrl}/clinician/api/patientgroups/4`,
        ],
        links: {
          category: `${baseUrl}/guidance/categories/2`,
        },
      },
    ],
    links: {
      self: `${baseUrl}/guidance/categories`,
    },
  };
};

const informationCategory = (baseUrl: any) => {
  return {
    name: 'General user information',
    resources: [
      {
        title: 'OpenTele user manual',
        url: 'http://www.opentelehealth.com/devices/',
      },
      {
        title: 'Saturation measurement guide',
        url: 'http://www.opentelehealth.com',
      },
    ],
    patientGroups: [`${baseUrl}/clinician/api/patientgroups/2`],
    links: {
      category: `${baseUrl}/guidance/categories/1`,
    },
  };
};

const videoInstructionsCategory = (baseUrl: any) => {
  return {
    name: 'Video instructions for hypertension',
    resources: [
      {
        title: 'Demonstration of saturation measurement',
        url: 'http://opentele.silverbullet.dk/devices',
      },
    ],
    patientGroups: [
      `${baseUrl}/clinician/api/patientgroups/1`,
      `${baseUrl}/clinician/api/patientgroups/4`,
    ],
    links: {
      category: `${baseUrl}/guidance/categories/2`,
    },
  };
};

// API

export const list = (req: any, res: any, baseUrl: any) => {
  const _username = username(req);
  console.log(`Information & Guidance list requested from: ${_username}`);

  if (_username === 'rene') {
    res.send({
      total: 1,
      max: 100,
      offset: 0,
      results: [
        {
          name: 'Information',
          resources: [
            {
              title: 'OpenTele user manual',
              url: 'http://www.opentelehealth.com/devices/',
            },
            {
              title: 'Saturation measurement guide',
              url: 'http://www.opentelehealth.com',
            },
          ],
          patientGroups: [`${baseUrl}/clinician/api/patientgroups/2`],
          links: {
            category: `${baseUrl}/guidance/categories/1`,
          },
        },
      ],
      links: {
        self: `${baseUrl}/guidance/categories`,
      },
    });
    return;
  }

  console.log('Guidance Categories returned.');
  res.send(linksCategoriesList(baseUrl));
};

export const get = (req: any, res: any, baseUrl: any) => {
  const linksCategoriesId = req.params.id;
  console.log('Categories id ' + linksCategoriesId);

  const responses: any = {
    '1': (baseUrl: any) => {
      res.send(informationCategory(baseUrl));
    },
    '2': (baseUrl: any) => {
      res.send(videoInstructionsCategory(baseUrl));
    },
  };

  if (responses.hasOwnProperty(linksCategoriesId)) {
    responses[linksCategoriesId](baseUrl);
  } else {
    res.status(404).end();
  }
};
