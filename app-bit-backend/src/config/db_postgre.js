require('dotenv').config();
// Mudamos para o pacote oficial do PostgreSQL
const { Pool } = require('pg'); 

const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_SERVER,       // No 'pg', usamos 'host' em vez de 'server'
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT || 5432, // O padrão do Postgres é 5432
    // Se precisar de SSL (equivalente ao encrypt/trustServerCertificate), descomente abaixo:
    // ssl: { rejectUnauthorized: false } 
};

// Criamos o pool de conexões
const pool = new Pool(dbConfig);

async function conectarBanco() {
    try {
        // No 'pg', fazemos um cliente rápido do pool para testar a conexão
        const client = await pool.connect();
        console.log("📦 Conectado ao PostgreSQL com sucesso!");
        
        // Libera o cliente de volta para o pool após o teste bem-sucedido
        client.release(); 
        
        return pool;
    } catch (erro) {
        console.error("❌ Erro ao conectar no banco:", erro);
        throw erro;
    }
}

conectarBanco();

// Exportamos o pool (que é o equivalente ao sql do mssql para fazer queries)
module.exports = { conectarBanco, pool };