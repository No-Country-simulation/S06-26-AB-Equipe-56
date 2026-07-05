const express = require('express');
const router = express.Router();
const CargosController = require('../controllers/CargosController');

router.post('/', CargosController.criarCargo);
router.get('/', CargosController.listarCargos);

module.exports = router;