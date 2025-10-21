#!/usr/bin/env node
import { FastMCP } from "fastmcp";
import {
  getFileTool,
  getFileNodesTool,
  exportImagesTool,
  getCommentsTool,
  postCommentTool,
  getTeamProjectsTool,
  getProjectFilesTool,
  getFileComponentsTool,
  getFileStylesTool,
} from "./tools/figma-tools.js";

async function main() {
  const server = new FastMCP({
    name: "Figma MCP Server",
    version: "1.0.0",
  });

  server.addTool(getFileTool);
  server.addTool(getFileNodesTool);
  server.addTool(exportImagesTool);
  server.addTool(getCommentsTool);
  server.addTool(postCommentTool);
  server.addTool(getTeamProjectsTool);
  server.addTool(getProjectFilesTool);
  server.addTool(getFileComponentsTool);
  server.addTool(getFileStylesTool);

  try {
    await server.start({
      transportType: "stdio",
    });
    console.error("Figma MCP Server started successfully over stdio.");
  } catch (error) {
    console.error("Failed to start Figma MCP Server:", error);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error("An unexpected error occurred in the Figma MCP Server:", error);
  process.exit(1);
});
