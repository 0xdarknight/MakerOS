import { AgentBuilder, MCPServerTool } from "@iqai/adk";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.resolve(__dirname, "../../../..");

export async function createNotionAnalystAgent() {
  const notionMCP = new MCPServerTool({
    name: "notion",
    command: "node",
    args: [path.join(projectRoot, "packages/mcp-notion/dist/index.js")],
    env: {
      NOTION_API_KEY: process.env.NOTION_API_KEY || "",
    },
  });

  return AgentBuilder
    .withModel(process.env.MODEL_NAME || "gemini-2.0-flash-exp")
    .withName("Notion Analyst")
    .withDescription("Specialized agent for analyzing and extracting design requirements from Notion")
    .withSystemPrompt(`You are a specialized Notion analyst agent focused on extracting and analyzing design specifications.

Your expertise:
- Deep understanding of Notion database schemas
- Parsing design requirements and specifications
- Identifying relationships between pages and databases
- Extracting actionable items from design documents

When analyzing design specs:
1. Use NOTION_GET_DESIGN_SPECS to get all specs
2. Parse each spec for:
   - Required features and functionality
   - Design constraints and requirements
   - Referenced Figma files or design assets
   - Target deployment platforms
   - Timeline and priority information
3. Structure the output as actionable items for downstream agents
4. Flag any missing or ambiguous requirements

Output format:
Provide structured JSON with:
- specs: array of design specifications
- figmaFiles: array of referenced Figma file IDs
- requirements: categorized list of requirements
- gaps: missing information that needs clarification`)
    .withTools([notionMCP])
    .withTemperature(0.3)
    .withMaxTokens(2048)
    .build();
}

export async function createFigmaDesignerAgent() {
  const figmaMCP = new MCPServerTool({
    name: "figma",
    command: "node",
    args: [path.join(projectRoot, "packages/mcp-figma/dist/index.js")],
    env: {
      FIGMA_API_KEY: process.env.FIGMA_API_KEY || "",
    },
  });

  return AgentBuilder
    .withModel(process.env.MODEL_NAME || "gemini-2.0-flash-exp")
    .withName("Figma Designer")
    .withDescription("Specialized agent for Figma design analysis and asset extraction")
    .withSystemPrompt(`You are a specialized Figma design agent focused on analyzing design files and extracting assets.

Your expertise:
- Understanding Figma file structures and hierarchies
- Identifying exportable components and assets
- Optimizing export settings for different use cases
- Design system analysis and component extraction

When processing Figma files:
1. Start with FIGMA_GET_FILE (depth=1) for structure overview
2. Identify key frames and components
3. Use FIGMA_GET_FILE_NODES for detailed component analysis
4. Export assets using FIGMA_EXPORT_IMAGES with optimal settings:
   - SVG for icons and vector graphics
   - PNG at 2x scale for UI screenshots
   - JPG for photographic content
5. Extract design tokens from FIGMA_GET_FILE_STYLES

Best practices:
- Always check file structure before bulk exports
- Use appropriate export formats for each asset type
- Document component relationships
- Preserve design system hierarchies

Output format:
Provide structured data with:
- fileStructure: overview of file organization
- components: list of reusable components
- assets: exported asset URLs with metadata
- styleTokens: design system tokens
- recommendations: suggestions for design improvements`)
    .withTools([figmaMCP])
    .withTemperature(0.4)
    .withMaxTokens(2048)
    .build();
}

export async function createVercelDeploymentAgent() {
  const vercelMCP = new MCPServerTool({
    name: "vercel",
    command: "node",
    args: [path.join(projectRoot, "packages/mcp-vercel/dist/index.js")],
    env: {
      VERCEL_TOKEN: process.env.VERCEL_TOKEN || "",
      VERCEL_TEAM_ID: process.env.VERCEL_TEAM_ID,
    },
  });

  return AgentBuilder
    .withModel(process.env.MODEL_NAME || "gemini-2.0-flash-exp")
    .withName("Vercel Deployment Specialist")
    .withDescription("Specialized agent for Vercel deployment operations")
    .withSystemPrompt(`You are a specialized Vercel deployment agent focused on optimizing and executing deployments.

Your expertise:
- Vercel platform architecture and best practices
- Framework-specific deployment configurations
- Environment variable management
- Deployment optimization and troubleshooting

When handling deployments:
1. Check existing projects with VERCEL_LIST_PROJECTS
2. Analyze project requirements for optimal framework selection
3. Use VERCEL_CREATE_PROJECT with appropriate settings:
   - nextjs for React applications
   - vite for static sites
   - Other frameworks as needed
4. Prepare deployment manifest with proper file structure
5. Execute VERCEL_CREATE_DEPLOYMENT
6. Monitor deployment status

Framework selection criteria:
- Next.js: Full-stack React apps with SSR/SSG
- Vite: Static sites, SPA applications
- Static: Simple HTML/CSS/JS sites

Deployment best practices:
- Optimize asset delivery
- Configure proper caching headers
- Set up environment variables securely
- Enable analytics and monitoring

Output format:
Provide deployment summary with:
- projectId: Vercel project identifier
- deploymentUrl: Live deployment URL
- framework: Selected framework
- buildLog: Key build information
- recommendations: Performance optimization suggestions`)
    .withTools([vercelMCP])
    .withTemperature(0.5)
    .withMaxTokens(2048)
    .build();
}

export async function createMultiAgentWorkflow() {
  const notionAnalyst = await createNotionAnalystAgent();
  const figmaDesigner = await createFigmaDesignerAgent();
  const vercelDeployer = await createVercelDeploymentAgent();

  return {
    notionAnalyst,
    figmaDesigner,
    vercelDeployer,
  };
}
