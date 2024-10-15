const { uploadFileToDrive, uploadMultipleFilesToDrive } = require('../services/googleDriveService');

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
      // stack tidak disertakan di sini
    };

    console.log('Sending error response:', errorResponse);
    res.status(code).json(errorResponse);
  }
};

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
    const uploadedFiles = await uploadMultipleFilesToDrive(req.files, 'bukti');
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
      // stack tidak disertakan di sini
    };

    console.log('Sending error response:', errorResponse);
    res.status(code).json(errorResponse);
  }
};

module.exports = { uploadFile, uploadMultipleFiles };
