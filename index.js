#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";

const APIFY_TOKEN = process.env.APIFY_TOKEN;
const ACTOR_ID = "ceosuh~ai-research-code-radar-mcp";

const server = new Server(
  { name: "ai-research-code-radar-mcp", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "fetch_ai_research_and_code",
      description: "Fetch latest arXiv research papers, top GitHub open-source repositories, and Dev.to developer articles for given tech topics.",
      inputSchema: {
        type: "object",
        properties: {
          queries: {
            type: "array",
            items: { type: "string" },
            description: "Research topics or coding keywords (e.g., ['Model Context Protocol', 'Agentic RAG'])",
            default: ["Model Context Protocol", "Agentic RAG"]
          },
          maxResultsPerSource: {
            type: "number",
            description: "Maximum items per platform (1-15)",
            default: 5
          },
          githubSort: {
            type: "string",
            enum: ["stars", "updated", "best-match"],
            description: "Sort order for GitHub repositories",
            default: "stars"
          }
        },
        required: ["queries"]
      }
    }
  ]
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name !== "fetch_ai_research_and_code") {
    throw new Error(`Unknown tool: ${request.params.name}`);
  }
  if (!APIFY_TOKEN) {
    throw new Error("Missing APIFY_TOKEN environment variable. Get yours at https://console.apify.com/settings/integrations");
  }

  const response = await fetch(
    `https://api.apify.com/v2/acts/${ACTOR_ID}/run-sync-get-dataset-items?token=${APIFY_TOKEN}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request.params.arguments || {})
    }
  );

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Apify API error (${response.status}): ${errText}`);
  }

  const data = await response.json();
  return {
    content: [{ type: "text", text: JSON.stringify(data, null, 2) }]
  };
});

const transport = new StdioServerTransport();
await server.connect(transport);
