import { AgentBuilder, McpToolset } from "@iqai/adk";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface WorkflowContext {
  databaseId: string;
  figmaFileKey?: string;
  vercelProjectId?: string;
  sessionId?: string;
}

export interface WorkflowResult {
  success: boolean;
  designSpecs?: any[];
  figmaExports?: Record<string, string>;
  deploymentUrl?: string;
  vercelProjectId?: string;
  notionUpdated?: boolean;
  errors?: string[];
  sessionId: string;
}

export async function createDesignDeployAgent() {
  const projectRoot = path.resolve(__dirname, "../../../..");

  const notionMCP = new McpToolset({
    name: "notion",
    command: "node",
    args: [path.join(projectRoot, "packages/mcp-notion/dist/index.js")],
    env: {
      NOTION_API_KEY: process.env.NOTION_API_KEY || "",
    },
  });

  const figmaMCP = new McpToolset({
    name: "figma",
    command: "node",
    args: [path.join(projectRoot, "packages/mcp-figma/dist/index.js")],
    env: {
      FIGMA_API_KEY: process.env.FIGMA_API_KEY || "",
    },
  });

  const vercelMCP = new McpToolset({
    name: "vercel",
    command: "node",
    args: [path.join(projectRoot, "packages/mcp-vercel/dist/index.js")],
    env: {
      VERCEL_TOKEN: process.env.VERCEL_TOKEN || "",
      VERCEL_TEAM_ID: process.env.VERCEL_TEAM_ID,
    },
  });

  const agent = AgentBuilder
    .withModel(process.env.MODEL_NAME || "gemini-2.0-flash-exp")
    .withName("Maker OS Agent")
    .withDescription("Intelligent automation OS for design-to-deployment workflows")
    .withSystemPrompt(`You are Maker OS, an intelligent automation operating system that orchestrates complex design-to-deployment workflows.

CORE CAPABILITIES:
You have access to three integrated MCP servers that provide 19 specialized tools across the entire product lifecycle.

NOTION MCP TOOLS:
- NOTION_GET_DATABASE: Query full database structure and all entries
- NOTION_GET_DESIGN_SPECS: Filter and retrieve design specification entries with metadata
- NOTION_GET_PAGE: Retrieve detailed page information including blocks and properties
- NOTION_UPDATE_PAGE: Update page properties (use for tracking deployment URLs, status updates)

FIGMA MCP TOOLS:
- FIGMA_GET_FILE: Retrieve complete file structure with configurable depth traversal
- FIGMA_GET_FILE_NODES: Target specific node IDs for focused extraction
- FIGMA_EXPORT_IMAGES: Export nodes as PNG/JPG/SVG/PDF with scale parameters (0.01-4x)
- FIGMA_GET_COMMENTS: Retrieve design feedback and collaboration threads
- FIGMA_POST_COMMENT: Add comments for automated documentation
- FIGMA_GET_TEAM_PROJECTS: List all projects in a team workspace
- FIGMA_GET_PROJECT_FILES: Enumerate files within a project
- FIGMA_GET_FILE_COMPONENTS: Extract reusable component library
- FIGMA_GET_FILE_STYLES: Get design system style definitions

VERCEL MCP TOOLS:
- VERCEL_LIST_PROJECTS: Enumerate all projects in account/team
- VERCEL_GET_PROJECT: Retrieve detailed project configuration
- VERCEL_CREATE_PROJECT: Initialize new project with framework settings
- VERCEL_CREATE_DEPLOYMENT: Deploy with file manifests and configuration
- VERCEL_LIST_DEPLOYMENTS: Get deployment history with filtering
- VERCEL_GET_DEPLOYMENT: Retrieve deployment status and metadata

WORKFLOW EXECUTION STRATEGY:

Phase 1: Discovery & Analysis
- Use NOTION_GET_DESIGN_SPECS to retrieve structured requirements
- Parse design specifications for Figma file references
- Identify existing Vercel projects or determine need for new project

Phase 2: Design Asset Processing
- Use FIGMA_GET_FILE with depth=1 initially for structure overview
- Navigate to specific frames/components based on spec requirements
- Use FIGMA_EXPORT_IMAGES with appropriate format (SVG for icons, PNG for screenshots)
- Extract design tokens from FIGMA_GET_FILE_STYLES if building design system

Phase 3: Deployment Orchestration
- Check existing projects with VERCEL_LIST_PROJECTS
- Create new project if needed using VERCEL_CREATE_PROJECT with appropriate framework
- Prepare deployment manifest with exported assets
- Execute VERCEL_CREATE_DEPLOYMENT with proper file structure
- Poll deployment status if needed

Phase 4: Tracking & Documentation
- Use NOTION_UPDATE_PAGE to record:
  - Deployment URL
  - Vercel project ID
  - Figma export links
  - Timestamp and status
- Optionally use FIGMA_POST_COMMENT to link back to deployment

ERROR HANDLING:
- If a tool fails, explain the error clearly and suggest remediation
- For missing resources, guide user on how to configure access
- For API rate limits, inform user and suggest retry strategy

RESPONSE FORMAT:
Provide structured updates after each phase:
1. What you're doing
2. Which tools you're using
3. Results or data retrieved
4. Next steps

Be concise, technical, and actionable. Report exact IDs, URLs, and keys for reproducibility.`)
    .withTools([notionMCP, figmaMCP, vercelMCP])
    .withTemperature(0.7)
    .withMaxTokens(4096);

  return agent.build();
}

export async function runDesignDeployWorkflow(
  databaseId: string,
  figmaFileKey?: string,
  vercelProjectId?: string
) {
  const agent = await createDesignDeployAgent();

  const workflow = `
Execute the following design-to-deployment workflow:

1. Fetch design specifications from Notion database ID: ${databaseId}
2. ${figmaFileKey ? `Review the Figma file ${figmaFileKey} and export relevant design assets` : 'If a Figma file key is mentioned in the design spec, export assets from it'}
3. ${vercelProjectId ? `Deploy to existing Vercel project ${vercelProjectId}` : 'Create a new Vercel project for the design'}
4. Update the Notion database with the deployment URL and project IDs

Provide a clear summary of each step as you complete it.
  `;

  const response = await agent.ask(workflow);
  return response;
}
