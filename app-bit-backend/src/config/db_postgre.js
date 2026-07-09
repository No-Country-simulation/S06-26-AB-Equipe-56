const { Pool } = require('pg');
require('dotenv').config();

// Monta a configuração de conexão autenticando o servidor via SSL.
// Os parâmetros de SSL da URL (sslmode/channel_binding) são removidos para
// controlarmos o TLS explicitamente aqui — isso evita o aviso de deprecação
// do driver 'pg' e mantém a verificação do certificado do servidor.
function montarConfig() {
    const databaseUrl = process.env.DATABASE_URL;

    if (!databaseUrl) {
        throw new Error("DATABASE_URL não configurada");
    }

    const url = new URL(databaseUrl);
    url.searchParams.delete('sslmode');
    url.searchParams.delete('channel_binding');

    // Por padrão o certificado do servidor é verificado (conexão segura).
    // Defina DB_SSL_REJECT_UNAUTHORIZED=false apenas para bancos locais/self-signed.
    const rejectUnauthorized = process.env.DB_SSL_REJECT_UNAUTHORIZED !== 'false';

    return {
        connectionString: url.toString(),
        ssl: {
            require: true,
            rejectUnauthorized
        }
    };
}

const pool = new Pool(montarConfig());

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
