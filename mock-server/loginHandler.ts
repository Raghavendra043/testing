import { parseAuthHeader, parseMfaHeader, parseJwt } from "./utils";
const jwt = require("jsonwebtoken");
const fs = require("fs");

// Data

const validUsers: any = {
  "nancyann:abcd1234": {
    firstName: "Nancy Ann",
    lastName: "Berggren",
    username: "nancyann",
    passwordExpired: false,
  },
  "rene:1234": {
    firstName: "René",
    lastName: "Andersen",
    username: "rene",
    passwordExpired: false,
  },
  "æøå:1234": {
    firstName: "René",
    lastName: "Andersen",
    username: "æøå",
    passwordExpired: false,
  },
  "measurements401:1234": {
    firstName: "Will get 401",
    lastName: "error",
    username: "measurements401",
    passwordExpired: false,
  },
  "measurements500:1234": {
    firstName: "Will get 500",
    lastName: "error",
    username: "measurements500",
    passwordExpired: false,
  },
  "messagesNoRecipients:1234": {
    firstName: "Nancy Ann",
    lastName: "Berggren",
    username: "messagesNoRecipients",
    passwordExpired: false,
  },
  "messagesNoMessages:1234": {
    firstName: "Nancy Ann",
    lastName: "Berggren",
    username: "messagesNoMessages",
    passwordExpired: false,
  },
  "messagesNoNewMessage:1234": {
    firstName: "Nancy Ann",
    lastName: "Berggren",
    username: "messagesNoNewMessage",
    passwordExpired: false,
  },
  "noAcknowledgements:1234": {
    firstName: "Nancy Ann",
    lastName: "Berggren",
    username: "noAcknowledgements",
    passwordExpired: false,
  },
  "uploadfails:1234": {
    firstName: "Fails",
    lastName: "Twice",
    username: "uploadfails",
    passwordExpired: false,
  },
  "changepw:1234": {
    firstName: "Nancy Ann",
    lastName: "Berggren",
    username: "changepw",
    passwordExpired: false,
  },
  "changepwfails:1234": {
    firstName: "Change PW",
    lastName: "Fails",
    username: "changepwfails",
    passwordExpired: false,
  },
  "mustchangepw:1234": {
    firstName: "Must Change",
    lastName: "Password",
    username: "mustchangepw",
    passwordExpired: true,
  },
  "changeonrefresh:1234": {
    firstName: "Change",
    lastName: "Password on Refresh",
    username: "changeonrefresh",
    passwordExpired: false,
  },
};

// API

export const createJwt = (credentials: any, baseUrl: any, req: any) => {
  const user = validUsers[credentials];
  if (!user) {
    return null;
  }

  const claims: any = {
    sub: `${baseUrl}/idp2/users/13`,
    jti: `${baseUrl}/idp2/tokens/123`,
    sty: "user",
    username: user.username,
    name: `${user.firstName} ${user.lastName}`,
    perm: [],
    audit: `unique_audit_id_for_${user.username}`,
    pwexpired: user.passwordExpired,
  };

  const key = fs.readFileSync(`${__dirname}/files/idp_private_key.pem`);
  return jwt.sign(claims, key, { algorithm: "RS256", issuer: req.url });
};

export const get = (req: any, res: any, baseUrl: any) => {
  const authParsed = parseAuthHeader(req);
  const credentials = authParsed?.credentials;
  const authType = authParsed?.authType;
  console.log(`Login received for: ${credentials}`);

  const buildJwt = (credentials: any) => {
    console.log("User token valid. Login accepted.");
    const token = createJwt(credentials, baseUrl, req);

    return {
      type: "Bearer",
      token: token,
      refreshToken: credentials,
      customClaims: {
        organizations: [
          {
            name: "Department A",
            url: `${baseUrl}/organizations/organizations/123`,
          },
          {
            name: "Department B",
            url: `${baseUrl}/organizations/organizations/456`,
          },
        ],
      },
      links: {
        logout: `${baseUrl}/idp2/tokens/123`,
      },
    };
  };

  if (credentials in validUsers) {
    const user = validUsers[credentials];

    if (user.pinCode) {
      console.log("Headers: " + JSON.stringify(req.headers, null, 4));
      const mfa = parseMfaHeader(req);

      if (
        mfa &&
        mfa.type == "pincode" &&
        mfa.value === user.pinCode.toString()
      ) {
        console.log("MFA login succeeded.");
        res.send(buildJwt(credentials));
        return true;
      }

      if (mfa && mfa.type == "pincode") {
        console.log(`Wrong PIN-code: ${mfa.value} - ${user.pinCode}`);

        res.status(401).send({
          message: "Authentication failed",
          errors: [
            {
              resource: "users",
              field: "authorization-mfa",
              error: "invalid",
            },
          ],
        });
        return false;
      }

      console.log("MFA required, returning 401.");
      res.status(401).send({
        message: "mfa_required",
        errors: [
          {
            resource: "auth",
            field: "authorization",
            error: "pincode_required",
          },
        ],
      });
      return false;
    }

    if (authType == "Refresh" && credentials.indexOf("changeonrefresh") > -1) {
      console.log("Password expired on refresh. Login rejected.");
      res.status(401).send({
        message: "Authentication failed",
        errors: [
          { resource: "users", field: "authorization", error: "expired" },
        ],
      });
      return false;
    }

    if (passwordExpired(credentials)) {
      console.log("Password expired. Login rejected.");
      res.status(401).send({
        message: "Authentication failed",
        errors: [
          { resource: "users", field: "authorization", error: "expired" },
        ],
      });
      return false;
    }

    console.log("User token valid. Login accepted.");
    const auth = buildJwt(credentials);

    res
      .cookie("mock-server-auth", new Date().toISOString(), {
        httpOnly: true,
        path: "/",
        maxAge: 600000000,
      })
      .send(auth);
    return true;
  }

  if (credentials.indexOf("locked") > -1) {
    console.log("User is locked. Login rejected.");
    res.status(401).send({
      message: "Authentication failed",
      errors: [{ resource: "users", field: "authorization", error: "locked" }],
    });
    return false;
  }

  console.log("User token not valid. Login rejected.");
  res.status(401).send({
    message: "Authentication failed",
    errors: [{ resource: "users", field: "authorization", error: "invalid" }],
  });
  return false;
};

export const oidcGet = (req: any, res: any, baseUrl: any) => {
  const oidcJwt = parseJwt(req);
  console.log("Received OIDC JWT: ");
  console.log(JSON.stringify(oidcJwt, null, 4));

  const credentials = "nancyann:abcd1234";
  const token = createJwt(credentials, baseUrl, req);

  const auth = {
    type: "Bearer",
    token: token,
    refreshToken: credentials,
    links: {
      logout: `${baseUrl}/idp2/tokens/123`,
    },
  };

  res
    .cookie("mock-server-oidc-auth", new Date().toISOString(), {
      httpOnly: true,
      path: "/",
      maxAge: 600000000,
    })
    .send(auth);
  return true;
};

export const setPinCode = (req: any, res: any) => {
  const body = JSON.parse(req.body);
  const jwt = parseJwt(req);
  const pinCode = body.pinCode;

  let user = null;
  for (var credentials in validUsers) {
    console.log(
      `Checking user: ${JSON.stringify(validUsers[credentials], null, 4)}`
    );
    if (validUsers[credentials].username === jwt.username) {
      user = validUsers[credentials];
      break;
    }
  }

  if (!user) {
    console.log(
      `No valid user found to set PIN-code for. Username: ${jwt.username}`
    );
    res.status(400).send().end();
    return false;
  }

  console.log(`Setting PIN-code to ${pinCode} for user ${user.username}`);
  user.pinCode = pinCode;
  res.status(204).send();
  return true;
};

const passwordExpired = (credentials: any) => {
  const user = validUsers[credentials];
  return user.passwordExpired;
};

export const logout = (req: any, res: any, baseUrl: any) => {
  for (var credentials in validUsers) {
    if (validUsers[credentials].pinCode) {
      delete validUsers[credentials].pinCode;
    }
  }
  res.status(204).end();
};

export const changePassword = (req: any, res: any, baseUrl: any) => {
  console.log(req.body);

  const authParsed = parseAuthHeader(req);
  const credentials = authParsed?.credentials;
  console.log(`Change password received for: ${credentials}`);
  const username = credentials.split(":")[0];

  if (credentials.indexOf("changepwfails") > -1) {
    setTimeout(() => {
      res
        .status(400)
        .send({
          message: "Password must be at least 8 characters long",
          errors: [
            {
              resource: "user",
              error: "at_least_8_chars",
              field: "password",
            },
            {
              resource: "user",
              error: "visible_chars_only",
              field: "password",
            },
            {
              resource: "user",
              error: "at_least_one_digit",
              field: "password",
            },
            {
              resource: "user",
              error: "at_least_one_letter",
              field: "password",
            },
          ],
        })
        .end();
    }, 200);

    return;
  }

  const body = JSON.parse(req.body);
  if (!body.password) {
    res
      .status(400)
      .send({
        message: "Schema validation failed",
        errors: [
          {
            resource: "user",
            error: "missing required field",
            field: "password",
          },
        ],
      })
      .end();
    return;
  }

  const newCredentials = `${username}:${body.password}`;
  validUsers[newCredentials] = {
    firstName: "Nancy Ann",
    lastName: "Berggren",
    username: "nancyann",
    passwordExpired: false,
  };

  const token = createJwt(newCredentials, baseUrl, req);

  const auth = {
    type: "Bearer",
    token: token,
    refreshToken: newCredentials,
    links: {
      logout: baseUrl + "idp2/tokens/123",
    },
  };

  setTimeout(() => {
    res.status(200).send(auth);
  }, 500);
};
