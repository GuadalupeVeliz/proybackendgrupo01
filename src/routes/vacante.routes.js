const express = require('express');
const router = express.Router();

const vacanteController = require('../controllers/vacante.controller');

router.get('/', vacanteController.getVacantes);
router.get('/:id', vacanteController.getVacante);
router.post('/', vacanteController.createVacante);
router.put('/:id', vacanteController.updateVacante);
router.delete('/:id', vacanteController.deleteVacante);

module.exports = router;
