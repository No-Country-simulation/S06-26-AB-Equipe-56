const express = require('express');
const router = express.Router();
const MetasESGController = require('../controllers/MetasESGController');
const verificarAutenticacao = require('../middlewares/verificarAutenticacao');
const verificarAdmin = require('../middlewares/verificarAdmin');

router.get('/', verificarAutenticacao, MetasESGController.listar);
router.get('/relatorio', verificarAutenticacao, MetasESGController.buscarRelatorioAderencia);
router.post('/', verificarAdmin, MetasESGController.cadastrar);

module.exports = router;