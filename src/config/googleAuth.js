// src/config/googleAuth.js

const { google } = require('googleapis');
const path = require('path');

const authenticateGoogle = () => {
  const keyPath = path.resolve(__dirname, '../../service-account-key.json'); // Path absolut ke file JSON
  console.log('Authenticating with key file:', keyPath);

  const auth = new google.auth.GoogleAuth({
    keyFile: keyPath, // Path ke file JSON kredensial
    scopes: ['https://www.googleapis.com/auth/drive.file'], // Sesuaikan scope jika diperlukan
  });
  return auth;
};

module.exports = authenticateGoogle;
