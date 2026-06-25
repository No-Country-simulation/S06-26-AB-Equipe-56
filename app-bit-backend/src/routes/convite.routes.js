const express = require('express');
const router = express.Router();

const { gerarConvite, aceitarConvite, listarConvites } = require('../controllers/ConviteController');
const verificarAdmin = require('../middlewares/verificarAdmin');

router.post('/gerar', verificarAdmin, gerarConvite);
router.post('/aceitar', aceitarConvite);

router.get('/:empresa_id', verificarAdmin, listarConvites);

module.exports = router;