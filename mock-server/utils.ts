const jwt = require('jsonwebtoken');

export const parseAuthHeader = (req: any) => {
  const authHeader = req.headers.authorization;
  const authParts = authHeader.split(' ');
  const authType = authParts[0];
  const credentials = authParts[1];

  switch (authType) {
    case 'Refresh':
      return {
        credentials: credentials,
        authType: authType,
      };

    case 'Basic':
      const decoded = new Buffer(credentials, 'base64');
      const token = decoded.toString();
      return {
        credentials: token,
        authType: authType,
      };

    default:
      return undefined;
  }
};

export const username = (req: any) => {
  const token = req.headers.authorization.replace('Bearer ', '');
  return jwt.decode(token).username;
};

export const parseMfaHeader = (req: any) => {
  const mfaHeader = req.headers['authorization-mfa'];
  if (!mfaHeader) {
    return null;
  }

  const parts = mfaHeader.split('=');
  const mfaType = parts[0];
  const mfaValue = parts[1];

  return {
    type: mfaType,
    value: mfaValue,
  };
};

export const parseJwt = (req: any) => {
  const token = req.headers.authorization.replace('Bearer ', '');
  return jwt.decode(token);
};
