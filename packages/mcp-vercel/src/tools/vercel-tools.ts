import { z } from "zod";
import { VercelService } from "../services/vercel-service.js";
import dedent from "dedent";

const listProjectsSchema = z.object({});

const getProjectSchema = z.object({
  projectId: z.string().min(1).describe("The Vercel project ID or name"),
});

const createProjectSchema = z.object({
  name: z.string().min(1).describe("The name for the new project"),
  framework: z.string().optional().describe("The framework to use (e.g., nextjs, vite, static)"),
});

const createDeploymentSchema = z.object({
  projectId: z.string().min(1).describe("The Vercel project ID"),
  files: z.record(z.object({ file: z.string() })).describe("Files to deploy as key-value pairs"),
});

const listDeploymentsSchema = z.object({
  projectId: z.string().optional().describe("Filter deployments by project ID"),
});

const getDeploymentSchema = z.object({
  deploymentId: z.string().min(1).describe("The deployment ID"),
});

type ListProjectsParams = z.infer<typeof listProjectsSchema>;
type GetProjectParams = z.infer<typeof getProjectSchema>;
type CreateProjectParams = z.infer<typeof createProjectSchema>;
type CreateDeploymentParams = z.infer<typeof createDeploymentSchema>;
type ListDeploymentsParams = z.infer<typeof listDeploymentsSchema>;
type GetDeploymentParams = z.infer<typeof getDeploymentSchema>;

export const listProjectsTool = {
  name: "VERCEL_LIST_PROJECTS",
  description: "List all Vercel projects",
  parameters: listProjectsSchema,
  execute: async (params: ListProjectsParams) => {
    const vercelService = new VercelService();
    try {
      const projects = await vercelService.listProjects();

      if (projects.length === 0) {
        return "No projects found.";
      }

      return dedent`
        Found ${projects.length} project(s):

        ${projects.map((p, idx) => `${idx + 1}. ${p.name} (ID: ${p.id})`).join("\n")}
      `;
    } catch (error) {
      if (error instanceof Error) {
        return `Error listing projects: ${error.message}`;
      }
      return "An unknown error occurred while listing projects";
    }
  },
} as const;

export const getProjectTool = {
  name: "VERCEL_GET_PROJECT",
  description: "Get details of a specific Vercel project",
  parameters: getProjectSchema,
  execute: async (params: GetProjectParams) => {
    const vercelService = new VercelService();
    try {
      const project = await vercelService.getProject(params.projectId);
      return JSON.stringify(project, null, 2);
    } catch (error) {
      if (error instanceof Error) {
        return `Error getting project: ${error.message}`;
      }
      return "An unknown error occurred while getting the project";
    }
  },
} as const;

export const createProjectTool = {
  name: "VERCEL_CREATE_PROJECT",
  description: "Create a new Vercel project",
  parameters: createProjectSchema,
  execute: async (params: CreateProjectParams) => {
    const vercelService = new VercelService();
    try {
      const project = await vercelService.createProject(params.name, params.framework);
      return dedent`
        Project created successfully!

        Name: ${project.name}
        ID: ${project.id}
        Framework: ${project.framework || "Not specified"}
      `;
    } catch (error) {
      if (error instanceof Error) {
        return `Error creating project: ${error.message}`;
      }
      return "An unknown error occurred while creating the project";
    }
  },
} as const;

export const createDeploymentTool = {
  name: "VERCEL_CREATE_DEPLOYMENT",
  description: "Create a new deployment for a Vercel project",
  parameters: createDeploymentSchema,
  execute: async (params: CreateDeploymentParams) => {
    const vercelService = new VercelService();
    try {
      const deployment = await vercelService.createDeployment(params.projectId, params.files);
      return dedent`
        Deployment created successfully!

        URL: https://${deployment.url}
        ID: ${deployment.id}
        State: ${deployment.state}
        Ready State: ${deployment.readyState}
      `;
    } catch (error) {
      if (error instanceof Error) {
        return `Error creating deployment: ${error.message}`;
      }
      return "An unknown error occurred while creating the deployment";
    }
  },
} as const;

export const listDeploymentsTool = {
  name: "VERCEL_LIST_DEPLOYMENTS",
  description: "List deployments, optionally filtered by project",
  parameters: listDeploymentsSchema,
  execute: async (params: ListDeploymentsParams) => {
    const vercelService = new VercelService();
    try {
      const deployments = await vercelService.listDeployments(params.projectId);

      if (deployments.length === 0) {
        return "No deployments found.";
      }

      return dedent`
        Found ${deployments.length} deployment(s):

        ${deployments.slice(0, 10).map((d, idx) => dedent`
          ${idx + 1}. https://${d.url}
             ID: ${d.id}
             State: ${d.state} (${d.readyState})
             Created: ${new Date(d.createdAt).toISOString()}
        `).join("\n\n")}
      `;
    } catch (error) {
      if (error instanceof Error) {
        return `Error listing deployments: ${error.message}`;
      }
      return "An unknown error occurred while listing deployments";
    }
  },
} as const;

export const getDeploymentTool = {
  name: "VERCEL_GET_DEPLOYMENT",
  description: "Get details of a specific deployment",
  parameters: getDeploymentSchema,
  execute: async (params: GetDeploymentParams) => {
    const vercelService = new VercelService();
    try {
      const deployment = await vercelService.getDeployment(params.deploymentId);
      return JSON.stringify(deployment, null, 2);
    } catch (error) {
      if (error instanceof Error) {
        return `Error getting deployment: ${error.message}`;
      }
      return "An unknown error occurred while getting the deployment";
    }
  },
} as const;
