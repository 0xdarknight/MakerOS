#!/usr/bin/env node
import { FastMCP } from "fastmcp";
import {
  listProjectsTool,
  getProjectTool,
  createProjectTool,
  createDeploymentTool,
  listDeploymentsTool,
  getDeploymentTool,
} from "./tools/vercel-tools.js";

async function main() {
  const server = new FastMCP({
    name: "Vercel MCP Server",
    version: "1.0.0",
  });

  server.addTool(listProjectsTool);
  server.addTool(getProjectTool);
  server.addTool(createProjectTool);
  server.addTool(createDeploymentTool);
  server.addTool(listDeploymentsTool);
  server.addTool(getDeploymentTool);

  try {
    await server.start({
      transportType: "stdio",
    });
    console.error("Vercel MCP Server started successfully over stdio.");
  } catch (error) {
    console.error("Failed to start Vercel MCP Server:", error);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error("An unexpected error occurred in the Vercel MCP Server:", error);
  process.exit(1);
});
