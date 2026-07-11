const multer = require('multer');

const TIPOS_PERMITIDOS = new Set(['image/jpeg', 'image/png', 'image/webp']);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 5,
  },
  fileFilter: (_req, file, callback) => {
    if (!TIPOS_PERMITIDOS.has(file.mimetype)) {
      return callback(new Error('Archivo no permitido. Solo se aceptan imágenes JPEG, PNG o WebP.'));
    }
    return callback(null, true);
  },
}).array('imagenes', 5);

const cargarImagenesPaquete = (req, res, next) => {
  upload(req, res, (error) => {
    if (!error) return next();

    let message = error.message;
    if (error instanceof multer.MulterError) {
      if (error.code === 'LIMIT_FILE_SIZE') {
        message = 'Cada imagen puede pesar como máximo 5 MB.';
      } else if (error.code === 'LIMIT_FILE_COUNT' || error.code === 'LIMIT_UNEXPECTED_FILE') {
        message = 'Se pueden subir como máximo 5 imágenes con la clave "imagenes".';
      } else {
        message = 'No se pudieron procesar las imágenes enviadas.';
      }
    }

    return res.status(400).json({ success: false, error: message });
  });
};

module.exports = cargarImagenesPaquete;
