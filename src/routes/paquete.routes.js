const express = require('express');
const router = express.Router();

const paqueteController = require('../controllers/paquete.controller');

router.get('/', paqueteController.getPaquetes);
router.get('/:id', paqueteController.getPaquete);
router.post('/', paqueteController.createPaquete);
router.put('/:id', paqueteController.updatePaquete);
router.delete('/:id', paqueteController.deletePaquete);

module.exports = router;