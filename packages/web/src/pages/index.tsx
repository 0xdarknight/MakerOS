import { useState, useEffect } from 'react'
import Head from 'next/head'
import FigmaTitleBar from '@/components/FigmaTitleBar'
import FigmaToolbar from '@/components/FigmaToolbar'
import FigmaLeftPanel from '@/components/FigmaLeftPanel'
import FigmaCanvas from '@/components/FigmaCanvas'
import FigmaRightPanel from '@/components/FigmaRightPanel'
import { WorkflowProvider } from '@/lib/workflow-context'

export default function Home() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <>
      <Head>
        <title>Maker OS - ADK-TS Powered Automation</title>
        <meta name="description" content="Design-to-deployment automation powered by ADK-TS multi-agent orchestration" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </Head>

      <WorkflowProvider>
        <div className="figma-window">
          <FigmaTitleBar />
          <FigmaToolbar />

          <div className="flex-1 flex overflow-hidden">
            <FigmaLeftPanel />
            <FigmaCanvas />
            <FigmaRightPanel />
          </div>
        </div>
      </WorkflowProvider>
    </>
  )
}
