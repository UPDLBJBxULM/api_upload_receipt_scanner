const multer = require('multer');
const path = require('path');
const { uploadMultipleFiles } = require('../controllers/fileUploadController');

// Konfigurasi penyimpanan sementara menggunakan Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Pastikan folder 'uploads' ada di root proyek
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

// Middleware untuk single file upload (scan)
const uploadSingle = multer({ 
  storage: storage,
  limits: { fileSize: 16 * 1024 * 1024 } // Batasi ukuran file hingga 5MB (opsional)
});

// Middleware untuk multiple file upload (bukti barang)
const uploadMultiple = multer({ 
  storage: storage,
  limits: { fileSize: 16 * 1024 * 1024 } // Batasi ukuran total file hingga 10MB (opsional)
}).array('files', 10); // Maksimal 10 file

module.exports = { uploadSingle, uploadMultiple };
