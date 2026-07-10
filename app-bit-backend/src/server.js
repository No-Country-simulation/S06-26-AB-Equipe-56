const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json()); 

const mentoriaRoutes = require('./routes/mentoria.routes');
const cargosRoutes = require('./routes/cargos.routes');
const senioridadesRoutes = require('./routes/senioridades.routes');
const escolaridadeRoutes = require('./routes/escolaridade.routes');
const empresaRoutes = require('./routes/empresa.routes');
const recrutadorRoutes = require('./routes/recrutador.routes');
app.use('/api/recrutadores', recrutadorRoutes);
app.use('/api/empresas', empresaRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'API do App BiT rodando com sucesso!' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);

});