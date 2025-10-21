import { Database, Figma, Cloud, LayersIcon } from './icons'
import { useWorkflow } from '@/lib/workflow-context'

export default function Sidebar() {
  const { notionDatabase, figmaFile, vercelProject } = useWorkflow()

  return (
    <div className="figma-sidebar">
      <div className="p-4 border-b border-figma-border">
        <h2 className="text-xs font-semibold text-figma-text-secondary uppercase tracking-wide mb-3">
          Workflow Configuration
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <ConfigSection
          icon={<Database className="w-4 h-4" />}
          title="Notion Database"
          value={notionDatabase}
          placeholder="Enter database ID"
        />

        <ConfigSection
          icon={<Figma className="w-4 h-4" />}
          title="Figma File"
          value={figmaFile}
          placeholder="Enter file key (optional)"
        />

        <ConfigSection
          icon={<Cloud className="w-4 h-4" />}
          title="Vercel Project"
          value={vercelProject}
          placeholder="Enter project ID (optional)"
        />

        <div className="pt-4 border-t border-figma-border">
          <h3 className="text-xs font-semibold text-figma-text-secondary uppercase tracking-wide mb-3">
            MCP Servers
          </h3>
          <div className="space-y-2">
            <MCPServer name="Notion MCP" status="connected" tools={4} />
            <MCPServer name="Figma MCP" status="connected" tools={9} />
            <MCPServer name="Vercel MCP" status="connected" tools={6} />
          </div>
        </div>
      </div>
    </div>
  )
}

function ConfigSection({ icon, title, value, placeholder }: any) {
  return (
    <div>
      <label className="flex items-center gap-2 text-sm font-medium mb-2">
        {icon}
        {title}
      </label>
      <input
        type="text"
        className="figma-input w-full"
        placeholder={placeholder}
        defaultValue={value}
      />
    </div>
  )
}

function MCPServer({ name, status, tools }: any) {
  return (
    <div className="flex items-center justify-between p-2 rounded hover:bg-figma-hover transition-colors">
      <div className="flex items-center gap-2">
        <LayersIcon className="w-3.5 h-3.5 text-figma-text-secondary" />
        <span className="text-sm">{name}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs text-figma-text-secondary">{tools} tools</span>
        <div className={status === 'connected' ? 'status-success' : 'status-dot bg-gray-500'} />
      </div>
    </div>
  )
}
