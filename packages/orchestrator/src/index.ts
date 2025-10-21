import dotenv from "dotenv";
import { createDesignDeployAgent, runDesignDeployWorkflow } from "./agents/design-deploy-agent.js";
import { executeWorkflow } from "./workflows/orchestration.js";

dotenv.config();

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args[0] === "--help") {
    console.log(`
╔═══════════════════════════════════════════════════════════════╗
║                        MAKER OS                                ║
║          Intelligent Design-to-Deployment Automation           ║
╚═══════════════════════════════════════════════════════════════╝

USAGE:
  npm start <notion-database-id> [options]

ARGUMENTS:
  notion-database-id    Required. Notion database containing design specs

OPTIONS:
  --figma <file-key>    Figma file key to process
  --vercel <project>    Existing Vercel project ID
  --mode <mode>         Execution mode: "parallel" (default) or "sequential"
  --multi-agent         Use multi-agent orchestration workflow
  --help                Show this help message

EXAMPLES:
  Basic workflow:
    npm start abc123

  With Figma file:
    npm start abc123 --figma figma-xyz

  Full specification:
    npm start abc123 --figma figma-xyz --vercel vercel-proj

  Multi-agent orchestration:
    npm start abc123 --multi-agent --mode sequential

ENVIRONMENT VARIABLES:
  Required:
    NOTION_API_KEY          Your Notion integration token
    FIGMA_API_KEY           Your Figma personal access token
    VERCEL_TOKEN            Your Vercel authentication token
    GEMINI_API_KEY          Your Google Gemini API key (or OPENAI_API_KEY/ANTHROPIC_API_KEY)

  Optional:
    VERCEL_TEAM_ID          Vercel team ID (if using team account)
    MODEL_NAME              LLM model (default: gemini-2.0-flash-exp)

WORKFLOW MODES:
  Parallel (Default):
    - Single unified agent orchestrates all MCPs
    - Optimized for speed and efficiency
    - Best for straightforward workflows

  Sequential:
    - Specialized agents for each platform
    - Deep analysis and optimization
    - Step-by-step execution with detailed logging

  Multi-Agent:
    - Collaborative agent system
    - Notion Analyst + Figma Designer + Vercel Deployer
    - Session management and state tracking
    - Production-grade error handling

TECHNICAL ARCHITECTURE:
  • 3 Custom MCP Servers (19 specialized tools)
  • ADK-TS Agent Orchestration
  • Multi-agent collaboration system
  • Session-based workflow management
  • Type-safe TypeScript implementation

For more information, see README.md
    `);
    process.exit(0);
  }

  const databaseId = args[0];
  let figmaFileKey: string | undefined;
  let vercelProjectId: string | undefined;
  let mode: "parallel" | "sequential" = "parallel";
  let useMultiAgent = false;

  for (let i = 1; i < args.length; i++) {
    switch (args[i]) {
      case "--figma":
        figmaFileKey = args[++i];
        break;
      case "--vercel":
        vercelProjectId = args[++i];
        break;
      case "--mode":
        mode = args[++i] as "parallel" | "sequential";
        break;
      case "--multi-agent":
        useMultiAgent = true;
        break;
    }
  }

  console.log(`
╔═══════════════════════════════════════════════════════════════╗
║                   MAKER OS EXECUTION                           ║
╚═══════════════════════════════════════════════════════════════╝
`);
  console.log(`Session ID: session_${Date.now()}`);
  console.log(`Mode: ${useMultiAgent ? "Multi-Agent" : "Unified Agent"} (${mode})`);
  console.log(`Notion Database: ${databaseId}`);
  if (figmaFileKey) console.log(`Figma File: ${figmaFileKey}`);
  if (vercelProjectId) console.log(`Vercel Project: ${vercelProjectId}`);
  console.log("");

  try {
    let result;

    if (useMultiAgent) {
      console.log("Using multi-agent orchestration workflow...\n");
      result = await executeWorkflow(
        { databaseId, figmaFileKey, vercelProjectId },
        mode
      );
    } else {
      console.log("Using unified agent workflow...\n");
      result = await runDesignDeployWorkflow(databaseId, figmaFileKey, vercelProjectId);
    }

    console.log(`
╔═══════════════════════════════════════════════════════════════╗
║                    WORKFLOW COMPLETED                          ║
╚═══════════════════════════════════════════════════════════════╝
`);
    console.log(result);
  } catch (error) {
    console.error(`
╔═══════════════════════════════════════════════════════════════╗
║                      WORKFLOW FAILED                           ║
╚═══════════════════════════════════════════════════════════════╝
`);
    console.error("Error:", error);
    process.exit(1);
  }
}

main();
