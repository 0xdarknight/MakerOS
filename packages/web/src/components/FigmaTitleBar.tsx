import { MakerOSLogo } from './icons'

export default function FigmaTitleBar() {
  return (
    <div className="figma-titlebar">
      <div className="flex items-center gap-2">
        <MakerOSLogo className="w-5 h-5" />
        <span className="text-xs font-medium">Maker OS</span>
        <span className="text-[10px] text-white/40">—</span>
        <span className="text-[10px] text-white/40">ADK-TS Multi-Agent Orchestration</span>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-[10px] text-white/60">3 MCPs • 19 Tools • 4 Agents</span>
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-[#F24822]" />
          <div className="w-3 h-3 rounded-full bg-[#FFCD29]" />
          <div className="w-3 h-3 rounded-full bg-[#1BC47D]" />
        </div>
      </div>
    </div>
  )
}
