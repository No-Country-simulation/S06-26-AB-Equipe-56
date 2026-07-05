const express = require('express');
const router = express.Router();
const EscolaridadeController = require('../controllers/EscolaridadeController');

router.post('/', EscolaridadeController.criarEscolaridade);
router.get('/:curriculo_id', EscolaridadeController.listarPorCurriculo);

module.exports = router;