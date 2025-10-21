import { motion } from 'framer-motion'
import { useWorkflow } from '@/lib/workflow-context'
import { CheckCircleIcon, CircleIcon, AlertCircleIcon, ArrowRightIcon } from './icons'

export default function Canvas() {
  const { workflow, isRunning } = useWorkflow()

  return (
    <div className="flex-1 bg-figma-bg overflow-auto p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">Design to Deploy Workflow</h1>
          <p className="text-figma-text-secondary">
            Automated pipeline from Notion specs → Figma assets → Vercel deployment
          </p>
        </div>

        <div className="space-y-4">
          <WorkflowPhase
            title="Phase 1: Discovery & Analysis"
            description="Read design specifications from Notion database"
            status={workflow.phases[0]?.status || 'pending'}
            isActive={isRunning && workflow.currentPhase === 0}
            tools={['NOTION_GET_DESIGN_SPECS', 'NOTION_GET_DATABASE']}
          />

          <PhaseConnector isActive={workflow.currentPhase > 0} />

          <WorkflowPhase
            title="Phase 2: Design Asset Processing"
            description="Extract and export assets from Figma files"
            status={workflow.phases[1]?.status || 'pending'}
            isActive={isRunning && workflow.currentPhase === 1}
            tools={['FIGMA_GET_FILE', 'FIGMA_EXPORT_IMAGES', 'FIGMA_GET_FILE_NODES']}
          />

          <PhaseConnector isActive={workflow.currentPhase > 1} />

          <WorkflowPhase
            title="Phase 3: Deployment Orchestration"
            description="Deploy to Vercel with automated configuration"
            status={workflow.phases[2]?.status || 'pending'}
            isActive={isRunning && workflow.currentPhase === 2}
            tools={['VERCEL_CREATE_PROJECT', 'VERCEL_CREATE_DEPLOYMENT']}
          />

          <PhaseConnector isActive={workflow.currentPhase > 2} />

          <WorkflowPhase
            title="Phase 4: Tracking & Documentation"
            description="Update Notion with deployment URLs and metadata"
            status={workflow.phases[3]?.status || 'pending'}
            isActive={isRunning && workflow.currentPhase === 3}
            tools={['NOTION_UPDATE_PAGE', 'FIGMA_POST_COMMENT']}
          />
        </div>

        {workflow.result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 figma-panel p-6"
          >
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <CheckCircleIcon className="w-5 h-5 text-figma-success" />
              Workflow Completed
            </h3>
            <div className="space-y-2 text-sm">
              <ResultItem label="Deployment URL" value={workflow.result.deploymentUrl} />
              <ResultItem label="Vercel Project ID" value={workflow.result.vercelProjectId} />
              <ResultItem label="Assets Exported" value={workflow.result.assetsCount} />
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

function WorkflowPhase({ title, description, status, isActive, tools }: any) {
  const getStatusIcon = () => {
    if (status === 'completed') return <CheckCircleIcon className="w-5 h-5 text-figma-success" />
    if (status === 'running' || isActive) return <CircleIcon className="w-5 h-5 text-figma-accent animate-pulse" />
    if (status === 'error') return <AlertCircleIcon className="w-5 h-5 text-figma-warning" />
    return <CircleIcon className="w-5 h-5 text-figma-text-secondary opacity-30" />
  }

  return (
    <motion.div
      initial={false}
      animate={{
        scale: isActive ? 1.02 : 1,
        borderColor: isActive ? '#0D99FF' : '#3C3C3C',
      }}
      className="figma-panel p-6 transition-all"
    >
      <div className="flex items-start gap-4">
        <div className="mt-0.5">{getStatusIcon()}</div>

        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-1">{title}</h3>
          <p className="text-sm text-figma-text-secondary mb-3">{description}</p>

          <div className="flex flex-wrap gap-2">
            {tools.map((tool: string) => (
              <span
                key={tool}
                className="px-2 py-1 bg-figma-bg border border-figma-border rounded text-xs font-mono"
              >
                {tool}
              </span>
            ))}
          </div>

          {status === 'running' && (
            <div className="mt-3 h-1 bg-figma-bg rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-figma-accent"
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

function PhaseConnector({ isActive }: { isActive: boolean }) {
  return (
    <div className="flex items-center justify-center py-2">
      <ArrowRightIcon className={`w-5 h-5 ${isActive ? 'text-figma-accent' : 'text-figma-text-secondary opacity-30'}`} />
    </div>
  )
}

function ResultItem({ label, value }: { label: string; value: any }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-figma-text-secondary">{label}:</span>
      <span className="font-mono">{value || 'N/A'}</span>
    </div>
  )
}
