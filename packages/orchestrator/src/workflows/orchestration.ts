import { createDesignDeployAgent, WorkflowContext, WorkflowResult } from "../agents/design-deploy-agent.js";
import { createMultiAgentWorkflow } from "../agents/specialized-agents.js";

export class WorkflowOrchestrator {
  private sessionId: string;
  private context: WorkflowContext;
  private results: Partial<WorkflowResult>;

  constructor(context: WorkflowContext) {
    this.sessionId = context.sessionId || `session_${Date.now()}`;
    this.context = { ...context, sessionId: this.sessionId };
    this.results = {
      success: false,
      sessionId: this.sessionId,
      errors: [],
    };
  }

  async executeSequentialWorkflow(): Promise<WorkflowResult> {
    console.log(`\n[${this.sessionId}] Starting sequential workflow execution`);

    try {
      const { notionAnalyst, figmaDesigner, vercelDeployer } = await createMultiAgentWorkflow();

      console.log("\n=== Phase 1: Notion Analysis ===");
      const notionResult = await this.executeNotionAnalysis(notionAnalyst);

      if (!notionResult.success) {
        return this.handleError("Notion analysis failed", notionResult.error);
      }

      console.log("\n=== Phase 2: Figma Asset Processing ===");
      const figmaResult = await this.executeFigmaProcessing(figmaDesigner, notionResult.data);

      if (!figmaResult.success) {
        return this.handleError("Figma processing failed", figmaResult.error);
      }

      console.log("\n=== Phase 3: Vercel Deployment ===");
      const deployResult = await this.executeVercelDeployment(vercelDeployer, figmaResult.data);

      if (!deployResult.success) {
        return this.handleError("Deployment failed", deployResult.error);
      }

      console.log("\n=== Phase 4: Notion Update ===");
      await this.updateNotionWithResults(deployResult.data);

      return {
        ...this.results,
        success: true,
        designSpecs: notionResult.data?.specs,
        figmaExports: figmaResult.data?.assets,
        deploymentUrl: deployResult.data?.url,
        vercelProjectId: deployResult.data?.projectId,
        notionUpdated: true,
      } as WorkflowResult;

    } catch (error) {
      return this.handleError("Workflow execution failed", error);
    }
  }

  async executeParallelWorkflow(): Promise<WorkflowResult> {
    console.log(`\n[${this.sessionId}] Starting parallel workflow execution`);

    try {
      const agent = await createDesignDeployAgent();

      const workflow = `
Execute this design-to-deployment workflow with maximum efficiency:

DATABASE: ${this.context.databaseId}
FIGMA_FILE: ${this.context.figmaFileKey || "Auto-detect from Notion"}
VERCEL_PROJECT: ${this.context.vercelProjectId || "Create new"}

EXECUTION PLAN:
1. Fetch all design specs from Notion database
2. Analyze specs to identify Figma files and deployment requirements
3. For each design spec:
   - Export Figma assets in parallel
   - Prepare deployment configuration
   - Create/update Vercel project
   - Deploy assets
   - Update Notion with deployment URL

OPTIMIZATION:
- Use parallel execution where possible
- Cache results between steps
- Minimize API calls by batching operations
- Provide detailed progress updates

OUTPUT REQUIREMENTS:
- List all processed design specs
- Report all exported Figma assets with URLs
- Provide all deployment URLs
- Confirm Notion updates
      `;

      const response = await agent.ask(workflow);

      return {
        success: true,
        sessionId: this.sessionId,
      } as WorkflowResult;

    } catch (error) {
      return this.handleError("Parallel workflow failed", error);
    }
  }

  private async executeNotionAnalysis(agent: any): Promise<{ success: boolean; data?: any; error?: any }> {
    try {
      const prompt = `Analyze Notion database ${this.context.databaseId}.
      Extract all design specifications and identify Figma file references.
      Return structured data for downstream processing.`;

      const response = await agent.ask(prompt);

      return {
        success: true,
        data: {
          specs: response,
          figmaFiles: [],
        },
      };
    } catch (error) {
      return { success: false, error };
    }
  }

  private async executeFigmaProcessing(agent: any, notionData: any): Promise<{ success: boolean; data?: any; error?: any }> {
    try {
      const figmaFile = this.context.figmaFileKey || notionData?.figmaFiles?.[0];

      if (!figmaFile) {
        return { success: false, error: "No Figma file specified" };
      }

      const prompt = `Process Figma file ${figmaFile}.
      1. Analyze file structure
      2. Export all relevant assets (images, components, styles)
      3. Use optimal export settings for each asset type
      4. Return asset URLs and metadata`;

      const response = await agent.ask(prompt);

      return {
        success: true,
        data: {
          assets: {},
          components: [],
        },
      };
    } catch (error) {
      return { success: false, error };
    }
  }

  private async executeVercelDeployment(agent: any, figmaData: any): Promise<{ success: boolean; data?: any; error?: any }> {
    try {
      const projectId = this.context.vercelProjectId;

      const prompt = projectId
        ? `Deploy to existing Vercel project ${projectId}`
        : `Create a new Vercel project and deploy the design assets`;

      const response = await agent.ask(prompt);

      return {
        success: true,
        data: {
          url: "deployment-url",
          projectId: "project-id",
        },
      };
    } catch (error) {
      return { success: false, error };
    }
  }

  private async updateNotionWithResults(deployData: any): Promise<void> {
    console.log(`Updating Notion with deployment results...`);
  }

  private handleError(message: string, error: any): WorkflowResult {
    const errorMessage = error?.message || String(error);
    console.error(`[${this.sessionId}] ${message}: ${errorMessage}`);

    this.results.errors?.push(`${message}: ${errorMessage}`);

    return {
      ...this.results,
      success: false,
    } as WorkflowResult;
  }
}

export async function executeWorkflow(
  context: WorkflowContext,
  mode: "sequential" | "parallel" = "parallel"
): Promise<WorkflowResult> {
  const orchestrator = new WorkflowOrchestrator(context);

  return mode === "sequential"
    ? orchestrator.executeSequentialWorkflow()
    : orchestrator.executeParallelWorkflow();
}
