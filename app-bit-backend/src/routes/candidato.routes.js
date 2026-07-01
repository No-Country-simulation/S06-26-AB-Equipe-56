const express = require('express');
const router = express.Router();

const { listarTodos, buscarPorId, criar } = require('../controllers/CandidatoController');

router.get('/', listarTodos);
router.get('/:id', buscarPorId);
router.post('/', criar);

module.exports = router;
