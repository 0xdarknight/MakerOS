import { CheckIcon, SpinnerIcon, ADKIcon } from './icons'
import { useWorkflow } from '@/lib/workflow-context'
import { executeWorkflow } from '@/lib/api'
import { useState, useEffect } from 'react'

export default function FigmaRightPanel() {
  const { workflow, logs, isRunning, startWorkflow, notionDatabase, figmaFile, vercelProject } = useWorkflow()
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [mode, setMode] = useState<'sequential' | 'parallel' | 'multi-agent'>('sequential')

  const handleExecute = async () => {
    try {
      const result = await executeWorkflow({
        notionDatabase,
        figmaFile,
        vercelProject,
        mode
      })
      setSessionId(result.sessionId)
      startWorkflow()
    } catch (error) {
      console.error('Failed to execute workflow:', error)
    }
  }

  const currentPhase = workflow.phases.findIndex(p => p.status === 'running') + 1
  const totalPhases = workflow.phases.length
  const duration = isRunning ? Math.floor((Date.now() - Date.now()) / 1000) : 0
  return (
    <div className="figma-panel w-64 flex flex-col overflow-hidden border-r-0 border-l border-white/10">
      <div className="h-11 flex items-center px-3 border-b border-white/10">
        <ADKIcon className="w-4 h-4 mr-2 text-[#18A0FB]" />
        <span className="text-xs font-medium">Properties</span>
      </div>

      <div className="flex-1 overflow-y-auto figma-scrollbar">
        <div className="p-3 space-y-4">
          <div>
            <div className="figma-section-title">Agent Configuration</div>
            <div className="space-y-2 px-2">
              <div className="figma-property">
                <span className="text-white/60">Model</span>
                <span className="font-mono text-[11px]">gemini-2.0</span>
              </div>
              <div className="figma-property">
                <span className="text-white/60">Temperature</span>
                <span className="font-mono text-[11px]">0.7</span>
              </div>
              <div className="figma-property">
                <span className="text-white/60">Max Tokens</span>
                <span className="font-mono text-[11px]">4096</span>
              </div>
              <div className="figma-property">
                <span className="text-white/60">Tools</span>
                <span className="font-mono text-[11px] text-[#18A0FB]">19 connected</span>
              </div>
            </div>
          </div>

          <div className="figma-divider" />

          <div>
            <div className="figma-section-title">Workflow Status</div>
            <div className="space-y-2 px-2">
              <div className="figma-property">
                <span className="text-white/60">Session</span>
                <span className="font-mono text-[11px]">{sessionId?.slice(0, 11) || 'Not started'}</span>
              </div>
              <div className="figma-property">
                <span className="text-white/60">Phase</span>
                <span className="font-mono text-[11px]">{currentPhase || 0}/{totalPhases}</span>
              </div>
              <div className="figma-property">
                <span className="text-white/60">Duration</span>
                <span className="font-mono text-[11px]">{String(Math.floor(duration / 60)).padStart(2, '0')}:{String(duration % 60).padStart(2, '0')}</span>
              </div>
              <div className="figma-property">
                <span className="text-white/60">Status</span>
                <div className="flex items-center gap-1.5">
                  {isRunning && <SpinnerIcon className="w-3 h-3 text-[#18A0FB]" />}
                  {!isRunning && workflow.currentPhase === 4 && <CheckIcon className="w-3 h-3 text-[#1BC47D]" />}
                  <span className={`text-[11px] ${isRunning ? 'text-[#18A0FB]' : workflow.currentPhase === 4 ? 'text-[#1BC47D]' : 'text-white/60'}`}>
                    {isRunning ? 'Running' : workflow.currentPhase === 4 ? 'Completed' : 'Ready'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="figma-divider" />

          <div>
            <div className="figma-section-title">ADK-TS Agents</div>
            <div className="space-y-1 px-2">
              <div className="flex items-center gap-2 py-1.5">
                <CheckIcon className="w-3 h-3 text-[#1BC47D]" />
                <span className="text-[11px]">Maker OS</span>
              </div>
              <div className="flex items-center gap-2 py-1.5">
                <div className="w-3 h-3 rounded-full border border-white/30" />
                <span className="text-[11px] text-white/60">Notion Analyst</span>
              </div>
              <div className="flex items-center gap-2 py-1.5">
                <div className="w-3 h-3 rounded-full border border-white/30" />
                <span className="text-[11px] text-white/60">Figma Designer</span>
              </div>
              <div className="flex items-center gap-2 py-1.5">
                <div className="w-3 h-3 rounded-full border border-white/30" />
                <span className="text-[11px] text-white/60">Vercel Deployer</span>
              </div>
            </div>
          </div>

          <div className="figma-divider" />

          <div>
            <div className="figma-section-title">Live Logs</div>
            <div className="px-2 space-y-1 max-h-48 overflow-y-auto figma-scrollbar">
              {logs.length === 0 && (
                <div className="text-[10px] text-white/40 py-2">
                  No logs yet. Execute workflow to see activity.
                </div>
              )}
              {logs.map((log, i) => (
                <div
                  key={i}
                  className="text-[10px] font-mono flex gap-2 py-1"
                >
                  <span className="text-white/40">[{log.timestamp}]</span>
                  <span
                    className={
                      log.level === 'success'
                        ? 'text-[#1BC47D]'
                        : log.level === 'error'
                        ? 'text-[#F24822]'
                        : 'text-white/60'
                    }
                  >
                    {log.message}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 p-3">
        <button
          className="figma-btn-primary w-full gap-2"
          onClick={handleExecute}
          disabled={isRunning}
        >
          {isRunning ? (
            <>
              <SpinnerIcon className="w-4 h-4" />
              <span>Running...</span>
            </>
          ) : (
            <span>Execute Workflow</span>
          )}
        </button>
      </div>
    </div>
  )
}
