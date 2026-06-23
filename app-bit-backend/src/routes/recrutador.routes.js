const express = require('express');
const router = express.Router();
const RecrutadorController = require('../controllers/RecrutadorController');

router.post('/', RecrutadorController.criarRecrutador);
router.get('/', RecrutadorController.listarRecrutadores);
router.get('/:id', RecrutadorController.buscarRecrutador);
module.exports = router;