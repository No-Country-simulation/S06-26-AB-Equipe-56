require('dotenv').config();
// Voltamos para o pacote padrão e oficial!
const sql = require('mssql'); 

const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    options: {
        encrypt: false, 
        trustServerCertificate: true,
        instanceName: 'SQLEXPRESS' 
    }
};

async function conectarBanco() {
    try {
        const pool = await sql.connect(dbConfig);
        console.log("📦 Conectado ao SQL Server Express com sucesso!");
        return pool;
    } catch (erro) {
        console.error("❌ Erro ao conectar no banco:", erro);
        throw erro;
    }
}

conectarBanco();

module.exports = { conectarBanco, sql };