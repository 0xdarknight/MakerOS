import { Play, Settings, HelpCircle, Zap } from 'lucide-react'
import { useWorkflow } from '@/lib/workflow-context'

export default function Toolbar() {
  const { isRunning, startWorkflow } = useWorkflow()

  return (
    <div className="figma-toolbar">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-figma-accent" />
          <span className="font-semibold">Maker OS</span>
        </div>

        <div className="h-6 w-px bg-figma-border" />

        <button
          onClick={startWorkflow}
          disabled={isRunning}
          className={`figma-button-primary flex items-center gap-2 ${
            isRunning ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <Play className="w-4 h-4" />
          {isRunning ? 'Running...' : 'Run Workflow'}
        </button>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <button className="figma-button-secondary">
          <Settings className="w-4 h-4" />
        </button>
        <button className="figma-button-secondary">
          <HelpCircle className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
