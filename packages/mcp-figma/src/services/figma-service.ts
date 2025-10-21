import axios, { AxiosInstance } from "axios";
import { getFigmaConfig } from "../lib/config.js";

export interface FigmaFile {
  name: string;
  lastModified: string;
  thumbnailUrl: string;
  version: string;
  document: any;
}

export interface FigmaNode {
  id: string;
  name: string;
  type: string;
  children?: FigmaNode[];
}

export interface FigmaImageExport {
  err: string | null;
  images: Record<string, string>;
}

export class FigmaService {
  private client: AxiosInstance;

  constructor() {
    const config = getFigmaConfig();

    this.client = axios.create({
      baseURL: "https://api.figma.com/v1",
      headers: {
        "X-Figma-Token": config.apiKey,
      },
    });
  }

  async getFile(fileKey: string, depth?: number): Promise<FigmaFile> {
    const params: any = {};
    if (depth !== undefined) params.depth = depth;

    const response = await this.client.get(`/files/${fileKey}`, { params });
    return response.data;
  }

  async getFileNodes(fileKey: string, nodeIds: string[]): Promise<any> {
    const response = await this.client.get(`/files/${fileKey}/nodes`, {
      params: { ids: nodeIds.join(",") },
    });
    return response.data;
  }

  async exportImages(
    fileKey: string,
    nodeIds: string[],
    format: "png" | "jpg" | "svg" | "pdf" = "png",
    scale: number = 1
  ): Promise<FigmaImageExport> {
    const response = await this.client.get(`/images/${fileKey}`, {
      params: {
        ids: nodeIds.join(","),
        format,
        scale,
      },
    });
    return response.data;
  }

  async getComments(fileKey: string): Promise<any[]> {
    const response = await this.client.get(`/files/${fileKey}/comments`);
    return response.data.comments || [];
  }

  async postComment(fileKey: string, message: string, clientMeta?: any): Promise<any> {
    const response = await this.client.post(`/files/${fileKey}/comments`, {
      message,
      client_meta: clientMeta,
    });
    return response.data;
  }

  async getTeamProjects(teamId: string): Promise<any[]> {
    const response = await this.client.get(`/teams/${teamId}/projects`);
    return response.data.projects || [];
  }

  async getProjectFiles(projectId: string): Promise<any[]> {
    const response = await this.client.get(`/projects/${projectId}/files`);
    return response.data.files || [];
  }

  async getFileComponents(fileKey: string): Promise<any> {
    const response = await this.client.get(`/files/${fileKey}/components`);
    return response.data;
  }

  async getFileStyles(fileKey: string): Promise<any> {
    const response = await this.client.get(`/files/${fileKey}/styles`);
    return response.data;
  }
}
