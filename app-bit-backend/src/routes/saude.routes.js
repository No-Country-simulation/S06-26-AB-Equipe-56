const express = require('express');
const router = express.Router();
const { verificarSaude, verificarSaudeBanco, listarHistorico } = require('../controllers/SaudeController');

router.get('/', verificarSaude);
router.get('/banco', verificarSaudeBanco);
router.get('/historico', listarHistorico);

module.exports = router;
