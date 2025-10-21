import { PlayIcon, FrameIcon, ComponentIcon, AutoLayoutIcon, PluginIcon } from './icons'

export default function FigmaToolbar() {
  return (
    <div className="figma-toolbar">
      <div className="flex items-center gap-1">
        <button className="figma-btn-secondary gap-1.5">
          <PlayIcon className="w-3.5 h-3.5" />
          <span>Execute</span>
        </button>

        <div className="w-px h-6 bg-white/10 mx-1" />

        <button className="figma-btn-secondary" title="Workflow">
          <FrameIcon className="w-4 h-4" />
        </button>

        <button className="figma-btn-secondary" title="Agents">
          <ComponentIcon className="w-4 h-4" />
        </button>

        <button className="figma-btn-secondary" title="Layout">
          <AutoLayoutIcon className="w-4 h-4" />
        </button>

        <button className="figma-btn-secondary" title="Tools">
          <PluginIcon className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-[10px] text-white/60">
          <span className="px-2 py-1 bg-[#18A0FB]/10 text-[#18A0FB] rounded">ADK-TS</span>
          <span>3 MCPs</span>
          <span>•</span>
          <span>19 Tools</span>
          <span>•</span>
          <span>4 Agents</span>
        </div>

        <select className="figma-input w-40 text-[11px]">
          <option>Sequential Mode</option>
          <option>Parallel Mode</option>
          <option>Multi-Agent Mode</option>
        </select>
      </div>
    </div>
  )
}
