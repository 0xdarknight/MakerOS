import axios, { AxiosInstance } from "axios";
import { getVercelConfig } from "../lib/config.js";

export interface VercelProject {
  id: string;
  name: string;
  framework?: string;
  link?: {
    type: string;
    repo: string;
  };
}

export interface VercelDeployment {
  id: string;
  url: string;
  state: string;
  readyState: string;
  createdAt: number;
}

export class VercelService {
  private client: AxiosInstance;
  private teamId?: string;

  constructor() {
    const config = getVercelConfig();
    this.teamId = config.teamId;

    this.client = axios.create({
      baseURL: "https://api.vercel.com",
      headers: {
        Authorization: `Bearer ${config.token}`,
      },
    });
  }

  async listProjects() {
    const params = this.teamId ? { teamId: this.teamId } : {};
    const response = await this.client.get("/v9/projects", { params });
    return response.data.projects as VercelProject[];
  }

  async getProject(projectId: string) {
    const params = this.teamId ? { teamId: this.teamId } : {};
    const response = await this.client.get(`/v9/projects/${projectId}`, { params });
    return response.data as VercelProject;
  }

  async createProject(name: string, framework?: string) {
    const params = this.teamId ? { teamId: this.teamId } : {};
    const response = await this.client.post(
      "/v10/projects",
      { name, framework },
      { params }
    );
    return response.data as VercelProject;
  }

  async createDeployment(projectId: string, files: Record<string, { file: string }>) {
    const params = this.teamId ? { teamId: this.teamId } : {};

    const response = await this.client.post(
      "/v13/deployments",
      {
        name: projectId,
        files,
        projectSettings: {
          framework: "nextjs",
        },
        target: "production",
      },
      { params }
    );
    return response.data as VercelDeployment;
  }

  async listDeployments(projectId?: string) {
    const params = this.teamId ? { teamId: this.teamId, ...(projectId && { projectId }) } : { ...(projectId && { projectId }) };
    const response = await this.client.get("/v6/deployments", { params });
    return response.data.deployments as VercelDeployment[];
  }

  async getDeployment(deploymentId: string) {
    const params = this.teamId ? { teamId: this.teamId } : {};
    const response = await this.client.get(`/v13/deployments/${deploymentId}`, { params });
    return response.data as VercelDeployment;
  }
}
