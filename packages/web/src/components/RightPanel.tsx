import { useState } from 'react'
import { Terminal, Activity, FileText } from './icons'
import { useWorkflow } from '@/lib/workflow-context'

export default function RightPanel() {
  const [activeTab, setActiveTab] = useState<'logs' | 'activity' | 'output'>('logs')
  const { logs, activity } = useWorkflow()

  return (
    <div className="w-96 bg-figma-surface border-l border-figma-border flex flex-col">
      <div className="flex border-b border-figma-border">
        <Tab
          icon={<Terminal className="w-4 h-4" />}
          label="Logs"
          active={activeTab === 'logs'}
          onClick={() => setActiveTab('logs')}
        />
        <Tab
          icon={<Activity className="w-4 h-4" />}
          label="Activity"
          active={activeTab === 'activity'}
          onClick={() => setActiveTab('activity')}
        />
        <Tab
          icon={<FileText className="w-4 h-4" />}
          label="Output"
          active={activeTab === 'output'}
          onClick={() => setActiveTab('output')}
        />
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'logs' && <LogsView logs={logs} />}
        {activeTab === 'activity' && <ActivityView activity={activity} />}
        {activeTab === 'output' && <OutputView />}
      </div>
    </div>
  )
}

function Tab({ icon, label, active, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors ${
        active
          ? 'border-b-2 border-figma-accent text-figma-text'
          : 'text-figma-text-secondary hover:text-figma-text'
      }`}
    >
      {icon}
      {label}
    </button>
  )
}

function LogsView({ logs }: any) {
  if (!logs || logs.length === 0) {
    return (
      <div className="text-center text-figma-text-secondary text-sm py-8">
        No logs yet. Start a workflow to see execution logs.
      </div>
    )
  }

  return (
    <div className="space-y-2 font-mono text-xs">
      {logs.map((log: any, i: number) => (
        <div
          key={i}
          className={`p-2 rounded ${
            log.level === 'error'
              ? 'bg-red-900/20 text-red-400'
              : log.level === 'success'
              ? 'bg-green-900/20 text-green-400'
              : 'bg-figma-bg text-figma-text-secondary'
          }`}
        >
          <span className="opacity-50">[{log.timestamp}]</span> {log.message}
        </div>
      ))}
    </div>
  )
}

function ActivityView({ activity }: any) {
  return (
    <div className="space-y-4">
      {activity.map((item: any, i: number) => (
        <div key={i} className="border-l-2 border-figma-accent pl-4">
          <div className="text-sm font-medium">{item.action}</div>
          <div className="text-xs text-figma-text-secondary mt-1">{item.details}</div>
          <div className="text-xs text-figma-text-secondary mt-1 opacity-50">{item.timestamp}</div>
        </div>
      ))}

      {(!activity || activity.length === 0) && (
        <div className="text-center text-figma-text-secondary text-sm py-8">
          No activity yet.
        </div>
      )}
    </div>
  )
}

function OutputView() {
  return (
    <div className="space-y-3">
      <div className="figma-panel p-3">
        <div className="text-xs font-semibold text-figma-text-secondary mb-2">Session Info</div>
        <div className="space-y-1 text-xs font-mono">
          <div>ID: session_1234567890</div>
          <div>Mode: Multi-Agent (parallel)</div>
          <div>Started: 2025-10-21 17:45:32</div>
        </div>
      </div>

      <div className="figma-panel p-3">
        <div className="text-xs font-semibold text-figma-text-secondary mb-2">Agent Status</div>
        <div className="space-y-2 text-xs">
          <AgentStatus name="Maker OS Agent" status="active" />
          <AgentStatus name="Notion Analyst" status="idle" />
          <AgentStatus name="Figma Designer" status="idle" />
          <AgentStatus name="Vercel Deployer" status="idle" />
        </div>
      </div>
    </div>
  )
}

function AgentStatus({ name, status }: { name: string; status: string }) {
  return (
    <div className="flex items-center justify-between">
      <span>{name}</span>
      <div className="flex items-center gap-2">
        <span className="text-figma-text-secondary">{status}</span>
        <div className={status === 'active' ? 'status-running' : 'status-dot bg-gray-500'} />
      </div>
    </div>
  )
}
