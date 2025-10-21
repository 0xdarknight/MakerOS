export interface VercelConfig {
  token: string;
  teamId?: string;
}

export function getVercelConfig(): VercelConfig {
  const token = process.env.VERCEL_TOKEN;

  if (!token) {
    throw new Error("VERCEL_TOKEN environment variable is required");
  }

  return {
    token,
    teamId: process.env.VERCEL_TEAM_ID,
  };
}
