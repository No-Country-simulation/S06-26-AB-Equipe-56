const express = require('express');
const router = express.Router();
const { 
    listarCandidaturas, 
    buscarCandidaturaPorId, 
    listarCandidaturasPorCurriculo, 
    criarCandidatura,
    atualizarStatusCandidatura 
} = require('../controllers/CandidaturaController');
const verificarAutenticacao = require('../middlewares/verificarAutenticacao');

router.get('/', verificarAutenticacao, listarCandidaturas);
router.get('/:id', verificarAutenticacao, buscarCandidaturaPorId);
router.get('/curriculo/:curriculoId', verificarAutenticacao, listarCandidaturasPorCurriculo);
router.post('/', verificarAutenticacao, criarCandidatura);
router.put('/:id/status', verificarAutenticacao, atualizarStatusCandidatura);

module.exports = router;
