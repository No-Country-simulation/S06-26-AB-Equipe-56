const express = require('express');
const router = express.Router();
const { criarVaga, listarVagas, buscarVagaPorId } = require('../controllers/VagaController');
const verificarAutenticacao = require('../middlewares/verificarAutenticacao');

router.post('/', verificarAutenticacao, criarVaga);

router.get('/', verificarAutenticacao, listarVagas);
router.get('/:id', verificarAutenticacao, buscarVagaPorId);

module.exports = router;