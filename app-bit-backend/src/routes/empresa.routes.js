const express = require('express');
const router = express.Router();
const EmpresaController = require('../controllers/EmpresaController');
const verificarAutenticacao = require('../middlewares/verificarAutenticacao');

router.post('/', EmpresaController.criarEmpresa);
router.get('/', EmpresaController.listarEmpresas);
router.get('/meu-perfil', verificarAutenticacao, EmpresaController.buscarMeuPerfil);

module.exports = router;