'use client'

import { useState } from 'react'

export default function Dashboard() {
  const [status, setStatus] = useState<string>('unknown')
  const [loading, setLoading] = useState(false)

  async function checkStatus() {
    setLoading(true)
    try {
      const res = await fetch('/api/swarm')
      const data = await res.json()
      setStatus(data.status)
    } catch (error) {
      console.error('Failed to check status:', error)
    }
    setLoading(false)
  }

  async function startSwarm() {
    setLoading(true)
    try {
      const res = await fetch('/api/swarm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'start' })
      })
      const data = await res.json()
      alert(data.message || 'Swarm started!')
      await checkStatus()
    } catch (error) {
      alert('Failed to start swarm')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-2">SwarmOS Dashboard</h1>
        <p className="text-slate-400 mb-8">AI-powered outreach automation</p>

        {/* Status Card */}
        <div className="bg-slate-800 rounded-lg p-6 mb-6 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white mb-2">Swarm Status</h2>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${
                  status === 'running' ? 'bg-green-500' :
                  status === 'stopped' ? 'bg-red-500' :
                  'bg-gray-500'
                }`} />
                <span className="text-lg text-slate-300 capitalize">{status}</span>
              </div>
            </div>
            <button
              onClick={checkStatus}
              disabled={loading}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg disabled:opacity-50"
            >
              {loading ? 'Checking...' : 'Refresh'}
            </button>
          </div>
        </div>

        {/* Control Card */}
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <h2 className="text-xl font-semibold text-white mb-4">Controls</h2>
          <button
            onClick={startSwarm}
            disabled={loading || status === 'running'}
            className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Starting...' : '🚀 Start Swarm'}
          </button>
          <p className="text-sm text-slate-400 mt-3">
            Swarm runs every 10 minutes, automatically generating and sending personalized outreach emails.
          </p>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <div className="text-3xl mb-2">⏱️</div>
            <div className="text-slate-400 text-sm">Interval</div>
            <div className="text-white font-semibold">10 minutes</div>
          </div>

          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <div className="text-3xl mb-2">🤖</div>
            <div className="text-slate-400 text-sm">AI Model</div>
            <div className="text-white font-semibold">GPT-4o-mini</div>
          </div>

          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <div className="text-3xl mb-2">📧</div>
            <div className="text-slate-400 text-sm">Email Service</div>
            <div className="text-white font-semibold">Resend</div>
          </div>
        </div>

        {/* API Endpoints */}
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 mt-6">
          <h2 className="text-xl font-semibold text-white mb-4">API Endpoints</h2>
          <div className="space-y-3">
            <div>
              <code className="text-sm text-green-400">POST /api/swarm</code>
              <p className="text-sm text-slate-400 mt-1">Start swarm or check status</p>
            </div>
            <div>
              <code className="text-sm text-green-400">POST /api/outreach</code>
              <p className="text-sm text-slate-400 mt-1">Send single outreach email</p>
            </div>
            <div>
              <code className="text-sm text-green-400">GET /api/health</code>
              <p className="text-sm text-slate-400 mt-1">Check system health</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
