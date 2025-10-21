import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

export interface WorkflowConfig {
  notionDatabase?: string
  figmaFile?: string
  vercelProject?: string
  mode: 'sequential' | 'parallel' | 'multi-agent'
}

export interface WorkflowResult {
  sessionId: string
  status: 'running' | 'completed' | 'error'
  phases: {
    name: string
    status: 'pending' | 'running' | 'completed' | 'error'
    result?: any
    error?: string
  }[]
  result?: {
    deploymentUrl?: string
    vercelProjectId?: string
    assetsCount?: number
  }
}

export async function executeWorkflow(config: WorkflowConfig): Promise<WorkflowResult> {
  const response = await axios.post(`${API_URL}/workflow/execute`, config)
  return response.data
}

export async function getWorkflowStatus(sessionId: string): Promise<WorkflowResult> {
  const response = await axios.get(`${API_URL}/workflow/status/${sessionId}`)
  return response.data
}

export async function getMCPStatus() {
  const response = await axios.get(`${API_URL}/mcp/status`)
  return response.data
}
