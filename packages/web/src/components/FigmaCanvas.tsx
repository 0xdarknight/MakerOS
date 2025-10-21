import { useState } from 'react'
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch'

const workflowNodes = [
  {
    id: 'phase1',
    label: 'Phase 1: Discovery',
    subtitle: 'Notion Database Query',
    x: 100,
    y: 100,
    status: 'active',
    color: '#18A0FB',
  },
  {
    id: 'phase2',
    label: 'Phase 2: Processing',
    subtitle: 'Figma Asset Generation',
    x: 400,
    y: 100,
    status: 'pending',
    color: '#7B61FF',
  },
  {
    id: 'phase3',
    label: 'Phase 3: Deploy',
    subtitle: 'Vercel Deployment',
    x: 700,
    y: 100,
    status: 'pending',
    color: '#1BC47D',
  },
  {
    id: 'phase4',
    label: 'Phase 4: Tracking',
    subtitle: 'Results Aggregation',
    x: 400,
    y: 300,
    status: 'pending',
    color: '#FFCD29',
  },
]

export default function FigmaCanvas() {
  const [selectedNode, setSelectedNode] = useState<string | null>(null)

  return (
    <div className="flex-1 relative figma-canvas overflow-hidden">
      <TransformWrapper
        initialScale={1}
        minScale={0.5}
        maxScale={2}
        centerOnInit
      >
        {({ zoomIn, zoomOut, resetTransform }) => (
          <>
            <div className="absolute top-4 right-4 z-10 flex gap-2">
              <button
                onClick={() => zoomIn()}
                className="figma-btn-secondary w-8 h-8 text-lg"
                title="Zoom In"
              >
                +
              </button>
              <button
                onClick={() => zoomOut()}
                className="figma-btn-secondary w-8 h-8 text-lg"
                title="Zoom Out"
              >
                −
              </button>
              <button
                onClick={() => resetTransform()}
                className="figma-btn-secondary px-3 text-xs"
                title="Reset View"
              >
                100%
              </button>
            </div>

            <TransformComponent
              wrapperStyle={{ width: '100%', height: '100%' }}
              contentStyle={{ width: '100%', height: '100%' }}
            >
              <div className="relative w-full h-full p-8">
                <svg
                  className="absolute inset-0 pointer-events-none"
                  style={{ width: '100%', height: '100%' }}
                >
                  <defs>
                    <marker
                      id="arrowhead"
                      markerWidth="10"
                      markerHeight="10"
                      refX="9"
                      refY="3"
                      orient="auto"
                    >
                      <polygon
                        points="0 0, 10 3, 0 6"
                        fill="rgba(255, 255, 255, 0.3)"
                      />
                    </marker>
                  </defs>

                  <line
                    x1={100 + 140}
                    y1={100 + 50}
                    x2={400}
                    y2={100 + 50}
                    stroke="rgba(255, 255, 255, 0.3)"
                    strokeWidth="2"
                    markerEnd="url(#arrowhead)"
                  />

                  <line
                    x1={400 + 140}
                    y1={100 + 50}
                    x2={700}
                    y2={100 + 50}
                    stroke="rgba(255, 255, 255, 0.3)"
                    strokeWidth="2"
                    markerEnd="url(#arrowhead)"
                  />

                  <line
                    x1={700 + 70}
                    y1={100 + 100}
                    x2={400 + 70}
                    y2={300}
                    stroke="rgba(255, 255, 255, 0.3)"
                    strokeWidth="2"
                    markerEnd="url(#arrowhead)"
                  />

                  <line
                    x1={400}
                    y1={100 + 100}
                    x2={400 + 70}
                    y2={300}
                    stroke="rgba(255, 255, 255, 0.3)"
                    strokeWidth="2"
                    markerEnd="url(#arrowhead)"
                  />
                </svg>

                {workflowNodes.map((node) => (
                  <div
                    key={node.id}
                    className={`figma-node ${
                      selectedNode === node.id ? 'figma-node-selected' : ''
                    }`}
                    style={{
                      left: node.x,
                      top: node.y,
                      width: 240,
                      height: 100,
                    }}
                    onClick={() => setSelectedNode(node.id)}
                  >
                    <div className="p-4 h-full flex flex-col">
                      <div className="flex items-center gap-2 mb-2">
                        <div
                          className="w-3 h-3 rounded-full animate-pulse-glow"
                          style={{
                            backgroundColor: node.color,
                            opacity: node.status === 'active' ? 1 : 0.3,
                          }}
                        />
                        <span className="text-sm font-semibold text-gray-900">
                          {node.label}
                        </span>
                      </div>
                      <span className="text-xs text-gray-600">
                        {node.subtitle}
                      </span>

                      <div className="mt-auto pt-2 border-t border-gray-200 flex items-center justify-between">
                        <span className="text-[10px] text-gray-500 uppercase font-medium">
                          {node.status}
                        </span>
                        {node.status === 'active' && (
                          <div className="flex gap-1">
                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" />
                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                <div className="absolute bottom-8 left-8 bg-[#2C2C2C] rounded-lg p-4 max-w-sm border border-white/10">
                  <div className="text-xs font-semibold mb-2 text-[#18A0FB]">
                    ADK-TS Workflow Orchestration
                  </div>
                  <div className="text-[11px] text-white/60 space-y-1">
                    <div>Session ID: abc-123-def</div>
                    <div>Mode: Sequential</div>
                    <div>Duration: 00:32</div>
                  </div>
                </div>
              </div>
            </TransformComponent>
          </>
        )}
      </TransformWrapper>
    </div>
  )
}
