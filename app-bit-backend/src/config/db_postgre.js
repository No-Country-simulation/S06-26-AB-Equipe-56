require('dotenv').config();
const { Pool } = require('pg');

// Monta a configuração de conexão do PostgreSQL.
// Preferimos DATABASE_URL (ex.: Neon, com SSL). Se não houver, caímos para as
// variáveis discretas DB_* (ex.: PostgreSQL local do time). Assim os dois
// ambientes funcionam sem quebrar o fluxo de ninguém.
function montarConfig() {
    const databaseUrl = process.env.DATABASE_URL;

    if (databaseUrl) {
        const url = new URL(databaseUrl);
        // Removemos os params de SSL da URL para controlar o TLS explicitamente
        // (evita o aviso de deprecação do 'pg' e mantém a verificação do certificado).
        url.searchParams.delete('sslmode');
        url.searchParams.delete('channel_binding');

        // Por padrão o certificado do servidor é verificado (conexão segura).
        // Defina DB_SSL_REJECT_UNAUTHORIZED=false para bancos self-signed.
        const rejectUnauthorized = process.env.DB_SSL_REJECT_UNAUTHORIZED !== 'false';

        return {
            connectionString: url.toString(),
            ssl: { require: true, rejectUnauthorized }
        };
    }

    // Fallback: variáveis discretas (host/user/senha separados)
    const config = {
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        host: process.env.DB_SERVER,       // No 'pg', usamos 'host' em vez de 'server'
        database: process.env.DB_DATABASE,
        port: process.env.DB_PORT || 5432, // O padrão do Postgres é 5432
    };

    // SSL opcional para o modo discreto (ex.: DB_SSL=true em produção)
    if (process.env.DB_SSL === 'true') {
        config.ssl = { rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED !== 'false' };
    }

    return config;
}

// Criamos o pool de conexões
const pool = new Pool(montarConfig());

async function conectarBanco() {
    try {
        // No 'pg', pegamos um cliente rápido do pool para testar a conexão
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

// Teste de conexão no start. O .catch evita que uma falha aqui derrube o
// processo (unhandled rejection) — o erro é logado e cada request tenta de novo.
conectarBanco().catch(() => {});

// Exportamos o pool (equivalente ao 'sql' do mssql para fazer queries)
module.exports = { conectarBanco, pool };
