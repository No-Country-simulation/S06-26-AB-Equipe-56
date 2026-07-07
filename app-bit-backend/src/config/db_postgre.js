const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

const conectarBanco = async () => {
    try {
        return pool;
    } catch (err) {
        console.error("Erro ao conectar no banco de dados: ", err);
        throw err;
    }
};

module.exports = {
    conectarBanco
};