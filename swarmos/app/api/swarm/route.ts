import { NextResponse } from 'next/server'
import { startLoop } from '@/lib/swarm'

let isRunning = false

export async function POST(request: Request) {
  try {
    const { action } = await request.json()

    if (action === 'start') {
      if (isRunning) {
        return NextResponse.json({
          success: false,
          message: 'Swarm is already running',
        })
      }

      startLoop()
      isRunning = true

      return NextResponse.json({
        success: true,
        message: 'Swarm started successfully',
        status: 'running',
      })
    }

    if (action === 'status') {
      return NextResponse.json({
        success: true,
        status: isRunning ? 'running' : 'stopped',
      })
    }

    return NextResponse.json(
      { error: 'Invalid action. Use "start" or "status"' },
      { status: 400 }
    )
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to manage swarm' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    status: isRunning ? 'running' : 'stopped',
  })
}
