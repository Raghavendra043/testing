import { username } from './utils';
// Data

const questionnaireSchedulesList = (baseUrl: any) => {
  const addDate = (date: any, days: any) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  };

  return {
    startDate: addDate(new Date(), -5).toISOString(),
    questionnaireSchedules: [
      {
        questionnaireName: 'Blood sugar (automatic)',
        type: 'WEEKDAYS',
        links: {
          questionnaireSchedule: `${baseUrl}/clinician/api/patients/me/questionnaire_schedules/3`,
          questionnaireDefinition: `${baseUrl}/clinician/api/questionnaire_definitions/2`,
          questionnaire: `${baseUrl}/clinician/api/patients/me/questionnaires/2`,
        },
        scheduledTime: {
          reminderStartMinutes: 30,
          timesOfDay: ['14:00+01:00'],
          weekdays: [
            'MONDAY',
            'TUESDAY',
            'WEDNESDAY',
            'THURSDAY',
            'FRIDAY',
            'SATURDAY',
            'SUNDAY',
          ],
        },
        scheduleWindowMinutes: 600,
        nextDeadline: new Date().toISOString(),
      },
      {
        questionnaireName: 'Blood pressure (manual)',
        type: 'WEEKDAYS',
        links: {
          questionnaireSchedule: `${baseUrl}/clinician/api/patients/me/questionnaire_schedules/2`,
          questionnaireDefinition: `${baseUrl}/clinician/api/questionnaire_definitions/5`,
          questionnaire: `${baseUrl}/clinician/api/patients/me/questionnaires/5`,
        },
        scheduledTime: {
          reminderStartMinutes: 30,
          timesOfDay: ['07:00+01:00'],
          weekdays: [
            'MONDAY',
            'TUESDAY',
            'WEDNESDAY',
            'THURSDAY',
            'FRIDAY',
            'SATURDAY',
            'SUNDAY',
          ],
        },
        scheduleWindowMinutes: 1500,
        nextDeadline: addDate(new Date(), 1).toISOString(),
      },
      {
        questionnaireName: 'Pain scale (manual)',
        type: 'UNSCHEDULED',
        links: {
          questionnaireSchedule: `${baseUrl}/clinician/api/patients/me/questionnaire_schedules/4`,
          questionnaireDefinition: `${baseUrl}/clinician/api/questionnaire_definitions/3`,
          questionnaire: `${baseUrl}/clinician/api/patients/me/questionnaires/3`,
        },
      },
      {
        questionnaireName: 'Blood pressure (automatic)',
        type: 'WEEKDAYS',
        links: {
          questionnaireSchedule: `${baseUrl}/clinician/api/patients/me/questionnaire_schedules/1`,
          questionnaireDefinition: `${baseUrl}/clinician/api/questionnaire_definitions/1`,
          questionnaire: `${baseUrl}/clinician/api/patients/me/questionnaires/1`,
        },
        scheduledTime: {
          reminderStartMinutes: 30,
          timesOfDay: ['13:00+01:00'],
          weekdays: ['MONDAY', 'WEDNESDAY', 'FRIDAY'],
        },
        scheduleWindowMinutes: 600,
        nextDeadline: addDate(new Date(), 2).toISOString(),
      },
    ],
    links: {
      self: `${baseUrl}/clinician/api/patients/me/questionnaire_schedules`,
    },
  };
};

// API

export const list = (req: any, res: any, baseUrl: any) => {
  const _username = username(req);
  console.log(`Questionnaire schedules list requested from: ${_username}`);
  res.send(questionnaireSchedulesList(baseUrl));
};
