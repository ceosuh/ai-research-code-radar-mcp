# 🔬 AI Research & Open-Source Code Radar (MCP Server)

An official Model Context Protocol (MCP) server that fetches **latest arXiv research papers (abstracts + direct PDF links), top-starred GitHub open-source repositories, and Dev.to technical articles** in a single call.

Powered by Apify (`ceosuh/ai-research-code-radar-mcp`) and optimized for **Claude Desktop, Cursor, Windsurf, and Autonomous Coding Agents**.

## 🚀 Quick Start (Claude Desktop / Cursor)

Add the following configuration to your `claude_desktop_config.json` or Cursor MCP settings:

```json
{
  "mcpServers": {
    "ai-research-code-radar-mcp": {
      "command": "npx",
      "args": [
        "-y",
        "@apify/actors-mcp-server",
        "--actors",
        "ceosuh/ai-research-code-radar-mcp"
      ],
      "env": {
        "APIFY_TOKEN": "your-apify-api-token"
      }
    }
  }
}
```

### Alternative: Run Local Bridge Directly

```bash
export APIFY_TOKEN="your-apify-api-token"
node index.js
```

## 🛠️ Tool Provided

* **`fetch_ai_research_and_code`**: Searches arXiv papers, GitHub repositories, and Dev.to articles simultaneously for any AI or software engineering topic.

## 📄 License

MIT License
