import { z } from "zod";
import { FigmaService } from "../services/figma-service.js";
import dedent from "dedent";

const getFileSchema = z.object({
  fileKey: z.string().min(1).describe("The Figma file key"),
  depth: z.number().optional().describe("How deep to traverse the node tree (1-3)"),
});

const getFileNodesSchema = z.object({
  fileKey: z.string().min(1).describe("The Figma file key"),
  nodeIds: z.array(z.string()).describe("Array of node IDs to retrieve"),
});

const exportImagesSchema = z.object({
  fileKey: z.string().min(1).describe("The Figma file key"),
  nodeIds: z.array(z.string()).describe("Array of node IDs to export"),
  format: z.enum(["png", "jpg", "svg", "pdf"]).default("png").describe("Export format"),
  scale: z.number().min(0.01).max(4).default(1).describe("Scale factor (0.01-4)"),
});

const getCommentsSchema = z.object({
  fileKey: z.string().min(1).describe("The Figma file key"),
});

const postCommentSchema = z.object({
  fileKey: z.string().min(1).describe("The Figma file key"),
  message: z.string().min(1).describe("Comment message"),
  clientMeta: z.any().optional().describe("Position metadata for the comment"),
});

const getTeamProjectsSchema = z.object({
  teamId: z.string().min(1).describe("The Figma team ID"),
});

const getProjectFilesSchema = z.object({
  projectId: z.string().min(1).describe("The Figma project ID"),
});

const getFileComponentsSchema = z.object({
  fileKey: z.string().min(1).describe("The Figma file key"),
});

const getFileStylesSchema = z.object({
  fileKey: z.string().min(1).describe("The Figma file key"),
});

type GetFileParams = z.infer<typeof getFileSchema>;
type GetFileNodesParams = z.infer<typeof getFileNodesSchema>;
type ExportImagesParams = z.infer<typeof exportImagesSchema>;
type GetCommentsParams = z.infer<typeof getCommentsSchema>;
type PostCommentParams = z.infer<typeof postCommentSchema>;
type GetTeamProjectsParams = z.infer<typeof getTeamProjectsSchema>;
type GetProjectFilesParams = z.infer<typeof getProjectFilesSchema>;
type GetFileComponentsParams = z.infer<typeof getFileComponentsSchema>;
type GetFileStylesParams = z.infer<typeof getFileStylesSchema>;

export const getFileTool = {
  name: "FIGMA_GET_FILE",
  description: "Get Figma file structure and metadata",
  parameters: getFileSchema,
  execute: async (params: GetFileParams) => {
    const figmaService = new FigmaService();
    try {
      const file = await figmaService.getFile(params.fileKey, params.depth);
      return dedent`
        File: ${file.name}
        Last Modified: ${file.lastModified}
        Version: ${file.version}

        ${JSON.stringify(file.document, null, 2)}
      `;
    } catch (error) {
      if (error instanceof Error) {
        return `Error fetching Figma file: ${error.message}`;
      }
      return "An unknown error occurred while fetching the file";
    }
  },
} as const;

export const getFileNodesTool = {
  name: "FIGMA_GET_FILE_NODES",
  description: "Get specific nodes from a Figma file",
  parameters: getFileNodesSchema,
  execute: async (params: GetFileNodesParams) => {
    const figmaService = new FigmaService();
    try {
      const nodes = await figmaService.getFileNodes(params.fileKey, params.nodeIds);
      return JSON.stringify(nodes, null, 2);
    } catch (error) {
      if (error instanceof Error) {
        return `Error fetching Figma nodes: ${error.message}`;
      }
      return "An unknown error occurred while fetching nodes";
    }
  },
} as const;

export const exportImagesTool = {
  name: "FIGMA_EXPORT_IMAGES",
  description: "Export images from Figma nodes",
  parameters: exportImagesSchema,
  execute: async (params: ExportImagesParams) => {
    const figmaService = new FigmaService();
    try {
      const result = await figmaService.exportImages(
        params.fileKey,
        params.nodeIds,
        params.format,
        params.scale
      );

      if (result.err) {
        return `Error exporting images: ${result.err}`;
      }

      const imageUrls = Object.entries(result.images)
        .map(([nodeId, url]) => `${nodeId}: ${url}`)
        .join("\n");

      return dedent`
        Successfully exported ${Object.keys(result.images).length} image(s):

        ${imageUrls}
      `;
    } catch (error) {
      if (error instanceof Error) {
        return `Error exporting images: ${error.message}`;
      }
      return "An unknown error occurred while exporting images";
    }
  },
} as const;

export const getCommentsTool = {
  name: "FIGMA_GET_COMMENTS",
  description: "Get comments from a Figma file",
  parameters: getCommentsSchema,
  execute: async (params: GetCommentsParams) => {
    const figmaService = new FigmaService();
    try {
      const comments = await figmaService.getComments(params.fileKey);

      if (comments.length === 0) {
        return "No comments found in this file.";
      }

      return dedent`
        Found ${comments.length} comment(s):

        ${comments.map((c, idx) => `${idx + 1}. ${c.user?.handle || 'Unknown'}: ${c.message}`).join("\n")}
      `;
    } catch (error) {
      if (error instanceof Error) {
        return `Error fetching comments: ${error.message}`;
      }
      return "An unknown error occurred while fetching comments";
    }
  },
} as const;

export const postCommentTool = {
  name: "FIGMA_POST_COMMENT",
  description: "Add a comment to a Figma file",
  parameters: postCommentSchema,
  execute: async (params: PostCommentParams) => {
    const figmaService = new FigmaService();
    try {
      const result = await figmaService.postComment(params.fileKey, params.message, params.clientMeta);
      return `Comment posted successfully. ID: ${result.id}`;
    } catch (error) {
      if (error instanceof Error) {
        return `Error posting comment: ${error.message}`;
      }
      return "An unknown error occurred while posting comment";
    }
  },
} as const;

export const getTeamProjectsTool = {
  name: "FIGMA_GET_TEAM_PROJECTS",
  description: "Get projects in a Figma team",
  parameters: getTeamProjectsSchema,
  execute: async (params: GetTeamProjectsParams) => {
    const figmaService = new FigmaService();
    try {
      const projects = await figmaService.getTeamProjects(params.teamId);

      if (projects.length === 0) {
        return "No projects found in this team.";
      }

      return dedent`
        Found ${projects.length} project(s):

        ${projects.map((p, idx) => `${idx + 1}. ${p.name} (ID: ${p.id})`).join("\n")}
      `;
    } catch (error) {
      if (error instanceof Error) {
        return `Error fetching team projects: ${error.message}`;
      }
      return "An unknown error occurred while fetching projects";
    }
  },
} as const;

export const getProjectFilesTool = {
  name: "FIGMA_GET_PROJECT_FILES",
  description: "Get files in a Figma project",
  parameters: getProjectFilesSchema,
  execute: async (params: GetProjectFilesParams) => {
    const figmaService = new FigmaService();
    try {
      const files = await figmaService.getProjectFiles(params.projectId);

      if (files.length === 0) {
        return "No files found in this project.";
      }

      return dedent`
        Found ${files.length} file(s):

        ${files.map((f, idx) => `${idx + 1}. ${f.name} (Key: ${f.key})`).join("\n")}
      `;
    } catch (error) {
      if (error instanceof Error) {
        return `Error fetching project files: ${error.message}`;
      }
      return "An unknown error occurred while fetching files";
    }
  },
} as const;

export const getFileComponentsTool = {
  name: "FIGMA_GET_FILE_COMPONENTS",
  description: "Get components in a Figma file",
  parameters: getFileComponentsSchema,
  execute: async (params: GetFileComponentsParams) => {
    const figmaService = new FigmaService();
    try {
      const result = await figmaService.getFileComponents(params.fileKey);
      return JSON.stringify(result, null, 2);
    } catch (error) {
      if (error instanceof Error) {
        return `Error fetching file components: ${error.message}`;
      }
      return "An unknown error occurred while fetching components";
    }
  },
} as const;

export const getFileStylesTool = {
  name: "FIGMA_GET_FILE_STYLES",
  description: "Get styles in a Figma file",
  parameters: getFileStylesSchema,
  execute: async (params: GetFileStylesParams) => {
    const figmaService = new FigmaService();
    try {
      const result = await figmaService.getFileStyles(params.fileKey);
      return JSON.stringify(result, null, 2);
    } catch (error) {
      if (error instanceof Error) {
        return `Error fetching file styles: ${error.message}`;
      }
      return "An unknown error occurred while fetching styles";
    }
  },
} as const;
