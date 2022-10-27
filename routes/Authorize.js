const fs = require('fs');
const {google} = require('googleapis');

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

const TOKEN_PATH = 'token.json';


function authorize(credentials, code) {
  const {client_secret, client_id, redirect_uris} = credentials.web;

  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);

  return getNewToken(oAuth2Client, code);
}


function getNewToken(oAuth2Client, code) {
  
  //code = "4/0AdQt8qjeNGkXbvA4T9y3eLlfy643oeXZQukFurL6HcuYw-wTbH9Ieh8jpKWDbcyj87sYXA";
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error while trying to retrieve access token', err);
    
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
    });
}

module.exports = {
    authorize
}