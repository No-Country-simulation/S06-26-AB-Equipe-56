require("dotenv").config();

const http = require("http");

const DEFAULT_PORT = 3000;

function getDbConfig() {
  return {
    databaseUrl: process.env.DATABASE_URL,
    port: Number(process.env.PORT || DEFAULT_PORT),
  };
}

function createSqlClient() {
  const { databaseUrl } = getDbConfig();

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not configured");
  }

  const { neon } = require("@neondatabase/serverless");
  return neon(databaseUrl);
}

function startServer() {
  const { port } = getDbConfig();
  const sql = createSqlClient();

  const requestHandler = async (req, res) => {
    const result = await sql`SELECT version()`;
    const { version } = result[0];
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end(version);
  };

  return http.createServer(requestHandler).listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

module.exports = {
  getDbConfig,
  createSqlClient,
  startServer,
};

if (require.main === module) {
  startServer();
}