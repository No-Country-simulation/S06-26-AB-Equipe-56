const express = require('express');
const router = express.Router();
const SaudeController = require('../controllers/SaudeController');
const { loginSaude } = require('../controllers/AuthController');
const verificarAutenticacao = require('../middlewares/verificarAutenticacao');

const rotasLogin = ['/login', '/profissionais/login', '/pacientes/login'];

rotasLogin.forEach((rota) => {
  router.post(rota, loginSaude);
});

router.get('/especialidades', verificarAutenticacao, SaudeController.listarEspecialidades);
router.post('/especialidades', verificarAutenticacao, SaudeController.criarEspecialidade);

router.get('/profissionais', verificarAutenticacao, SaudeController.listarProfissionais);
router.post('/profissionais', verificarAutenticacao, SaudeController.criarProfissional);

router.get('/pacientes', verificarAutenticacao, SaudeController.listarPacientes);
router.post('/pacientes', verificarAutenticacao, SaudeController.criarPaciente);

router.get('/consultas', verificarAutenticacao, SaudeController.listarConsultas);
router.post('/consultas', verificarAutenticacao, SaudeController.criarConsulta);

router.get('/exames', verificarAutenticacao, SaudeController.listarExames);
router.post('/exames', verificarAutenticacao, SaudeController.criarExame);

module.exports = router;