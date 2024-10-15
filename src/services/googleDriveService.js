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
 * Mengunggah multiple file ke Google Drive dan mengembalikan array berisi ID dan link berbagi
 * @param {Array} files - Array file yang diunggah oleh pengguna
 * @param {string} type - Tipe upload ('scan' atau 'bukti')
 * @returns {Array} - Array berisi objek { fileId, fileLink }
 */
const uploadMultipleFilesToDrive = async (files, type) => {
  const uploadPromises = files.map(file => uploadFileToDrive(file, type));
  const uploadedFiles = await Promise.all(uploadPromises);
  return uploadedFiles;
};

module.exports = { uploadFileToDrive, uploadMultipleFilesToDrive };
