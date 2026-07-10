const express = require('express');
const router = express.Router();
const mentoriaController = require('../controllers/mentoria.controller');

// Rota para listar os mentores disponíveis
router.get('/', mentoriaController.listarMentores);

// Rota para a empresa solicitar um match de mentoria
router.post('/solicitar', mentoriaController.solicitarMentoria);

module.exports = router;