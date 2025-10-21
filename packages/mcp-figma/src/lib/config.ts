export interface FigmaConfig {
  apiKey: string;
}

export function getFigmaConfig(): FigmaConfig {
  const apiKey = process.env.FIGMA_API_KEY;

  if (!apiKey) {
    throw new Error("FIGMA_API_KEY environment variable is required");
  }

  return { apiKey };
}
