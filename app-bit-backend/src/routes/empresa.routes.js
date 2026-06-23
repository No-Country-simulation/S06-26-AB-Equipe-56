const express = require('express');
const router = express.Router();
const EmpresaController = require('../controllers/EmpresaController');

router.post('/', EmpresaController.criarEmpresa);

module.exports = router;