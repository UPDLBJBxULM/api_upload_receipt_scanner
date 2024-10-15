const express = require('express');
const router = express.Router();
const fileUploadController = require('../controllers/fileUploadController.js');
const { uploadSingle, uploadMultiple } = require('../middlewares/uploadMiddleware.js');

// Rute untuk meng-upload single file (scan)
router.post('/receipt', uploadSingle.single('file'), fileUploadController.uploadFile);

// Rute untuk meng-upload multiple files (bukti barang)
router.post('/evidence', uploadMultiple, fileUploadController.uploadMultipleFiles);

// Export router
module.exports = router;
