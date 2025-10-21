export interface NotionConfig {
  apiKey: string;
}

export function getNotionConfig(): NotionConfig {
  const apiKey = process.env.NOTION_API_KEY;

  if (!apiKey) {
    throw new Error("NOTION_API_KEY environment variable is required");
  }

  return { apiKey };
}
