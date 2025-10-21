import { LayersIcon, ChevronRightIcon, CheckIcon, ComponentIcon, PluginIcon } from './icons'
import { useState } from 'react'
import { useWorkflow } from '@/lib/workflow-context'

export default function FigmaLeftPanel() {
  const { notionDatabase, figmaFile, vercelProject, setNotionDatabase, setFigmaFile, setVercelProject } = useWorkflow()

  const [expandedSections, setExpandedSections] = useState({
    config: true,
    workflow: true,
    agents: true,
    mcps: true,
  })

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }))
  }

  return (
    <div className="figma-panel w-60 flex flex-col overflow-hidden">
      <div className="h-11 flex items-center px-3 border-b border-white/10">
        <LayersIcon className="w-4 h-4 mr-2 text-white/60" />
        <span className="text-xs font-medium">Configuration</span>
      </div>

      <div className="flex-1 overflow-y-auto figma-scrollbar p-2">
        <div className="mb-4">
          <button
            onClick={() => toggleSection('config')}
            className="figma-layers-item w-full justify-start"
          >
            <ChevronRightIcon
              className={`w-3 h-3 transition-transform ${expandedSections.config ? 'rotate-90' : ''}`}
            />
            <span className="text-white/60">Workflow Config</span>
          </button>

          {expandedSections.config && (
            <div className="ml-2 mt-2 space-y-3">
              <div>
                <label className="text-[10px] text-white/60 uppercase tracking-wide block mb-1 px-2">
                  Notion Database
                </label>
                <input
                  type="text"
                  className="figma-input w-full text-[11px]"
                  placeholder="Database ID..."
                  value={notionDatabase}
                  onChange={(e) => setNotionDatabase(e.target.value)}
                />
              </div>

              <div>
                <label className="text-[10px] text-white/60 uppercase tracking-wide block mb-1 px-2">
                  Figma File
                </label>
                <input
                  type="text"
                  className="figma-input w-full text-[11px]"
                  placeholder="File key..."
                  value={figmaFile}
                  onChange={(e) => setFigmaFile(e.target.value)}
                />
              </div>

              <div>
                <label className="text-[10px] text-white/60 uppercase tracking-wide block mb-1 px-2">
                  Vercel Project
                </label>
                <input
                  type="text"
                  className="figma-input w-full text-[11px]"
                  placeholder="Project ID..."
                  value={vercelProject}
                  onChange={(e) => setVercelProject(e.target.value)}
                />
              </div>
            </div>
          )}
        </div>
        <div className="mb-4">
          <button
            onClick={() => toggleSection('workflow')}
            className="figma-layers-item w-full justify-start"
          >
            <ChevronRightIcon
              className={`w-3 h-3 transition-transform ${expandedSections.workflow ? 'rotate-90' : ''}`}
            />
            <span className="text-white/60">Workflow</span>
          </button>

          {expandedSections.workflow && (
            <div className="ml-4 mt-1 space-y-1">
              <div className="figma-layers-item">
                <div className="w-2 h-2 rounded-full bg-[#18A0FB]" />
                <span>Phase 1: Discovery</span>
              </div>
              <div className="figma-layers-item">
                <div className="w-2 h-2 rounded-full bg-white/20" />
                <span>Phase 2: Processing</span>
              </div>
              <div className="figma-layers-item">
                <div className="w-2 h-2 rounded-full bg-white/20" />
                <span>Phase 3: Deploy</span>
              </div>
              <div className="figma-layers-item">
                <div className="w-2 h-2 rounded-full bg-white/20" />
                <span>Phase 4: Tracking</span>
              </div>
            </div>
          )}
        </div>

        <div className="mb-4">
          <button
            onClick={() => toggleSection('agents')}
            className="figma-layers-item w-full justify-start"
          >
            <ChevronRightIcon
              className={`w-3 h-3 transition-transform ${expandedSections.agents ? 'rotate-90' : ''}`}
            />
            <span className="text-white/60">ADK-TS Agents</span>
          </button>

          {expandedSections.agents && (
            <div className="ml-4 mt-1 space-y-1">
              <div className="figma-layers-item">
                <CheckIcon className="w-3 h-3 text-[#1BC47D]" />
                <ComponentIcon className="w-3 h-3 text-[#18A0FB]" />
                <span>Maker OS Agent</span>
              </div>
              <div className="figma-layers-item">
                <div className="w-3 h-3 rounded-full border border-white/30" />
                <ComponentIcon className="w-3 h-3 text-white/60" />
                <span>Notion Analyst</span>
              </div>
              <div className="figma-layers-item">
                <div className="w-3 h-3 rounded-full border border-white/30" />
                <ComponentIcon className="w-3 h-3 text-white/60" />
                <span>Figma Designer</span>
              </div>
              <div className="figma-layers-item">
                <div className="w-3 h-3 rounded-full border border-white/30" />
                <ComponentIcon className="w-3 h-3 text-white/60" />
                <span>Vercel Deployer</span>
              </div>
            </div>
          )}
        </div>

        <div>
          <button
            onClick={() => toggleSection('mcps')}
            className="figma-layers-item w-full justify-start"
          >
            <ChevronRightIcon
              className={`w-3 h-3 transition-transform ${expandedSections.mcps ? 'rotate-90' : ''}`}
            />
            <span className="text-white/60">MCP Servers</span>
          </button>

          {expandedSections.mcps && (
            <div className="ml-4 mt-1 space-y-1">
              <div className="figma-layers-item">
                <CheckIcon className="w-3 h-3 text-[#1BC47D]" />
                <PluginIcon className="w-3 h-3 text-[#7B61FF]" />
                <span>Notion</span>
                <span className="ml-auto text-[10px] text-white/40">4 tools</span>
              </div>
              <div className="figma-layers-item">
                <CheckIcon className="w-3 h-3 text-[#1BC47D]" />
                <PluginIcon className="w-3 h-3 text-[#7B61FF]" />
                <span>Figma</span>
                <span className="ml-auto text-[10px] text-white/40">9 tools</span>
              </div>
              <div className="figma-layers-item">
                <CheckIcon className="w-3 h-3 text-[#1BC47D]" />
                <PluginIcon className="w-3 h-3 text-[#7B61FF]" />
                <span>Vercel</span>
                <span className="ml-auto text-[10px] text-white/40">6 tools</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
