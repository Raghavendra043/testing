import { User } from "@app/types/user.type";

type FullUser = {
  [P in keyof User]: Required<User[P]>;
};

export const validUser: FullUser = Object.freeze({
  firstName: "valid",
  lastName: "user",
  username: "validUser",
  claims: {},
  canChangePassword: true,
  patientGroups: [
    {
      name: "name",
      links: {
        patientGroup: "http//patientGroups",
      },
    },
  ],
  organizations: [{ name: "name", url: "http://organization" }],
  links: Object.freeze({
    thresholds: "/thresholds",
    contactInfo: "/contact-info",
    acknowledgements: "http://localhost/rest/questionnaire/acknowledgements",
    attachments: "http://attachments",
    auth: "http://auth",
    calendar: "http://calendar",
    changePassword: "http://changePassword",
    individualSessions: "http://individualSessions",
    linksCategories: "http://linksCategories",
    logEntries: "http://logEntries",
    logout: "http://logout",
    measurements: "http://measurements",
    messages: "http://messages",
    notifications: "http://notifications",
    questionnaires: "http://questionnaires",
    questionnaireResults: "http://questionnaireResults",
    questionnaireSchedules: "http://questionnaireSchedules",
    self: "http://self",
    threads: "http://threads",
  }),
});
