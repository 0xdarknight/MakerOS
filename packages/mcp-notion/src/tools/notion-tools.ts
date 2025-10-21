import { z } from "zod";
import { NotionService } from "../services/notion-service.js";
import dedent from "dedent";

const getDatabaseSchema = z.object({
  databaseId: z.string().min(1).describe("The Notion database ID"),
});

const getDesignSpecsSchema = z.object({
  databaseId: z.string().min(1).describe("The Notion database ID containing design specs"),
});

const getPageSchema = z.object({
  pageId: z.string().min(1).describe("The Notion page ID"),
});

const updatePageSchema = z.object({
  pageId: z.string().min(1).describe("The Notion page ID to update"),
  properties: z.record(z.any()).describe("The properties to update"),
});

type GetDatabaseParams = z.infer<typeof getDatabaseSchema>;
type GetDesignSpecsParams = z.infer<typeof getDesignSpecsSchema>;
type GetPageParams = z.infer<typeof getPageSchema>;
type UpdatePageParams = z.infer<typeof updatePageSchema>;

export const getDatabaseTool = {
  name: "NOTION_GET_DATABASE",
  description: "Query a Notion database and retrieve its contents",
  parameters: getDatabaseSchema,
  execute: async (params: GetDatabaseParams) => {
    const notionService = new NotionService();
    try {
      const data = await notionService.getDatabase(params.databaseId);
      return JSON.stringify(data, null, 2);
    } catch (error) {
      if (error instanceof Error) {
        return `Error fetching Notion database: ${error.message}`;
      }
      return "An unknown error occurred while fetching the database";
    }
  },
} as const;

export const getDesignSpecsTool = {
  name: "NOTION_GET_DESIGN_SPECS",
  description: "Get design specifications from a Notion database",
  parameters: getDesignSpecsSchema,
  execute: async (params: GetDesignSpecsParams) => {
    const notionService = new NotionService();
    try {
      const specs = await notionService.getDesignSpecs(params.databaseId);

      if (specs.length === 0) {
        return "No design specs found in the database.";
      }

      return dedent`
        Found ${specs.length} design spec(s):

        ${specs.map((spec, idx) => dedent`
          ${idx + 1}. ${spec.title}
             ID: ${spec.id}
             Status: ${spec.status}
             Description: ${spec.description}
             Requirements: ${spec.requirements.join(", ")}
             Figma File ID: ${spec.figmaFileId || "Not set"}
             Vercel Project ID: ${spec.vercelProjectId || "Not set"}
        `).join("\n\n")}
      `;
    } catch (error) {
      if (error instanceof Error) {
        return `Error fetching design specs: ${error.message}`;
      }
      return "An unknown error occurred while fetching design specs";
    }
  },
} as const;

export const getPageTool = {
  name: "NOTION_GET_PAGE",
  description: "Retrieve a specific Notion page by ID",
  parameters: getPageSchema,
  execute: async (params: GetPageParams) => {
    const notionService = new NotionService();
    try {
      const data = await notionService.getPage(params.pageId);
      return JSON.stringify(data, null, 2);
    } catch (error) {
      if (error instanceof Error) {
        return `Error fetching Notion page: ${error.message}`;
      }
      return "An unknown error occurred while fetching the page";
    }
  },
} as const;

export const updatePageTool = {
  name: "NOTION_UPDATE_PAGE",
  description: "Update properties of a Notion page",
  parameters: updatePageSchema,
  execute: async (params: UpdatePageParams) => {
    const notionService = new NotionService();
    try {
      const data = await notionService.updatePage(params.pageId, params.properties);
      return dedent`
        Page updated successfully.

        ${JSON.stringify(data, null, 2)}
      `;
    } catch (error) {
      if (error instanceof Error) {
        return `Error updating Notion page: ${error.message}`;
      }
      return "An unknown error occurred while updating the page";
    }
  },
} as const;
