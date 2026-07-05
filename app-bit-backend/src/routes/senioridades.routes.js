const express = require('express');
const router = express.Router();
const SenioridadesController = require('../controllers/SenioridadesController');

router.post('/', SenioridadesController.criarSenioridade);
router.get('/', SenioridadesController.listarSenioridades);

module.exports = router;