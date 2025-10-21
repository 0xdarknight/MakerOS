import { Client } from "@notionhq/client";
import { getNotionConfig } from "../lib/config.js";

export interface DesignSpec {
  id: string;
  title: string;
  description: string;
  requirements: string[];
  status: string;
  figmaFileId?: string;
  vercelProjectId?: string;
}

export class NotionService {
  private client: Client;

  constructor() {
    const config = getNotionConfig();
    this.client = new Client({ auth: config.apiKey });
  }

  async getDatabase(databaseId: string) {
    const response = await this.client.databases.query({
      database_id: databaseId,
    });
    return response;
  }

  async getDesignSpecs(databaseId: string): Promise<DesignSpec[]> {
    const response = await this.client.databases.query({
      database_id: databaseId,
      filter: {
        property: "Type",
        select: {
          equals: "Design Spec",
        },
      },
    });

    return response.results.map((page: any) => {
      const props = page.properties;

      return {
        id: page.id,
        title: props.Name?.title?.[0]?.plain_text || "",
        description: props.Description?.rich_text?.[0]?.plain_text || "",
        requirements: props.Requirements?.rich_text?.[0]?.plain_text?.split("\n") || [],
        status: props.Status?.status?.name || "Not Started",
        figmaFileId: props.FigmaFileId?.rich_text?.[0]?.plain_text,
        vercelProjectId: props.VercelProjectId?.rich_text?.[0]?.plain_text,
      };
    });
  }

  async getPage(pageId: string) {
    const response = await this.client.pages.retrieve({ page_id: pageId });
    return response;
  }

  async updatePage(pageId: string, properties: any) {
    const response = await this.client.pages.update({
      page_id: pageId,
      properties,
    });
    return response;
  }
}
