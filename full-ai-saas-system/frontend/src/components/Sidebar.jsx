export default function Sidebar({ currentView, setCurrentView }) {
  const navItems = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊' },
    { id: 'leads', name: 'Leads', icon: '👥' },
    { id: 'outreach', name: 'Outreach', icon: '📧' },
    { id: 'meetings', name: 'Meetings', icon: '📅' },
    { id: 'automation', name: 'Automation', icon: '🤖' },
  ]

  return (
    <div className="w-64 bg-gray-900 text-white min-h-screen p-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">AI SDR Platform</h1>
        <p className="text-sm text-gray-400">Automated Outreach</p>
      </div>

      <nav className="space-y-2">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => setCurrentView(item.id)}
            className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${
              currentView === item.id
                ? 'bg-blue-600 text-white'
                : 'text-gray-300 hover:bg-gray-800'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span>{item.name}</span>
          </button>
        ))}
      </nav>
    </div>
  )
}
