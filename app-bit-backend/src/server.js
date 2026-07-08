const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json()); 


const empresaRoutes = require('./routes/empresa.routes');
const recrutadorRoutes = require('./routes/recrutador.routes');
const candidatoRoutes = require('./routes/candidato.routes');
const conviteRoutes = require('./routes/convite.routes');
const vagaRoutes = require('./routes/vaga.routes');
const metasRoutes = require('./routes/metasRoutes');
const trilhaRoutes = require('./routes/trilha.routes');
const candidaturaRoutes = require('./routes/candidatura.routes');
const saudeRoutes = require('./routes/saude.routes');

app.use('/api/recrutadores', recrutadorRoutes);
app.use('/api/candidatos', candidatoRoutes);
app.use('/api/empresas', empresaRoutes);
app.use('/api/convites', conviteRoutes);
app.use('/api/vagas', vagaRoutes);
app.use('/api/metas', metasRoutes);
app.use('/api/trilhas', trilhaRoutes);
app.use('/api/candidaturas', candidaturaRoutes);
app.use('/api/saude', saudeRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'API do App BiT rodando com sucesso!' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
});