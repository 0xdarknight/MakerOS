import { createContext, useContext, useState, useCallback, ReactNode } from 'react'

interface WorkflowPhase {
  status: 'pending' | 'running' | 'completed' | 'error'
  startTime?: number
  endTime?: number
  error?: string
}

interface WorkflowState {
  currentPhase: number
  phases: WorkflowPhase[]
  result?: {
    deploymentUrl?: string
    vercelProjectId?: string
    assetsCount?: number
  }
}

interface WorkflowContextType {
  notionDatabase: string
  figmaFile: string
  vercelProject: string
  setNotionDatabase: (value: string) => void
  setFigmaFile: (value: string) => void
  setVercelProject: (value: string) => void
  workflow: WorkflowState
  logs: any[]
  activity: any[]
  isRunning: boolean
  startWorkflow: () => void
}

const WorkflowContext = createContext<WorkflowContextType | undefined>(undefined)

export function WorkflowProvider({ children }: { children: ReactNode }) {
  const [notionDatabase, setNotionDatabase] = useState('')
  const [figmaFile, setFigmaFile] = useState('')
  const [vercelProject, setVercelProject] = useState('')
  const [isRunning, setIsRunning] = useState(false)

  const [workflow, setWorkflow] = useState<WorkflowState>({
    currentPhase: -1,
    phases: [
      { status: 'pending' },
      { status: 'pending' },
      { status: 'pending' },
      { status: 'pending' },
    ],
  })

  const [logs, setLogs] = useState<any[]>([])
  const [activity, setActivity] = useState<any[]>([])

  const addLog = useCallback((message: string, level: 'info' | 'success' | 'error' = 'info') => {
    const timestamp = new Date().toLocaleTimeString()
    setLogs(prev => [...prev, { message, level, timestamp }])
  }, [])

  const addActivity = useCallback((action: string, details: string) => {
    const timestamp = new Date().toLocaleTimeString()
    setActivity(prev => [...prev, { action, details, timestamp }])
  }, [])

  const simulatePhase = useCallback(async (phaseIndex: number, phaseName: string) => {
    setWorkflow(prev => ({
      ...prev,
      currentPhase: phaseIndex,
      phases: prev.phases.map((p, i) =>
        i === phaseIndex ? { ...p, status: 'running', startTime: Date.now() } : p
      ),
    }))

    addLog(`Starting ${phaseName}...`)
    addActivity(phaseName, 'Phase started')

    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 2000))

    setWorkflow(prev => ({
      ...prev,
      phases: prev.phases.map((p, i) =>
        i === phaseIndex ? { ...p, status: 'completed', endTime: Date.now() } : p
      ),
    }))

    addLog(`Completed ${phaseName}`, 'success')
    addActivity(phaseName, 'Phase completed successfully')
  }, [addLog, addActivity])

  const startWorkflow = useCallback(async () => {
    if (isRunning) return

    setIsRunning(true)
    setLogs([])
    setActivity([])
    setWorkflow({
      currentPhase: -1,
      phases: [
        { status: 'pending' },
        { status: 'pending' },
        { status: 'pending' },
        { status: 'pending' },
      ],
    })

    addLog('Workflow execution started', 'info')

    try {
      await simulatePhase(0, 'Discovery & Analysis')
      await simulatePhase(1, 'Design Asset Processing')
      await simulatePhase(2, 'Deployment Orchestration')
      await simulatePhase(3, 'Tracking & Documentation')

      setWorkflow(prev => ({
        ...prev,
        currentPhase: 4,
        result: {
          deploymentUrl: 'https://maker-os-demo.vercel.app',
          vercelProjectId: 'prj_abc123xyz',
          assetsCount: 12,
        },
      }))

      addLog('Workflow completed successfully!', 'success')
    } catch (error) {
      addLog('Workflow failed', 'error')
    } finally {
      setIsRunning(false)
    }
  }, [isRunning, simulatePhase, addLog])

  const value = {
    notionDatabase,
    figmaFile,
    vercelProject,
    setNotionDatabase,
    setFigmaFile,
    setVercelProject,
    workflow,
    logs,
    activity,
    isRunning,
    startWorkflow,
  }

  return <WorkflowContext.Provider value={value}>{children}</WorkflowContext.Provider>
}

export function useWorkflow() {
  const context = useContext(WorkflowContext)
  if (context === undefined) {
    throw new Error('useWorkflow must be used within a WorkflowProvider')
  }
  return context
}
