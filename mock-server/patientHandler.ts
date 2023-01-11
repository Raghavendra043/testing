import { parseJwt } from './utils';

const addLinks = (
  user: any,
  baseUrl: any,
  shouldAddMessageLinks: any,
  shouldAddCalendarLinks: any,
  shouldAddLogEntriesLinks: any
) => {
  user.links = {};
  user.links.self = `${baseUrl}/clinician/api/patients/me`;
  user.links.measurements = `${baseUrl}/clinician/api/patients/me/measurement-types`;
  user.links.questionnaires = `${baseUrl}/clinician/api/patients/me/questionnaires`;
  user.links.questionnaireResults = `${baseUrl}/clinician/api/patients/me/questionnaire-results`;
  user.links.questionnaireSchedules = `${baseUrl}/clinician/api/patients/me/questionnaire_schedules`;
  user.links.notifications = `${baseUrl}/notifications/devices`;
  user.links.linksCategories = `${baseUrl}/guidance/categories`;
  user.links.changePassword = `${baseUrl}/idp2/users/auth`;

  // video links
  user.links.individualSessions = `${baseUrl}/meetings/individual-sessions`;

  if (shouldAddMessageLinks) {
    user.links.threads = `${baseUrl}/chat/threads`;
    user.links.messages = `${baseUrl}/chat/messages`;
    user.links.acknowledgements = `${baseUrl}/clinician/api/patients/me/acknowledgements`;
  }

  if (shouldAddCalendarLinks) {
    user.links.calendar = `${baseUrl}/calendar`;
  }

  if (shouldAddLogEntriesLinks) {
    user.links.logEntries = `${baseUrl}/logging/entries/uuid-for-${user.username}`;
  }

  return user;
};

export const get = (req: any, res: any, baseUrl: any) => {
  const usersNoMessageLinks = [
    'noAcknowledgements',
    'messagesNoRecipients',
    '',
  ];
  const usersWithCalendar = ['nancyann'];
  const usersWithClientLoggingEnabled: any = [];

  const claims = parseJwt(req);
  const nameParts = claims.name.split(' ');
  const lastName = nameParts.pop();
  const firstName = nameParts.join(' ');
  let user = {
    firstName: firstName,
    lastName: lastName,
    username: claims.username,
  };
  user = addLinks(
    user,
    baseUrl,
    usersNoMessageLinks.indexOf(claims.username) > -1 === false,
    usersWithCalendar.indexOf(claims.username) > -1 === true,
    usersWithClientLoggingEnabled.indexOf(claims.username) > -1 === true
  );

  res.send(user);
};
