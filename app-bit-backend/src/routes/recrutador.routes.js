const express = require('express');
const router = express.Router();

const { listarTodos, buscarPorId, criar } = require('../controllers/RecrutadorController');
const { login } = require('../controllers/AuthController'); 

router.post('/login', login); 

router.get('/', listarTodos);
router.get('/:id', buscarPorId);
router.post('/', criar); 

module.exports = router;