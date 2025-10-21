#!/usr/bin/env node
import { FastMCP } from "fastmcp";
import {
  getDatabaseTool,
  getDesignSpecsTool,
  getPageTool,
  updatePageTool,
} from "./tools/notion-tools.js";

async function main() {
  const server = new FastMCP({
    name: "Notion MCP Server",
    version: "1.0.0",
  });

  server.addTool(getDatabaseTool);
  server.addTool(getDesignSpecsTool);
  server.addTool(getPageTool);
  server.addTool(updatePageTool);

  try {
    await server.start({
      transportType: "stdio",
    });
    console.error("Notion MCP Server started successfully over stdio.");
  } catch (error) {
    console.error("Failed to start Notion MCP Server:", error);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error("An unexpected error occurred in the Notion MCP Server:", error);
  process.exit(1);
});
