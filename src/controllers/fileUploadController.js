const { uploadFileToDrive, renameFileInDrive, uploadMultipleFilesToDrive } = require('../services/googleDriveService');

// Fungsi untuk mengupload file tunggal
const uploadFile = async (req, res) => {
  console.log('File upload request received');
  console.log('Request body:', req.body);
  console.log('Request file:', req.file);

  if (!req.file) {
    console.log('No file uploaded');
    return res.status(400).json({
      status: 'failed',
      response: 400,
      data: {
        message: 'No file uploaded'
      }
    });
  }

  try {
    console.log('Calling uploadFileToDrive');
    const { fileId, fileLink } = await uploadFileToDrive(req.file, 'scan');
    console.log('File uploaded successfully', { fileId, fileLink });

    // Mengambil data untuk penamaan file baru
    const accountSKKO = req.body.accountSKKO; // Asumsikan ini diambil dari field di request
    const timestamp = new Date().toLocaleDateString('id-ID').split('/').reverse().join(''); // Format yyyymmdd
    console.log('Request body:', req.body);
    console.log('Account SKKO:', req.body.accountSKKO);

    // Mengekstrak bagian dari accountSKKO
    let newFileName;
    if (accountSKKO) {
      const parts = accountSKKO.split(' - '); // Memisahkan berdasarkan ' - '
      const accountNumber = parts[1]; // Ambil account number
      const subgl = parts.length > 2 ? parts[0].trim() : ''; // Ambil subgl jika ada
      const prefix = subgl ? `${subgl}_` : ''; // Prefix berdasarkan subgl jika ada
      
      newFileName = `${timestamp}_${prefix}${accountNumber}`; // Format penamaan
    }

    // Melakukan rename setelah upload hanya jika accountSKKO terisi
    if (newFileName) {
      await renameFileInDrive(fileId, newFileName);
    }

    res.status(200).json({
      status: 'success',
      response: 200,
      data: {
        fileId,
        fileLink
      }
    });
  } catch (error) {
    console.error('Error in file upload controller:', error);

    let status, code, message;

    if (error.message.includes('Failed to authenticate')) {
      status = 'failed';
      code = 401;
      message = 'Authentication failed. Please check your credentials.';
    } else if (error.message.includes('File not found')) {
      status = 'failed';
      code = 500; // Sesuaikan jika perlu
      message = `File not found: ${error.message.split(': ')[1] || ''}`;
    } else if (error.code === 'ECONNREFUSED') {
      status = 'failed';
      code = 503;
      message = 'Unable to connect to Google Drive. Please try again later.';
    } else {
      status = 'error';
      code = 500;
      message = 'An error occurred while uploading the file. Please try again.';
    }

    const errorResponse = {
      status,
      response: code,
      data: {
        message
      }
    };

    console.log('Sending error response:', errorResponse);
    res.status(code).json(errorResponse);
  }
};

// Fungsi untuk mengupload multiple files
const uploadMultipleFiles = async (req, res) => {
  console.log('Multiple file upload request received');
  console.log('Request body:', req.body);
  console.log('Request files:', req.files);

  if (!req.files || req.files.length === 0) {
    console.log('No files uploaded');
    return res.status(400).json({
      status: 'failed',
      response: 400,
      data: {
        message: 'No files uploaded'
      }
    });
  }

  try {
    console.log('Calling uploadMultipleFilesToDrive');
    const accountSKKO = req.body.accountSKKO; // Ambil accountSKKO dari body
    const timestamp = new Date().toLocaleDateString('id-ID').split('/').reverse().join(''); // Format yyyymmdd
    console.log('Request body:', req.body);
    console.log('Account SKKO:', req.body.accountSKKO);

    const uploadedFiles = [];
    for (let i = 0; i < req.files.length; i++) {
      const file = req.files[i];
      const { fileId, fileLink } = await uploadFileToDrive(file, 'bukti');

      // Menyusun nama file baru dengan increment jika accountSKKO terisi
      let newFileName;
      if (accountSKKO) {
        const parts = accountSKKO.split(' - '); // Memisahkan berdasarkan ' - '
        const accountNumber = parts[1]; // Ambil account number
        const subgl = parts.length > 2 ? parts[0].trim() : ''; // Ambil subgl jika ada
        const prefix = subgl ? `${subgl}_` : ''; // Prefix berdasarkan subgl jika ada

        newFileName = `${timestamp}_${prefix}${accountNumber}_${i + 1}`; // Format penamaan
      }

      // Melakukan rename setelah upload hanya jika accountSKKO terisi
      if (newFileName) {
        await renameFileInDrive(fileId, newFileName);
      }

      uploadedFiles.push({ fileId, fileLink });
    }

    console.log('Files uploaded successfully', uploadedFiles);
    res.status(200).json({
      status: 'success',
      response: 200,
      data: uploadedFiles
    });
  } catch (error) {
    console.error('Error in multiple file upload controller:', error);

    let status, code, message;

    if (error.message.includes('Failed to authenticate')) {
      status = 'failed';
      code = 401;
      message = 'Authentication failed. Please check your credentials.';
    } else if (error.message.includes('File not found')) {
      status = 'failed';
      code = 500; // Sesuaikan jika perlu
      message = `File not found: ${error.message.split(': ')[1] || ''}`;
    } else if (error.code === 'ECONNREFUSED') {
      status = 'failed';
      code = 503;
      message = 'Unable to connect to Google Drive. Please try again later.';
    } else {
      status = 'error';
      code = 500;
      message = 'An error occurred while uploading the files. Please try again.';
    }

    const errorResponse = {
      status,
      response: code,
      data: {
        message
      }
    };

    console.log('Sending error response:', errorResponse);
    res.status(code).json(errorResponse);
  }
};

module.exports = { uploadFile, uploadMultipleFiles };
