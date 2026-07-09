require('dotenv').config();
const { Pool } = require('pg');

function montarConfigBanco() {
    const connectionString = process.env.DATABASE_URL?.trim();

    if (connectionString) {
        return {
            connectionString,
            ssl: connectionString.includes('neon.tech') || connectionString.includes('neon')
                ? { rejectUnauthorized: false }
                : undefined,
        };
    }

    const dbConfig = {
        user: process.env.DB_USER?.trim(),
        password: process.env.DB_PASSWORD?.trim(),
        host: process.env.DB_SERVER?.trim(),
        database: process.env.DB_DATABASE?.trim(),
        port: Number(process.env.DB_PORT || 5432),
    };

    if (!dbConfig.user || !dbConfig.password || !dbConfig.host || !dbConfig.database) {
        throw new Error('Configure DATABASE_URL ou as variáveis DB_USER, DB_PASSWORD, DB_SERVER e DB_DATABASE.');
    }

    return dbConfig;
}

const pool = new Pool(montarConfigBanco());

pool.on('error', (erro) => {
    console.error('❌ Erro inesperado no pool do PostgreSQL:', erro);
});

async function conectarBanco() {
    try {
        const client = await pool.connect();
        client.release();
        return pool;
    } catch (erro) {
        console.error('❌ Erro ao conectar no banco:', erro);
        throw erro;
    }
}

module.exports = { conectarBanco, pool };