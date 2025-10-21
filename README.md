# MakerOS

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [System Components](#system-components)
- [Technical Stack](#technical-stack)
- [MCP Server Implementation](#mcp-server-implementation)
- [Agent Orchestration](#agent-orchestration)
- [Workflow Execution](#workflow-execution)
- [API Reference](#api-reference)
- [Development Guide](#development-guide)
- [Deployment](#deployment)
- [Advanced Topics](#advanced-topics)

---

## TL, DR

MakerOS is an intelligent design-to-deployment platform built on the ADK-TS framework. It orchestrates workflows across three critical platforms (Notion, Figma, Vercel) using the Model Context Protocol and AI agent orchestration.

### Core Architecture Pattern

```
┌─────────────────────────────────────────────────────────────┐
│                    MAKEROS ARCHITECTURE                      │
└─────────────────────────────────────────────────────────────┘

INPUT LAYER
┌──────────────────────┐
│  CLI / REST / Web UI │
└──────────┬───────────┘
           │
ORCHESTRATION LAYER
┌──────────▼──────────────────────────────────────────────────┐
│ ADK-TS Orchestrator (Gemini 2.0 Flash Exp)                  │
│ ┌────────────────────────────────────────────────────────┐  │
│ │ Unified Agent Mode (Parallel Execution)                │  │
│ │ - Single agent with all 19 MCP tools                   │  │
│ │ - Optimized for speed                                  │  │
│ │ - Temperature: 0.7, Max Tokens: 4096                   │  │
│ └────────────────────────────────────────────────────────┘  │
│ ┌────────────────────────────────────────────────────────┐  │
│ │ Multi-Agent Mode (Sequential Execution)                │  │
│ │ - Notion Analyst (T: 0.3, Tokens: 2048)                │  │
│ │ - Figma Designer (T: 0.4, Tokens: 2048)                │  │
│ │ - Vercel Deployer (T: 0.5, Tokens: 2048)               │  │
│ └────────────────────────────────────────────────────────┘  │
└──────────┬──────────────────────────────────────────────────┘
           │
MCP LAYER (stdio Transport)
┌──────────┼──────────────┬────────────┐
│          │              │            │
▼          ▼              ▼            ▼
┌──────────┐  ┌──────────┐  ┌──────────┐
│ Notion   │  │  Figma   │  │  Vercel  │
│ MCP      │  │  MCP     │  │  MCP     │
│ 4 tools  │  │  9 tools │  │  6 tools │
└────┬─────┘  └────┬─────┘  └────┬─────┘
     │             │             │
EXTERNAL API LAYER
     │             │             │
     ▼             ▼             ▼
┌─────────┐  ┌─────────┐  ┌──────────┐
│ Notion  │  │  Figma  │  │  Vercel  │
│   API   │  │   API   │  │   API    │
└─────────┘  └─────────┘  └──────────┘
```

### Monorepo Structure

```
MakerOS/
├── packages/
│   ├── mcp-figma/           # Figma MCP Server
│   │   ├── src/
│   │   │   ├── index.ts              # FastMCP server bootstrap
│   │   │   ├── figma-service.ts      # Figma API wrapper
│   │   │   └── figma-tools.ts        # Tool definitions
│   │   ├── dist/                     # Compiled output
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── mcp-notion/          # Notion MCP Server
│   │   ├── src/
│   │   │   ├── index.ts              # FastMCP server bootstrap
│   │   │   ├── notion-service.ts     # Notion API wrapper
│   │   │   └── notion-tools.ts       # Tool definitions
│   │   ├── dist/
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── mcp-vercel/          # Vercel MCP Server
│   │   ├── src/
│   │   │   ├── index.ts              # FastMCP server bootstrap
│   │   │   ├── vercel-service.ts     # Vercel API wrapper
│   │   │   └── vercel-tools.ts       # Tool definitions
│   │   ├── dist/
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── orchestrator/        # ADK-TS Agent Orchestration
│   │   ├── src/
│   │   │   ├── index.ts                      # CLI entry point
│   │   │   ├── server.ts                     # REST API server
│   │   │   ├── design-deploy-agent.ts        # Unified agent
│   │   │   ├── specialized-agents.ts         # Multi-agent setup
│   │   │   └── workflows/
│   │   │       └── orchestration.ts          # Workflow logic
│   │   ├── dist/
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── web/                 # Next.js Web Interface
│       ├── src/
│       │   ├── components/              # UI components
│       │   ├── lib/                     # API client & context
│       │   └── pages/                   # Next.js pages
│       ├── .next/                       # Build output
│       ├── package.json
│       ├── tsconfig.json
│       ├── next.config.js
│       ├── tailwind.config.js
│       └── postcss.config.js
│
├── package.json              # Monorepo root
├── .env.example              # Environment template
├── .gitignore
├── LICENSE
└── README.md
```

**Statistics:**
- Total Source Files: 36 TypeScript/TSX files
- Total Lines of Code: 3,322 lines
- Total Size: 852KB (excluding node_modules)
- MCP Tools: 19 total (4 Notion + 9 Figma + 6 Vercel)

---

## System Components

### 1. MCP Servers

MakerOS implements three independent MCP servers, each providing a toolset for interacting with a specific platform. All servers use the **stdio transport** for communication and are built with **FastMCP v3.16.0**.

#### Notion MCP Server

**Location:** `/packages/mcp-notion/`
**Purpose:** Provides structured access to Notion databases and pages

**Architecture:**
```typescript
index.ts (FastMCP Bootstrap)
    │
    ├─> notion-service.ts (NotionService class)
    │   └─> @notionhq/client (Official SDK)
    │       └─> Notion REST API
    │
    └─> notion-tools.ts (Tool Definitions)
        └─> Zod Schemas for validation
```

**Tools Provided (4):**

1. **NOTION_GET_DATABASE**
   - **Purpose:** Query Notion database contents
   - **Input Schema:**
     - `databaseId` (string, required): Notion database ID
     - `filter` (object, optional): Notion API filter object
   - **Output:** Array of database entries with properties
   - **Implementation:** `NotionService.getDatabase()`

2. **NOTION_GET_DESIGN_SPECS**
   - **Purpose:** Filter design specification entries from a database
   - **Input Schema:**
     - `databaseId` (string, required): Notion database ID
   - **Output:** Structured design spec objects:
     ```typescript
     {
       id: string;
       title: string;
       description: string;
       requirements: string[];
       status: string;
       figmaFileId?: string;
       vercelProjectId?: string;
     }
     ```
   - **Implementation:** `NotionService.getDesignSpecs()`
   - **Use Case:** Primary entry point for workflow discovery phase

3. **NOTION_GET_PAGE**
   - **Purpose:** Retrieve specific page by ID
   - **Input Schema:**
     - `pageId` (string, required): Notion page ID
   - **Output:** Page object with properties and content
   - **Implementation:** `NotionService.getPage()`

4. **NOTION_UPDATE_PAGE**
   - **Purpose:** Update page properties
   - **Input Schema:**
     - `pageId` (string, required): Notion page ID
     - `properties` (object, required): Property updates
   - **Output:** Updated page object
   - **Implementation:** `NotionService.updatePage()`
   - **Use Case:** Tracking phase - update with deployment URLs

**Service Implementation:**
```typescript
class NotionService {
  private client: Client; // @notionhq/client

  constructor(apiKey: string) {
    this.client = new Client({ auth: apiKey });
  }

  async getDatabase(databaseId: string, filter?: any) {
    return await this.client.databases.query({
      database_id: databaseId,
      filter
    });
  }

  async getDesignSpecs(databaseId: string) {
    const response = await this.getDatabase(databaseId);
    return response.results.map(page => ({
      id: page.id,
      title: extractTitle(page),
      description: extractDescription(page),
      requirements: extractRequirements(page),
      status: extractStatus(page),
      figmaFileId: extractFigmaFileId(page),
      vercelProjectId: extractVercelProjectId(page)
    }));
  }

  // Additional methods...
}
```

**Environment Variables:**
- `NOTION_API_KEY` (required): Notion integration token

---

#### Figma MCP Server

**Location:** `/packages/mcp-figma/`
**Purpose:** Provides comprehensive Figma file and design operations

**Architecture:**
```typescript
index.ts (FastMCP Bootstrap)
    │
    ├─> figma-service.ts (FigmaService class)
    │   └─> axios (HTTP client)
    │       └─> Figma REST API
    │
    └─> figma-tools.ts (Tool Definitions)
        └─> Zod Schemas for validation
```

**Tools Provided (9):**

1. **FIGMA_GET_FILE**
   - **Purpose:** Retrieve complete file structure
   - **Input Schema:**
     - `fileKey` (string, required): Figma file key
     - `depth` (number, optional): Traversal depth (default: 2)
   - **Output:** File document tree with nodes
   - **API Endpoint:** `GET /v1/files/:key`

2. **FIGMA_GET_FILE_NODES**
   - **Purpose:** Get specific nodes by ID
   - **Input Schema:**
     - `fileKey` (string, required)
     - `nodeIds` (string[], required): Array of node IDs
   - **Output:** Node objects with properties
   - **API Endpoint:** `GET /v1/files/:key/nodes`

3. **FIGMA_EXPORT_IMAGES**
   - **Purpose:** Export design assets
   - **Input Schema:**
     - `fileKey` (string, required)
     - `nodeIds` (string[], required): Nodes to export
     - `format` (enum, required): 'jpg' | 'png' | 'svg' | 'pdf'
     - `scale` (number, optional): 0.01 to 4 (default: 1)
   - **Output:** Image URLs (valid for 14 days)
   - **API Endpoint:** `GET /v1/images/:key`
   - **Use Case:** Design processing phase - export assets for deployment

4. **FIGMA_GET_COMMENTS**
   - **Purpose:** Retrieve design feedback threads
   - **Input Schema:**
     - `fileKey` (string, required)
   - **Output:** Array of comment objects
   - **API Endpoint:** `GET /v1/files/:key/comments`

5. **FIGMA_POST_COMMENT**
   - **Purpose:** Add automated comments
   - **Input Schema:**
     - `fileKey` (string, required)
     - `message` (string, required): Comment text
     - `clientMeta` (object, optional): Position metadata
   - **Output:** Created comment object
   - **API Endpoint:** `POST /v1/files/:key/comments`

6. **FIGMA_GET_TEAM_PROJECTS**
   - **Purpose:** List projects in Figma team
   - **Input Schema:**
     - `teamId` (string, required): Figma team ID
   - **Output:** Array of project objects
   - **API Endpoint:** `GET /v1/teams/:team_id/projects`

7. **FIGMA_GET_PROJECT_FILES**
   - **Purpose:** Enumerate files in project
   - **Input Schema:**
     - `projectId` (string, required): Figma project ID
   - **Output:** Array of file metadata
   - **API Endpoint:** `GET /v1/projects/:project_id/files`

8. **FIGMA_GET_FILE_COMPONENTS**
   - **Purpose:** Extract reusable components
   - **Input Schema:**
     - `fileKey` (string, required)
   - **Output:** Component definitions
   - **API Endpoint:** `GET /v1/files/:key/components`

9. **FIGMA_GET_FILE_STYLES**
   - **Purpose:** Get design system tokens
   - **Input Schema:**
     - `fileKey` (string, required)
   - **Output:** Style definitions (colors, text, effects)
   - **API Endpoint:** `GET /v1/files/:key/styles`

**Service Implementation:**
```typescript
class FigmaService {
  private apiKey: string;
  private baseUrl = 'https://api.figma.com/v1';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async getFile(fileKey: string, depth?: number) {
    return await axios.get(`${this.baseUrl}/files/${fileKey}`, {
      headers: { 'X-Figma-Token': this.apiKey },
      params: { depth }
    });
  }

  async exportImages(fileKey: string, nodeIds: string[], format: string, scale?: number) {
    const ids = nodeIds.join(',');
    return await axios.get(`${this.baseUrl}/images/${fileKey}`, {
      headers: { 'X-Figma-Token': this.apiKey },
      params: { ids, format, scale }
    });
  }

  // Additional methods...
}
```

**Environment Variables:**
- `FIGMA_API_KEY` (required): Figma personal access token

---

#### Vercel MCP Server

**Location:** `/packages/mcp-vercel/`
**Purpose:** Provides deployment orchestration capabilities

**Architecture:**
```typescript
index.ts (FastMCP Bootstrap)
    │
    ├─> vercel-service.ts (VercelService class)
    │   └─> axios (HTTP client)
    │       └─> Vercel REST API
    │
    └─> vercel-tools.ts (Tool Definitions)
        └─> Zod Schemas for validation
```

**Tools Provided (6):**

1. **VERCEL_LIST_PROJECTS**
   - **Purpose:** Enumerate all projects
   - **Input Schema:** None
   - **Output:** Array of project objects
   - **API Endpoint:** `GET /v9/projects`

2. **VERCEL_GET_PROJECT**
   - **Purpose:** Get project details
   - **Input Schema:**
     - `projectId` (string, required): Project ID or name
   - **Output:** Project object with configuration
   - **API Endpoint:** `GET /v9/projects/:id`

3. **VERCEL_CREATE_PROJECT**
   - **Purpose:** Create new project
   - **Input Schema:**
     - `name` (string, required): Project name
     - `framework` (enum, optional): 'nextjs' | 'vite' | 'static' (default: 'nextjs')
   - **Output:** Created project object
   - **API Endpoint:** `POST /v9/projects`
   - **Use Case:** Deployment phase - create project if not exists

4. **VERCEL_CREATE_DEPLOYMENT**
   - **Purpose:** Deploy with file manifests
   - **Input Schema:**
     - `projectId` (string, required)
     - `files` (array, required): File manifests
       ```typescript
       {
         file: string;      // File path
         data: string;      // Base64 or text content
         encoding?: string; // 'base64' | 'utf-8'
       }
       ```
     - `target` (enum, optional): 'production' | 'preview'
   - **Output:** Deployment object with URL
   - **API Endpoint:** `POST /v13/deployments`
   - **Use Case:** Deployment phase - create deployment

5. **VERCEL_LIST_DEPLOYMENTS**
   - **Purpose:** Get deployment history
   - **Input Schema:**
     - `projectId` (string, optional): Filter by project
     - `limit` (number, optional): Max results (default: 20)
   - **Output:** Array of deployment objects
   - **API Endpoint:** `GET /v6/deployments`

6. **VERCEL_GET_DEPLOYMENT**
   - **Purpose:** Retrieve deployment status
   - **Input Schema:**
     - `deploymentId` (string, required): Deployment ID or URL
   - **Output:** Deployment object with status
   - **API Endpoint:** `GET /v13/deployments/:id`

**Service Implementation:**
```typescript
class VercelService {
  private apiKey: string;
  private teamId?: string;
  private baseUrl = 'https://api.vercel.com';

  constructor(apiKey: string, teamId?: string) {
    this.apiKey = apiKey;
    this.teamId = teamId;
  }

  private getHeaders() {
    return {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json'
    };
  }

  private getParams() {
    return this.teamId ? { teamId: this.teamId } : {};
  }

  async createProject(name: string, framework: string) {
    return await axios.post(`${this.baseUrl}/v9/projects`, {
      name,
      framework
    }, {
      headers: this.getHeaders(),
      params: this.getParams()
    });
  }

  async createDeployment(projectId: string, files: any[], target: string) {
    return await axios.post(`${this.baseUrl}/v13/deployments`, {
      name: projectId,
      files,
      target
    }, {
      headers: this.getHeaders(),
      params: this.getParams()
    });
  }

  // Additional methods...
}
```

**Environment Variables:**
- `VERCEL_API_KEY` (required): Vercel API token
- `VERCEL_TEAM_ID` (optional): Team ID for team accounts

---

### 2. Agent Orchestration

MakerOS uses the **ADK-TS framework** (@iqai/adk) to orchestrate AI agents that intelligently use MCP tools. The orchestrator supports two execution patterns: **Unified Agent** and **Multi-Agent**.

#### Unified Agent Mode

**Location:** `/packages/orchestrator/src/design-deploy-agent.ts`

**Purpose:** Single agent with all 19 MCP tools for fast, parallel execution

**Configuration:**
```typescript
{
  model: "gemini-2.0-flash-exp",
  temperature: 0.7,
  maxTokens: 4096,
  mcpServers: {
    notion: {
      command: "node",
      args: ["../mcp-notion/dist/index.js"],
      transport: "stdio"
    },
    figma: {
      command: "node",
      args: ["../mcp-figma/dist/index.js"],
      transport: "stdio"
    },
    vercel: {
      command: "node",
      args: ["../mcp-vercel/dist/index.js"],
      transport: "stdio"
    }
  }
}
```

**System Prompt Strategy:**
The unified agent receives a comprehensive 4-phase workflow prompt:

```typescript
const systemPrompt = `
You are MakerOS, an intelligent design-to-deployment automation agent.

WORKFLOW PHASES:
1. Discovery & Analysis (Notion)
   - Use NOTION_GET_DESIGN_SPECS to query database
   - Extract: title, description, requirements, figmaFileId, vercelProjectId
   - Identify deployment targets

2. Design Asset Processing (Figma)
   - If figmaFileId specified, use FIGMA_GET_FILE
   - Export assets with FIGMA_EXPORT_IMAGES (PNG, scale: 2)
   - Optional: Use FIGMA_GET_COMMENTS for feedback

3. Deployment Orchestration (Vercel)
   - Create project with VERCEL_CREATE_PROJECT if needed
   - Deploy with VERCEL_CREATE_DEPLOYMENT
   - Use framework: nextjs (default), vite, or static

4. Tracking & Documentation (Notion)
   - Update original page with NOTION_UPDATE_PAGE
   - Add deployment URL and status

TOOL USAGE GUIDELINES:
- Always validate IDs before calling tools
- Handle errors gracefully
- Provide detailed status updates
- Return structured JSON results

EXECUTION PARAMETERS:
- Input: Notion Database ID, optional Figma File Key, optional Vercel Project ID
- Output: Deployment URL, updated Notion page, execution summary
`;
```

**Execution Flow:**
```typescript
async function runDesignDeployWorkflow(
  notionDatabaseId: string,
  figmaFileKey?: string,
  vercelProjectId?: string
) {
  // 1. Create agent with all MCPs
  const agent = createDesignDeployAgent();

  // 2. Construct prompt
  const prompt = `
Execute design-to-deployment workflow:
- Notion Database: ${notionDatabaseId}
- Figma File: ${figmaFileKey || 'Auto-detect from Notion'}
- Vercel Project: ${vercelProjectId || 'Create new'}

Follow all 4 phases and return structured results.
  `;

  // 3. Execute
  const result = await agent.run(prompt);

  // 4. Return formatted response
  return formatResponse(result);
}
```

**Advantages:**
- Fastest execution (parallel tool usage)
- Single context window (better cross-platform reasoning)
- Fewer API calls to LLM

**Use Case:** Production workflows where speed is critical

---

#### Multi-Agent Mode

**Location:** `/packages/orchestrator/src/specialized-agents.ts`

**Purpose:** Three specialized agents for sequential, domain-focused execution

**Agent Configurations:**

1. **Notion Analyst Agent**
   ```typescript
   {
     name: "NotionAnalyst",
     model: "gemini-2.0-flash-exp",
     temperature: 0.3,  // Low temperature for analytical tasks
     maxTokens: 2048,
     mcpServers: { notion: {...} },
     systemPrompt: `
You are a Notion Analysis Specialist.

RESPONSIBILITIES:
- Query Notion databases for design specifications
- Extract structured data (title, description, requirements)
- Identify Figma and Vercel references
- Validate data completeness

TOOLS:
- NOTION_GET_DATABASE
- NOTION_GET_DESIGN_SPECS
- NOTION_GET_PAGE

OUTPUT FORMAT:
{
  specs: DesignSpec[],
  figmaFileIds: string[],
  vercelProjectIds: string[]
}
     `
   }
   ```

2. **Figma Designer Agent**
   ```typescript
   {
     name: "FigmaDesigner",
     model: "gemini-2.0-flash-exp",
     temperature: 0.4,  // Balanced for design decisions
     maxTokens: 2048,
     mcpServers: { figma: {...} },
     systemPrompt: `
You are a Figma Design Processing Specialist.

RESPONSIBILITIES:
- Retrieve Figma file structures
- Export design assets (images, SVGs)
- Extract components and styles
- Process design feedback

TOOLS:
- FIGMA_GET_FILE
- FIGMA_EXPORT_IMAGES
- FIGMA_GET_FILE_COMPONENTS
- FIGMA_GET_COMMENTS

INPUT: Figma file keys from Notion Analyst
OUTPUT: Exported asset URLs and design metadata
     `
   }
   ```

3. **Vercel Deployer Agent**
   ```typescript
   {
     name: "VercelDeployer",
     model: "gemini-2.0-flash-exp",
     temperature: 0.5,  // Higher for creative deployment decisions
     maxTokens: 2048,
     mcpServers: { vercel: {...} },
     systemPrompt: `
You are a Vercel Deployment Specialist.

RESPONSIBILITIES:
- Create Vercel projects if needed
- Construct file manifests for deployment
- Execute deployments
- Monitor deployment status

TOOLS:
- VERCEL_CREATE_PROJECT
- VERCEL_CREATE_DEPLOYMENT
- VERCEL_GET_DEPLOYMENT

INPUT: Design assets and specifications
OUTPUT: Deployment URLs and status
     `
   }
   ```

**Orchestration Implementation:**
```typescript
class WorkflowOrchestrator {
  private sessionId: string;
  private context: WorkflowContext;

  async executeSequentialWorkflow(notionDatabaseId: string) {
    // Phase 1: Discovery & Analysis
    this.updatePhase('discovery', 'in_progress');
    const notionAgent = createNotionAnalystAgent();
    const specs = await notionAgent.run(
      `Analyze Notion database: ${notionDatabaseId}`
    );
    this.updatePhase('discovery', 'completed');

    // Phase 2: Design Processing
    this.updatePhase('design', 'in_progress');
    const figmaAgent = createFigmaDesignerAgent();
    const assets = await figmaAgent.run(
      `Process Figma files: ${specs.figmaFileIds.join(', ')}`
    );
    this.updatePhase('design', 'completed');

    // Phase 3: Deployment
    this.updatePhase('deployment', 'in_progress');
    const vercelAgent = createVercelDeploymentAgent();
    const deployments = await vercelAgent.run(
      `Deploy to Vercel: ${specs.vercelProjectIds.join(', ')}`
    );
    this.updatePhase('deployment', 'completed');

    // Phase 4: Tracking
    this.updatePhase('tracking', 'in_progress');
    const updateAgent = createNotionAnalystAgent();
    await updateAgent.run(
      `Update Notion pages with deployment URLs: ${deployments}`
    );
    this.updatePhase('tracking', 'completed');

    return this.context;
  }
}
```

**Advantages:**
- Specialized expertise per domain
- Better error isolation
- Easier debugging (phase-by-phase)
- More control over execution flow

**Use Case:** Development, debugging, or complex workflows requiring fine-grained control

---

### 3. Workflow Execution

#### Workflow Context

**Location:** `/packages/orchestrator/src/workflows/orchestration.ts`

**Purpose:** Session-based state management for workflow execution

```typescript
interface WorkflowContext {
  sessionId: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  currentPhase: WorkflowPhase;
  phases: {
    discovery: PhaseStatus;
    design: PhaseStatus;
    deployment: PhaseStatus;
    tracking: PhaseStatus;
  };
  logs: LogEntry[];
  results?: WorkflowResults;
  error?: string;
}

interface PhaseStatus {
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  startTime?: Date;
  endTime?: Date;
  details?: any;
}

interface WorkflowResults {
  notionSpecs: DesignSpec[];
  figmaAssets: FigmaAsset[];
  vercelDeployments: Deployment[];
  updatedNotionPages: string[];
}
```

**Usage:**
```typescript
const orchestrator = new WorkflowOrchestrator(sessionId);

// Update phase status
orchestrator.updatePhase('discovery', 'in_progress');
orchestrator.addLog('info', 'Querying Notion database...');

// Add results
orchestrator.addPhaseDetails('discovery', { specs: [...] });

// Mark complete
orchestrator.updatePhase('discovery', 'completed');
```

---

## Technical Stack

### Language & Runtime

- **TypeScript 5.9.2**: ES2022 target, strict mode enabled
- **Node.js**: 18+ required (native ES modules)
- **Package Manager**: npm workspaces

### Core Frameworks

| Framework | Version | Purpose |
|-----------|---------|---------|
| ADK-TS | latest | AI agent orchestration |
| FastMCP | 3.16.0 | MCP server implementation |
| Next.js | 14.2.0 | Web UI framework |
| Express | 4.18.2 | REST API server |

### API Clients

| Client | Version | Platform |
|--------|---------|----------|
| @notionhq/client | 2.2.15 | Notion API |
| axios | 1.8.4 | Figma & Vercel APIs |

### Validation & Type Safety

- **Zod 4.1.5**: Runtime type validation for all MCP tool schemas
- **TypeScript strict mode**: Compile-time type safety

### UI Libraries

| Library | Version | Purpose |
|---------|---------|---------|
| React | 18.3.0 | UI framework |
| Framer Motion | 11.0.0 | Animations |
| react-zoom-pan-pinch | 3.6.1 | Canvas interactions |
| Tailwind CSS | 3.4.3 | Styling |
| Lucide React | latest | Icons |

### Development Tools

- **tsx 4.19.2**: TypeScript execution
- **SWC**: Fast minification
- **PostCSS 8.4.38**: CSS processing

---

## MCP Server Implementation

### FastMCP Server Pattern

All three MCP servers follow this architectural pattern:

```typescript
// 1. Import FastMCP
import { FastMCP } from 'fastmcp';

// 2. Initialize server
const mcp = new FastMCP('Server Name');

// 3. Define service class
class PlatformService {
  constructor(apiKey: string) {
    // Initialize API client
  }

  async operation(params: any) {
    // Implement API call
  }
}

// 4. Register tools
mcp.tool({
  name: 'TOOL_NAME',
  description: 'Tool description',
  parameters: z.object({
    param: z.string().describe('Parameter description')
  }),
  execute: async (args) => {
    const service = new PlatformService(process.env.API_KEY);
    return await service.operation(args);
  }
});

// 5. Start server
mcp.start({ transport: 'stdio' });
```

### Tool Definition Best Practices

**Schema Validation:**
```typescript
import { z } from 'zod';

const schema = z.object({
  // Required parameters
  fileKey: z.string()
    .describe('Figma file key from URL'),

  // Optional with defaults
  scale: z.number()
    .min(0.01)
    .max(4)
    .optional()
    .default(1)
    .describe('Export scale (0.01-4)'),

  // Enums
  format: z.enum(['png', 'jpg', 'svg', 'pdf'])
    .describe('Export format'),

  // Arrays
  nodeIds: z.array(z.string())
    .describe('Node IDs to export')
});
```

**Error Handling:**
```typescript
execute: async (args) => {
  try {
    const service = new PlatformService(process.env.API_KEY);
    const result = await service.operation(args);

    return {
      success: true,
      data: result
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}
```

**Logging:**
```typescript
execute: async (args) => {
  console.log(`[TOOL_NAME] Executing with args:`, JSON.stringify(args));
  const result = await operation(args);
  console.log(`[TOOL_NAME] Result:`, JSON.stringify(result));
  return result;
}
```

### Transport: stdio

All MCP servers use **stdio (standard input/output)** transport:

**Why stdio?**
- Simplest IPC mechanism
- Native support in ADK-TS
- No network configuration required
- Process isolation
- Secure (no external ports)

**How it works:**
```
ADK-TS Agent Process
    │
    ├─ Spawns: node mcp-notion/dist/index.js
    │  └─ Communication: stdin/stdout
    │
    ├─ Spawns: node mcp-figma/dist/index.js
    │  └─ Communication: stdin/stdout
    │
    └─ Spawns: node mcp-vercel/dist/index.js
       └─ Communication: stdin/stdout
```

**ADK-TS Configuration:**
```typescript
mcpServers: {
  notion: {
    command: "node",
    args: ["../mcp-notion/dist/index.js"],
    transport: "stdio"
  }
}
```

**MCP Server Bootstrap:**
```typescript
#!/usr/bin/env node
import { FastMCP } from 'fastmcp';

const mcp = new FastMCP('notion');
// Register tools...
mcp.start({ transport: 'stdio' });  // Listen on stdin
```

---

## Agent Orchestration

### ADK-TS Agent API

**Creating an Agent:**
```typescript
import { Agent } from '@iqai/adk';

const agent = new Agent({
  name: 'DesignDeployAgent',
  model: 'gemini-2.0-flash-exp',
  apiKey: process.env.GEMINI_API_KEY,
  temperature: 0.7,
  maxTokens: 4096,
  systemPrompt: 'System instructions...',
  mcpServers: {
    notion: { command: 'node', args: [...], transport: 'stdio' },
    figma: { command: 'node', args: [...], transport: 'stdio' },
    vercel: { command: 'node', args: [...], transport: 'stdio' }
  }
});
```

**Running an Agent:**
```typescript
const result = await agent.run(userPrompt);
// Result contains agent's response and tool usage
```

**Agent Lifecycle:**
```
1. Agent.run(prompt) called
    │
2. ADK spawns MCP server processes (stdio)
    │
3. ADK sends prompt to LLM (Gemini)
    │
4. LLM decides to use tools (function calling)
    │
5. ADK routes tool calls to correct MCP server
    │
6. MCP server executes tool, returns result
    │
7. ADK feeds results back to LLM
    │
8. LLM continues or returns final response
    │
9. ADK returns result to caller
    │
10. ADK cleans up MCP server processes
```

### Multi-Agent Coordination

**Sequential Execution:**
```typescript
async function executeWorkflow() {
  // Agent 1: Notion Analysis
  const agent1 = createNotionAnalystAgent();
  const specs = await agent1.run('Analyze database');

  // Agent 2: Figma Processing (uses Agent 1 output)
  const agent2 = createFigmaDesignerAgent();
  const assets = await agent2.run(
    `Process Figma files: ${specs.figmaFileIds.join(', ')}`
  );

  // Agent 3: Vercel Deployment (uses Agent 2 output)
  const agent3 = createVercelDeploymentAgent();
  const deployments = await agent3.run(
    `Deploy with assets: ${JSON.stringify(assets)}`
  );

  return { specs, assets, deployments };
}
```

**Parallel Execution (Unified Agent):**
```typescript
async function executeWorkflow() {
  const agent = createDesignDeployAgent(); // Has all tools

  const result = await agent.run(`
Execute complete workflow:
1. Query Notion database: ${databaseId}
2. Process Figma files (if specified)
3. Deploy to Vercel
4. Update Notion with results

Work in parallel where possible.
  `);

  return result;
}
```

### Prompt Engineering Strategies

**Structured Prompts:**
```typescript
const prompt = `
TASK: Design-to-Deployment Workflow

INPUT DATA:
- Notion Database ID: ${notionDatabaseId}
- Figma File Key: ${figmaFileKey || 'Auto-detect'}
- Vercel Project ID: ${vercelProjectId || 'Create new'}

EXECUTION STEPS:
1. DISCOVERY PHASE
   - Use NOTION_GET_DESIGN_SPECS on database
   - Extract all required fields
   - Validate data completeness

2. DESIGN PHASE (if Figma file specified)
   - Use FIGMA_GET_FILE to retrieve structure
   - Use FIGMA_EXPORT_IMAGES for PNG assets (scale: 2)
   - Store asset URLs

3. DEPLOYMENT PHASE
   - Create Vercel project if needed (VERCEL_CREATE_PROJECT)
   - Prepare file manifest with assets
   - Deploy with VERCEL_CREATE_DEPLOYMENT
   - Wait for deployment completion

4. TRACKING PHASE
   - Use NOTION_UPDATE_PAGE to add deployment URL
   - Update status to "Deployed"

OUTPUT FORMAT:
{
  "phase": "completed",
  "specs": [...],
  "deployments": [...],
  "updatedPages": [...]
}
`;
```

**Error Handling in Prompts:**
```typescript
const prompt = `
${basePrompt}

ERROR HANDLING:
- If tool returns error, try alternative approach
- If Notion page missing required field, use default value
- If Figma file not found, skip design phase
- If Vercel deployment fails, retry once with lower timeout

Always return structured results even on partial failure.
`;
```

---

## Workflow Execution

### CLI Interface

**Location:** `/packages/orchestrator/src/index.ts`

**Usage:**
```bash
# Basic usage
npm start <notion-database-id>

# With Figma file
npm start <notion-database-id> <figma-file-key>

# With Vercel project
npm start <notion-database-id> <figma-file-key> <vercel-project-id>

# Specify mode
npm start <notion-database-id> -- --mode=multi-agent

# Help
npm start -- --help
```

**Execution Modes:**
- `unified` (default): Single agent with all tools
- `multi-agent`: Three specialized agents
- `sequential`: Multi-agent with sequential execution
- `parallel`: Unified agent optimized for speed

**CLI Output:**
```
╔═══════════════════════════════════════════════╗
║        MakerOS Design-Deploy Workflow         ║
╚═══════════════════════════════════════════════╝

Configuration:
  Notion Database: abc123def456
  Figma File: fig_xyz789
  Vercel Project: Auto-create
  Mode: unified

═══════════════════════════════════════════════
Phase 1: Discovery & Analysis
─────────────────────────────────────────────────
[✓] Queried Notion database
[✓] Found 3 design specifications
[✓] Extracted Figma references

═══════════════════════════════════════════════
Phase 2: Design Asset Processing
─────────────────────────────────────────────────
[✓] Retrieved Figma file structure
[✓] Exported 12 PNG assets
[✓] Assets ready for deployment

═══════════════════════════════════════════════
Phase 3: Deployment Orchestration
─────────────────────────────────────────────────
[✓] Created Vercel project: design-system-v2
[✓] Deployed to production
[✓] URL: https://design-system-v2.vercel.app

═══════════════════════════════════════════════
Phase 4: Tracking & Documentation
─────────────────────────────────────────────────
[✓] Updated 3 Notion pages
[✓] Added deployment URLs

╔═══════════════════════════════════════════════╗
║              Workflow Complete                ║
╚═══════════════════════════════════════════════╝
```

### REST API Server

**Location:** `/packages/orchestrator/src/server.ts`

**Start Server:**
```bash
cd packages/orchestrator
npm run server
# Server running on http://localhost:3001
```

**Endpoints:**

1. **POST /api/workflow/execute**
   ```typescript
   // Request
   POST /api/workflow/execute
   Content-Type: application/json

   {
     "notionDatabaseId": "abc123",
     "figmaFileKey": "xyz789",  // optional
     "vercelProjectId": "my-project",  // optional
     "mode": "unified"  // optional
   }

   // Response
   {
     "sessionId": "sess_1234567890",
     "status": "running",
     "message": "Workflow started"
   }
   ```

2. **GET /api/workflow/status/:sessionId**
   ```typescript
   // Request
   GET /api/workflow/status/sess_1234567890

   // Response
   {
     "sessionId": "sess_1234567890",
     "status": "running",
     "currentPhase": "deployment",
     "phases": {
       "discovery": { "status": "completed", "startTime": "...", "endTime": "..." },
       "design": { "status": "completed", "startTime": "...", "endTime": "..." },
       "deployment": { "status": "in_progress", "startTime": "..." },
       "tracking": { "status": "pending" }
     },
     "logs": [
       { "level": "info", "message": "Querying Notion...", "timestamp": "..." },
       { "level": "info", "message": "Exporting Figma assets...", "timestamp": "..." }
     ]
   }
   ```

3. **GET /api/mcp/status**
   ```typescript
   // Request
   GET /api/mcp/status

   // Response
   {
     "mcpServers": [
       { "name": "notion", "status": "active", "tools": 4 },
       { "name": "figma", "status": "active", "tools": 9 },
       { "name": "vercel", "status": "active", "tools": 6 }
     ],
     "totalTools": 19
   }
   ```

4. **GET /api/health**
   ```typescript
   // Request
   GET /api/health

   // Response
   {
     "status": "ok",
     "timestamp": "2025-01-15T10:30:00Z"
   }
   ```

**CORS Configuration:**
```typescript
app.use(cors({
  origin: 'http://localhost:3000',  // Next.js web UI
  credentials: true
}));
```

**Session Management:**
```typescript
const sessions = new Map<string, WorkflowContext>();

app.post('/api/workflow/execute', async (req, res) => {
  const sessionId = `sess_${Date.now()}`;
  const context = new WorkflowContext(sessionId);
  sessions.set(sessionId, context);

  // Execute workflow asynchronously
  executeWorkflow(context, req.body).catch(err => {
    context.status = 'failed';
    context.error = err.message;
  });

  res.json({ sessionId, status: 'running' });
});
```

### Web Interface

**Location:** `/packages/web/`

**Start Development Server:**
```bash
cd packages/web
npm run dev
# Open http://localhost:3000
```

**Key Features:**
- Figma-inspired dark theme UI
- Real-time workflow visualization
- Live log streaming
- Session-based execution tracking

**Component Architecture:**
```
index.tsx (Main Page)
    │
    └─ WorkflowProvider (State Management)
        │
        ├─ FigmaTitleBar
        │
        ├─ FigmaToolbar
        │
        ├─ FigmaLeftPanel
        │   ├─ Configuration Inputs
        │   └─ MCP Server Status
        │
        ├─ FigmaCanvas
        │   ├─ Workflow Diagram
        │   ├─ Phase Nodes
        │   └─ Status Indicators
        │
        └─ FigmaRightPanel
            ├─ Logs Tab
            ├─ Activity Tab
            └─ Output Tab
```

**API Integration:**
```typescript
// lib/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001/api',
  timeout: 30000
});

export async function executeWorkflow(config: WorkflowConfig) {
  const { data } = await api.post('/workflow/execute', config);
  return data.sessionId;
}

export async function getWorkflowStatus(sessionId: string) {
  const { data } = await api.get(`/workflow/status/${sessionId}`);
  return data;
}
```

**State Management:**
```typescript
// lib/workflow-context.tsx
const WorkflowContext = createContext<WorkflowState>({
  sessionId: null,
  status: 'idle',
  currentPhase: null,
  phases: {
    discovery: { status: 'pending' },
    design: { status: 'pending' },
    deployment: { status: 'pending' },
    tracking: { status: 'pending' }
  },
  logs: [],
  startWorkflow: async (config) => {},
  pollStatus: () => {}
});
```

**Design System:**
```typescript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        figma: {
          bg: '#1E1E1E',
          surface: '#2C2C2C',
          border: '#3C3C3C',
          text: '#FFFFFF',
          accent: '#0D99FF',
          success: '#14AE5C',
          warning: '#F24822',
          purple: '#7B61FF'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['SF Mono', 'monospace']
      },
      boxShadow: {
        figma: '0 2px 8px rgba(0,0,0,0.3)',
        'figma-lg': '0 4px 16px rgba(0,0,0,0.4)'
      }
    }
  }
};
```

---

## API Reference

### Notion Tools

#### NOTION_GET_DATABASE
```typescript
// Get database contents
{
  databaseId: string;      // Notion database ID
  filter?: NotionFilter;   // Optional filter object
}
```

#### NOTION_GET_DESIGN_SPECS
```typescript
// Get design specifications
{
  databaseId: string;      // Notion database ID
}
// Returns: DesignSpec[]
```

#### NOTION_GET_PAGE
```typescript
// Get specific page
{
  pageId: string;          // Notion page ID
}
```

#### NOTION_UPDATE_PAGE
```typescript
// Update page properties
{
  pageId: string;          // Notion page ID
  properties: {
    [key: string]: any;    // Property updates
  };
}
```

### Figma Tools

#### FIGMA_GET_FILE
```typescript
{
  fileKey: string;         // Figma file key
  depth?: number;          // Traversal depth (default: 2)
}
```

#### FIGMA_GET_FILE_NODES
```typescript
{
  fileKey: string;         // Figma file key
  nodeIds: string[];       // Array of node IDs
}
```

#### FIGMA_EXPORT_IMAGES
```typescript
{
  fileKey: string;         // Figma file key
  nodeIds: string[];       // Nodes to export
  format: 'jpg' | 'png' | 'svg' | 'pdf';
  scale?: number;          // 0.01 to 4 (default: 1)
}
// Returns: { [nodeId: string]: string } (URLs)
```

#### FIGMA_GET_COMMENTS
```typescript
{
  fileKey: string;         // Figma file key
}
```

#### FIGMA_POST_COMMENT
```typescript
{
  fileKey: string;         // Figma file key
  message: string;         // Comment text
  clientMeta?: {
    x: number;
    y: number;
    node_id?: string;
  };
}
```

#### FIGMA_GET_TEAM_PROJECTS
```typescript
{
  teamId: string;          // Figma team ID
}
```

#### FIGMA_GET_PROJECT_FILES
```typescript
{
  projectId: string;       // Figma project ID
}
```

#### FIGMA_GET_FILE_COMPONENTS
```typescript
{
  fileKey: string;         // Figma file key
}
```

#### FIGMA_GET_FILE_STYLES
```typescript
{
  fileKey: string;         // Figma file key
}
```

### Vercel Tools

#### VERCEL_LIST_PROJECTS
```typescript
{}  // No parameters
```

#### VERCEL_GET_PROJECT
```typescript
{
  projectId: string;       // Project ID or name
}
```

#### VERCEL_CREATE_PROJECT
```typescript
{
  name: string;            // Project name
  framework?: 'nextjs' | 'vite' | 'static';  // Default: 'nextjs'
}
```

#### VERCEL_CREATE_DEPLOYMENT
```typescript
{
  projectId: string;       // Project ID
  files: Array<{
    file: string;          // File path
    data: string;          // Base64 or text content
    encoding?: 'base64' | 'utf-8';
  }>;
  target?: 'production' | 'preview';  // Default: 'production'
}
// Returns: Deployment object with URL
```

#### VERCEL_LIST_DEPLOYMENTS
```typescript
{
  projectId?: string;      // Filter by project
  limit?: number;          // Max results (default: 20)
}
```

#### VERCEL_GET_DEPLOYMENT
```typescript
{
  deploymentId: string;    // Deployment ID or URL
}
```

---

## Development Guide

### Setup

**Prerequisites:**
- Node.js 18+
- npm 9+
- Git

**Clone & Install:**
```bash
# Clone repository
git clone https://github.com/0xdarknight/MakerOS.git
cd MakerOS

# Install all dependencies
npm install

# Build all packages
npm run build
```

**Environment Configuration:**
```bash
# Copy template
cp .env.example .env

# Edit with your API keys
nano .env
```

**Required Variables:**
```env
# Notion (Required)
NOTION_API_KEY=secret_xxx

# Figma (Required)
FIGMA_API_KEY=figd_xxx

# Vercel (Required)
VERCEL_API_KEY=xxx

# Vercel Team (Optional)
VERCEL_TEAM_ID=team_xxx

# Gemini (Required for orchestrator)
GEMINI_API_KEY=AIzaSyxxx

# Model (Optional)
MODEL_NAME=gemini-2.0-flash-exp
```

### Development Workflow

**Per-Package Development:**
```bash
# Develop Notion MCP
npm run dev:notion

# Develop Figma MCP
npm run dev:figma

# Develop Vercel MCP
npm run dev:vercel

# Develop Orchestrator
npm run dev:orchestrator

# Develop Web UI
cd packages/web && npm run dev
```

**Build Workflow:**
```bash
# Build all packages
npm run build

# Build specific package
npm run build:notion
npm run build:figma
npm run build:vercel
npm run build:orchestrator
```

**Testing MCP Servers:**
```bash
# Test Notion MCP
cd packages/mcp-notion
npm run build
node dist/index.js
# Send MCP requests via stdin
```

**Testing Orchestrator:**
```bash
cd packages/orchestrator
npm run dev -- <notion-database-id>
```

### Project Structure Best Practices

**File Organization:**
```
packages/mcp-{platform}/
├── src/
│   ├── index.ts          # FastMCP bootstrap
│   ├── {platform}-service.ts   # API client
│   └── {platform}-tools.ts     # Tool definitions
├── dist/                 # Build output
├── package.json
└── tsconfig.json
```

**Naming Conventions:**
- Tool names: `PLATFORM_ACTION` (e.g., `FIGMA_EXPORT_IMAGES`)
- Service methods: `camelCase` (e.g., `exportImages`)
- Types/Interfaces: `PascalCase` (e.g., `DesignSpec`)
- Files: `kebab-case` (e.g., `design-deploy-agent.ts`)

**TypeScript Configuration:**
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ES2022",
    "moduleResolution": "node",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### Debugging

**MCP Server Debugging:**
```bash
# Enable MCP debug logs
DEBUG=mcp:* npm run dev:notion
```

**Agent Debugging:**
```typescript
// Add logging in agent prompts
const prompt = `
${basePrompt}

DEBUG MODE: Provide detailed reasoning for each tool call.
`;

// Log agent responses
const result = await agent.run(prompt);
console.log('[AGENT RESULT]', JSON.stringify(result, null, 2));
```

**Network Debugging:**
```typescript
// Add axios interceptors
axios.interceptors.request.use(request => {
  console.log('[HTTP REQUEST]', request.method, request.url);
  return request;
});

axios.interceptors.response.use(response => {
  console.log('[HTTP RESPONSE]', response.status, response.data);
  return response;
});
```

### Adding New Tools

**1. Define Tool Schema:**
```typescript
// packages/mcp-{platform}/src/{platform}-tools.ts
import { z } from 'zod';

export const newToolSchema = z.object({
  param1: z.string().describe('Parameter description'),
  param2: z.number().optional().default(10)
});
```

**2. Implement Service Method:**
```typescript
// packages/mcp-{platform}/src/{platform}-service.ts
class PlatformService {
  async newOperation(param1: string, param2: number) {
    return await this.client.get(`/endpoint`, {
      params: { param1, param2 }
    });
  }
}
```

**3. Register Tool:**
```typescript
// packages/mcp-{platform}/src/index.ts
mcp.tool({
  name: 'PLATFORM_NEW_OPERATION',
  description: 'Description of what this tool does',
  parameters: newToolSchema,
  execute: async (args) => {
    const service = new PlatformService(process.env.API_KEY);
    return await service.newOperation(args.param1, args.param2);
  }
});
```

**4. Update Agent Prompts:**
```typescript
// packages/orchestrator/src/design-deploy-agent.ts
const systemPrompt = `
...
NEW TOOL AVAILABLE:
- PLATFORM_NEW_OPERATION: Use this to...
...
`;
```

**5. Build & Test:**
```bash
npm run build:{platform}
npm run dev:orchestrator -- test-database-id
```

---

## Deployment

### MCP Servers

**Standalone Deployment:**
```bash
# Build
npm run build:notion

# Run as daemon
nohup node packages/mcp-notion/dist/index.js > notion-mcp.log 2>&1 &
```

**Docker Deployment:**
```dockerfile
# Dockerfile.notion
FROM node:18-alpine
WORKDIR /app
COPY packages/mcp-notion ./
RUN npm install && npm run build
CMD ["node", "dist/index.js"]
```

```bash
docker build -f Dockerfile.notion -t makeros-notion-mcp .
docker run -e NOTION_API_KEY=xxx makeros-notion-mcp
```

### Orchestrator

**CLI Deployment:**
```bash
# Build
npm run build:orchestrator

# Run
node packages/orchestrator/dist/index.js <notion-database-id>
```

**API Server Deployment:**
```bash
# Using PM2
pm2 start packages/orchestrator/dist/server.js --name makeros-api

# Using systemd
[Unit]
Description=MakerOS API Server
After=network.target

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/opt/makeros
ExecStart=/usr/bin/node packages/orchestrator/dist/server.js
Restart=on-failure
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```

### Web UI

**Vercel Deployment:**
```bash
cd packages/web

# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production
vercel --prod
```

**Next.js Build:**
```bash
cd packages/web
npm run build
npm start  # Production server on port 3000
```

**Docker Deployment:**
```dockerfile
# Dockerfile.web
FROM node:18-alpine AS builder
WORKDIR /app
COPY packages/web ./
RUN npm install && npm run build

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./
RUN npm install --production
EXPOSE 3000
CMD ["npm", "start"]
```

### Environment Variables in Production

**Use Secret Management:**
```bash
# AWS Secrets Manager
aws secretsmanager create-secret --name makeros/notion-api-key --secret-string xxx

# Retrieve in app
const secret = await secretsManager.getSecretValue({ SecretId: 'makeros/notion-api-key' }).promise();
process.env.NOTION_API_KEY = secret.SecretString;
```

**Docker Compose:**
```yaml
version: '3.8'
services:
  notion-mcp:
    build:
      context: .
      dockerfile: Dockerfile.notion
    environment:
      - NOTION_API_KEY=${NOTION_API_KEY}
    restart: unless-stopped

  figma-mcp:
    build:
      context: .
      dockerfile: Dockerfile.figma
    environment:
      - FIGMA_API_KEY=${FIGMA_API_KEY}
    restart: unless-stopped

  vercel-mcp:
    build:
      context: .
      dockerfile: Dockerfile.vercel
    environment:
      - VERCEL_API_KEY=${VERCEL_API_KEY}
    restart: unless-stopped

  api:
    build:
      context: .
      dockerfile: Dockerfile.orchestrator
    ports:
      - "3001:3001"
    environment:
      - GEMINI_API_KEY=${GEMINI_API_KEY}
    depends_on:
      - notion-mcp
      - figma-mcp
      - vercel-mcp
    restart: unless-stopped

  web:
    build:
      context: .
      dockerfile: Dockerfile.web
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://api:3001
    depends_on:
      - api
    restart: unless-stopped
```

---

## Advanced Topics

### Custom MCP Server Development

**Template for New MCP Server:**
```typescript
// packages/mcp-custom/src/index.ts
#!/usr/bin/env node
import { FastMCP } from 'fastmcp';
import { z } from 'zod';

const mcp = new FastMCP('custom');

// Tool 1
mcp.tool({
  name: 'CUSTOM_OPERATION',
  description: 'Perform custom operation',
  parameters: z.object({
    input: z.string()
  }),
  execute: async ({ input }) => {
    // Implementation
    return { result: `Processed: ${input}` };
  }
});

mcp.start({ transport: 'stdio' });
```

**Integration with Orchestrator:**
```typescript
// packages/orchestrator/src/custom-agent.ts
const agent = new Agent({
  name: 'CustomAgent',
  model: 'gemini-2.0-flash-exp',
  mcpServers: {
    custom: {
      command: 'node',
      args: ['../mcp-custom/dist/index.js'],
      transport: 'stdio'
    }
  }
});
```

### Advanced Agent Patterns

**Agent with Memory:**
```typescript
class StatefulAgent {
  private memory: Map<string, any> = new Map();
  private agent: Agent;

  constructor() {
    this.agent = createDesignDeployAgent();
  }

  async run(prompt: string, context?: any) {
    const enhancedPrompt = `
${prompt}

CONTEXT FROM PREVIOUS INTERACTIONS:
${JSON.stringify(Array.from(this.memory.entries()))}
    `;

    const result = await this.agent.run(enhancedPrompt);

    // Store result in memory
    this.memory.set(`interaction_${Date.now()}`, result);

    return result;
  }
}
```

**Agent with Retry Logic:**
```typescript
async function runWithRetry(agent: Agent, prompt: string, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await agent.run(prompt);
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      console.log(`Retry ${i + 1}/${maxRetries} after error:`, error.message);
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
}
```

**Agent with Streaming:**
```typescript
async function runWithStreaming(agent: Agent, prompt: string, onChunk: (chunk: string) => void) {
  // Note: Requires ADK-TS streaming support
  const stream = await agent.stream(prompt);

  for await (const chunk of stream) {
    onChunk(chunk);
  }
}
```

### Performance Optimization

**Tool Call Batching:**
```typescript
// Instead of sequential calls
const file1 = await agent.run('Export file 1');
const file2 = await agent.run('Export file 2');
const file3 = await agent.run('Export file 3');

// Batch in single prompt
const result = await agent.run(`
Export the following Figma files in parallel:
1. File key: abc123
2. File key: def456
3. File key: ghi789

Return all URLs in a structured array.
`);
```

**Caching Strategies:**
```typescript
class CachedFigmaService extends FigmaService {
  private cache = new Map<string, any>();

  async getFile(fileKey: string, depth?: number) {
    const cacheKey = `${fileKey}:${depth}`;

    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    const result = await super.getFile(fileKey, depth);
    this.cache.set(cacheKey, result);

    return result;
  }
}
```

**Parallel MCP Server Execution:**
```typescript
// Unified agent automatically handles parallel tool calls
const agent = createDesignDeployAgent();

const result = await agent.run(`
Execute these operations in parallel:
1. Query Notion database: ${databaseId}
2. Export Figma file: ${fileKey}
3. List Vercel projects

Combine results and return structured output.
`);
// ADK-TS will execute all tool calls concurrently
```

### Security Best Practices

**API Key Management:**
```typescript
// Never hardcode keys
❌ const apiKey = 'secret_abc123';

// Use environment variables
✅ const apiKey = process.env.NOTION_API_KEY;

// Validate presence
if (!apiKey) {
  throw new Error('NOTION_API_KEY not set');
}
```

**Input Validation:**
```typescript
// Always validate with Zod
const schema = z.object({
  databaseId: z.string()
    .regex(/^[a-f0-9]{32}$/, 'Invalid Notion database ID format')
});

try {
  const validated = schema.parse(input);
} catch (error) {
  return { error: 'Invalid input' };
}
```

**Rate Limiting:**
```typescript
class RateLimitedService {
  private lastCall = 0;
  private minInterval = 100; // ms

  async call(fn: () => Promise<any>) {
    const now = Date.now();
    const wait = this.minInterval - (now - this.lastCall);

    if (wait > 0) {
      await new Promise(resolve => setTimeout(resolve, wait));
    }

    this.lastCall = Date.now();
    return await fn();
  }
}
```

**Error Sanitization:**
```typescript
function sanitizeError(error: any) {
  return {
    message: error.message,
    // Never expose: stack traces, API keys, internal paths
    // code: error.code  // Only if safe
  };
}
```

### Monitoring & Observability

**Structured Logging:**
```typescript
class Logger {
  log(level: string, message: string, meta?: any) {
    console.log(JSON.stringify({
      timestamp: new Date().toISOString(),
      level,
      message,
      ...meta
    }));
  }
}

const logger = new Logger();
logger.log('info', 'Workflow started', { sessionId: 'sess_123', databaseId: 'abc' });
```

**Metrics Collection:**
```typescript
class Metrics {
  private counters = new Map<string, number>();

  increment(metric: string, value = 1) {
    this.counters.set(metric, (this.counters.get(metric) || 0) + value);
  }

  getMetrics() {
    return Object.fromEntries(this.counters);
  }
}

// Usage
metrics.increment('workflow.started');
metrics.increment('tool.notion.get_database.success');
metrics.increment('tool.figma.export_images.duration_ms', 1234);
```

**Distributed Tracing:**
```typescript
interface TraceContext {
  traceId: string;
  spanId: string;
  parentSpanId?: string;
}

function createSpan(name: string, context: TraceContext) {
  return {
    ...context,
    spanId: generateId(),
    name,
    startTime: Date.now(),
    end: function() {
      const duration = Date.now() - this.startTime;
      console.log(`[TRACE] ${this.name} ${duration}ms`, this);
    }
  };
}
```

---

## Troubleshooting

### Common Issues

**1. MCP Server Not Starting:**
```bash
# Check if port in use
lsof -i :3000

# Check environment variables
echo $NOTION_API_KEY

# Check build output
ls -la packages/mcp-notion/dist/

# Run with debug
DEBUG=* npm run dev:notion
```

**2. Agent Tool Call Failures:**
```typescript
// Add detailed error logging
execute: async (args) => {
  try {
    console.log('[TOOL] Input:', JSON.stringify(args));
    const result = await operation(args);
    console.log('[TOOL] Output:', JSON.stringify(result));
    return result;
  } catch (error) {
    console.error('[TOOL] Error:', error);
    throw error;
  }
}
```

**3. Workflow Hanging:**
```typescript
// Add timeout
const result = await Promise.race([
  agent.run(prompt),
  new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Timeout')), 60000)
  )
]);
```

**4. API Rate Limits:**
```typescript
// Implement exponential backoff
async function retryWithBackoff(fn: () => Promise<any>, maxRetries = 5) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (error.response?.status === 429) {
        const wait = Math.pow(2, i) * 1000;
        console.log(`Rate limited, waiting ${wait}ms`);
        await new Promise(resolve => setTimeout(resolve, wait));
      } else {
        throw error;
      }
    }
  }
}
```

---

## License

MIT License - See LICENSE file for details

---

## Credits

**Built for:** ADK-TS Hackathon 2025 (MCP Expansion Track)
**Author:** 0xdarknight
**Framework:** ADK-TS by IQ AI
**Protocol:** Model Context Protocol

---

## Resources

- [ADK-TS Documentation](https://docs.iqai.com/adk-ts)
- [Model Context Protocol Spec](https://modelcontextprotocol.io)
- [Notion API Reference](https://developers.notion.com)
- [Figma API Reference](https://www.figma.com/developers/api)
- [Vercel API Reference](https://vercel.com/docs/rest-api)
- [FastMCP Documentation](https://github.com/jlowin/fastmcp)

---
**Version:** 1.0.0
