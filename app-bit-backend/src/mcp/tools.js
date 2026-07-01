// Exemplo em Node.js (JavaScript Puro)
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

const server = new McpServer({ name: "rh-server", version: "1.0.0" });

server.registerTool(
  {
    name: "buscar_candidatos",
    description: "Busca a lista de candidatos para o score",
    inputSchema: z.object({
      vaga_contexto: z.string().describe("Nome da vaga")
    })
  },
  async ({ vaga_contexto }) => {
    // Sua lógica do Controller aqui...
    return {
      content: [{ type: "text", text: "dados" }]
    };
  }
);