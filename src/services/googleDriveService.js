const { google } = require('googleapis');
const fs = require('fs');
const authenticateGoogle = require('../config/googleAuth.js');

/**
 * Mengunggah satu file ke Google Drive dan mengembalikan ID dan link berbagi
 * @param {Object} file - File yang diunggah oleh pengguna
 * @param {string} type - Tipe upload ('scan' atau 'bukti')
 * @returns {Object} - Berisi fileId dan fileLink
 */
const uploadFileToDrive = async (file, type) => {
  const folderId = type === 'scan' ? process.env.DRIVE_FOLDER_ID_SCAN : process.env.DRIVE_FOLDER_ID_BUKTI;
  console.log(`Uploading file to ${type} folder with ID: ${folderId}`);

  const auth = authenticateGoogle();
  const drive = google.drive({ version: 'v3', auth });

  const fileMetadata = {
    name: file.originalname,
    parents: [folderId],
  };
  const media = {
    mimeType: file.mimetype,
    body: fs.createReadStream(file.path),
  };

  try {
    // Mengunggah file ke Google Drive
    const response = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: 'id, name',
      supportsAllDrives: true, // Important for handling files in Shared Drives
    });

    const fileId = response.data.id;
    console.log('File uploaded to Drive with ID:', fileId);

    // Mengatur izin agar "Anyone with the link can view"
    await drive.permissions.create({
      fileId: fileId,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
      supportsAllDrives: true, // Ensure permissions are set for Shared Drives
    });
    console.log('Permissions set for file:', fileId);

    // Membuat link berbagi
    const fileLink = `https://drive.google.com/file/d/${fileId}/view?usp=sharing`;
    console.log('Shareable link created:', fileLink);

    // Hapus file sementara setelah diunggah
    fs.unlinkSync(file.path);
    console.log('Temporary file deleted:', file.path);

    return { fileId, fileLink };
  } catch (error) {
    console.error('Error uploading file to Drive:', error);
    throw error; // Pastikan error dilempar agar dapat ditangani di controller
  }
};

/**
 * Rename file in Google Drive after ensuring conditions are met
 * @param {string} fileId - The ID of the file to rename
 * @param {string} newFileName - The new name of the file
 * @returns {Object} - Response from Google Drive API
 */
const renameFileInDrive = async (fileId, newFileName) => {
  const auth = authenticateGoogle();
  const drive = google.drive({ version: 'v3', auth });

  try {
    const response = await drive.files.update({
      fileId: fileId,
      requestBody: {
        name: newFileName,
      },
      supportsAllDrives: true, // Important for handling files in Shared Drives
    });
    console.log('File renamed to:', newFileName);
    return response;
  } catch (error) {
    console.error('Error renaming file in Drive:', error);
    throw error;
  }
};

module.exports = { uploadFileToDrive, renameFileInDrive };
