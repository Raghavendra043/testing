// import webpackMockServer from "webpack-mock-server";
const express = require("express");
const cors = require("cors");
const login = require("./loginHandler");
const questionnaires = require("./questionnairesHandler");
const questionnaireResults = require("./questionnaireResultsHandler");
const helpImages = require("./helpImageHandler");
const questionnaireSchedules = require("./questionnaireSchedulesHandler");
const messages = require("./messagesHandler");
const acknowledgements = require("./acknowledgementsHandler");
const notifications = require("./notificationsHandler");
const measurements = require("./measurementsHandler");
const linksCategories = require("./linksCategoriesHandler");
const video = require("./videoHandler");
const calendar = require("./calendarHandler");
const patient = require("./patientHandler");
const os = require("os");

let ip: any, baseUrl: any;

const requestLogger = (req: any, res: any, next: any) => {
  console.log(`Got request: ${req.method} ${req.url}`);
  next();
};

const setBaseUrlFromRequest = (req: any, res: any, next: any) => {
  const lookupIpAddress = () => {
    const ipAdresses = [];
    const interfaces = os.networkInterfaces();
    for (var k in interfaces) {
      for (var k2 in interfaces[k]) {
        var address = interfaces[k][k2];
        if (address.family === "IPv4" && !address.internal) {
          ipAdresses.push(address.address);
          console.log(`Found ip address: ${address.address}`);
        }
      }
    }

    return ipAdresses;
  };

  if (!ip) {
    ip = "localhost";
    const ipAdresses = lookupIpAddress();
    const requestIp =
      req.headers["x-forwarded-for"] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress;

    if (ipAdresses.indexOf(requestIp) !== -1) {
      console.log(`Request ip: ${ip}`);
      ip = requestIp;
    } else if (ipAdresses.length > 0) {
      ip = ipAdresses[0];
    }

    baseUrl = `http://${ip}:${port}`;
    console.log(`Clinician mock server baseUrl: ${baseUrl}`);
  }

  next();
};

const authorizationHeaderCheck = (req: any, res: any, next: any) => {
  const suffix = "/clinician/api/";

  if (req.url.indexOf(suffix, req.url.length - suffix.length) !== -1) {
    next();
    return;
  }

  if (!("authorization" in req.headers)) {
    console.log("No authorization header. Request rejected.");
    res.status(401).send();
    return;
  }

  next();
};

const customAuthProxy = (req: any, res: any, next: any) => {
  console.log("custom proxy");
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Custom ")
  ) {
    const credentials = req.headers.authorization.replace("Custom ", "");
    // Create a valid jwt to allow resources to be accessed as the login handler is
    // not called for "Custom" auth tokens...
    const jwt = login.createJwt(credentials, baseUrl, req);
    if (jwt === null) {
      res.status(401).send();
      return;
    }
    req.headers.authorization = "Bearer " + jwt;
  }

  next();
};

const bodyParser = (req: any, res: any, next: any) => {
  let data = "";
  req.setEncoding("utf8");
  req.on("data", (chunk: any) => {
    data += chunk;
  });

  req.on("end", () => {
    req.body = data;
    next();
  });
};

const app = express();
app.use(cors({ origin: true, credentials: true }));

app.use(requestLogger);
app.use(setBaseUrlFromRequest);
app.use(authorizationHeaderCheck);
app.use(customAuthProxy);
app.use(bodyParser);

app.get("/clinician/api", (req: any, res: any) => {
  console.log("Request for server information received");
  const rootInfo = {
    apiVersion: "2.58.0",
    serverEnvironment: "development",
    links: {
      self: `${baseUrl}/clinician/api`,
      auth: `${baseUrl}/idp2/users/auth`,
      oidcAuth: `${baseUrl}/idp2/oidc/auth`,
      mfaPinCode: `${baseUrl}/idp2/mfa/pincode`,
      patient: `${baseUrl}/clinician/api/patients/me`,
      patients: `${baseUrl}/clinician/api/patients`,
      clinician: `${baseUrl}/clinician/api/clinician`,
      clinicians: `${baseUrl}/clinician/api/clinicians`,
      patientGroups: `${baseUrl}/clinician/api/patientgroups`,
      organizations: `${baseUrl}/clinician/api/organizationalunits`,
      messageTemplates: `${baseUrl}/clinician/api/message_templates`,
      measurements: `${baseUrl}/clinician/api/measurements`,
      patientNotes: `${baseUrl}/clinician/api/patient-notes`,
      "api-doc": `${baseUrl}/clinician/api/provider-api.html`,
      schemas: `${baseUrl}/clinician/api/schemas`,
    },
  };

  console.log(`Root information: ${JSON.stringify(rootInfo)}`);
  res.send(rootInfo);
});

// Auth
app.options("/idp2/oidc/auth");

app.get("/idp2/oidc/auth", (req: any, res: any) => {
  login.oidcGet(req, res, baseUrl);
});

app.post("/idp2/mfa/pincode", (req: any, res: any) => {
  login.setPinCode(req, res);
});

app.get("/idp2/users/auth", (req: any, res: any) => {
  login.get(req, res, baseUrl);
});

app.post("/idp2/users/auth", (req: any, res: any) => {
  login.changePassword(req, res, baseUrl);
});

app.delete("/idp2/tokens/:id", (req: any, res: any) => {
  login.logout(req, res, baseUrl);
});

// Patient
app.get("/clinician/api/patients/me", (req: any, res: any) => {
  patient.get(req, res, baseUrl);
});

// Questionnaires
app.get("/clinician/api/patients/me/questionnaires", (req: any, res: any) => {
  questionnaires.list(req, res, baseUrl);
});

app.get(
  "/clinician/api/patients/me/questionnaires/:id",
  (req: any, res: any) => {
    console.log(req.params);
    questionnaires.get(req, res, baseUrl);
  }
);

app.post(
  "/clinician/api/patients/me/questionnaires/:id/results",
  (req: any, res: any) => {
    questionnaires.upload(req, res);
  }
);

// Questionnaire help images
app.get("/clinician/api/help-texts/:id/image", (req: any, res: any) => {
  helpImages.get(req, res);
});

// Questionnaire results
app.get(
  "/clinician/api/patients/me/questionnaire-results",
  (req: any, res: any) => {
    questionnaireResults.list(req, res, baseUrl);
  }
);

app.get(
  "/clinician/api/patients/me/questionnaire-results/:id",
  (req: any, res: any) => {
    questionnaireResults.get(req, res, baseUrl);
  }
);

// Messages
app.get("/chat/threads", (req: any, res: any) => {
  messages.list(req, res, baseUrl);
});

app.get("/chat/threads/:id/messages", (req: any, res: any) => {
  messages.get(req, res, baseUrl);
});

app.post("/chat/threads/:id/read", (req: any, res: any) => {
  messages.read(req, res, baseUrl);
});

app.post("/chat/messages", (req: any, res: any) => {
  messages.create(req, res);
});

// Acknowledgements
app.get("/clinician/api/patients/me/acknowledgements", (req: any, res: any) => {
  acknowledgements.list(req, res, baseUrl);
});

// Notifications
app.get("/notifications/devices", (req: any, res: any) => {
  notifications.list(req, res, baseUrl);
});

app.post("/notifications/devices", (req: any, res: any) => {
  notifications.create(req, res);
});

// Measurements
app.get(
  "/clinician/api/patients/me/measurement-types",
  (req: any, res: any) => {
    measurements.listTypes(req, res, baseUrl);
  }
);

app.get("/clinician/api/patients/me/measurements", (req: any, res: any) => {
  measurements.list(req, res, baseUrl);
});

app.get("/clinician/api/patients/me/measurements/:id", (req: any, res: any) => {
  measurements.get(req, res);
});

app.get(
  "/clinician/api/patients/me/measurements_more_blood_pressure",
  (req: any, res: any) => {
    measurements.getMoreBloodPressure(req, res, baseUrl);
  }
);

// Guidance
app.get("/guidance/categories", (req: any, res: any) => {
  linksCategories.list(req, res, baseUrl);
});

app.get("/guidance/categories/:id", (req: any, res: any) => {
  console.log(req.params);
  linksCategories.get(req, res, baseUrl);
});

// Calendar
app.get("/calendar", (req: any, res: any) => {
  calendar.list(req, res, baseUrl);
});

// Questionnaire schedules
app.get(
  "/clinician/api/patients/me/questionnaire_schedules",
  (req: any, res: any) => {
    questionnaireSchedules.list(req, res, baseUrl);
  }
);

// Logging
app.post("/logging/entries/:uuid", (req: any, res: any) => {
  res.status(204).end();
});

// Video
app.get("/meetings/individual-sessions/", (req: any, res: any) => {
  video.individualSessions(req, res, baseUrl);
});

app.get("/meetings/individual-sessions/:id", (req: any, res: any) => {
  video.individualSession(req, res, baseUrl);
});

app.put(
  "/meetings/individual-sessions/:id/participant",
  (req: any, res: any) => {
    video.individualSessionParticipant(req, res);
  }
);

app.get("/*", (req: any, res: any) => {
  console.log(`Unsupported request from: ${req.method} ${req.url}`);
  res.status(404).end();
});

const port = process.env.PORT || 7000;
app.set("port", port);
const server = app.listen(app.get("port"), () => {
  console.group("Mock server:");
  console.log(`Listening on address ${server.address().address}`);
  console.log(`Listening on port ${server.address().port}`);
  console.groupEnd();
});
