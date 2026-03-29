export default function Header({ automationStatus, onToggleAutomation }) {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
          <p className="text-sm text-gray-600">AI-powered sales automation</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${automationStatus ? 'bg-green-500' : 'bg-gray-400'}`} />
            <span className="text-sm text-gray-600">
              {automationStatus ? 'Running' : 'Stopped'}
            </span>
          </div>

          <button
            onClick={onToggleAutomation}
            className={`px-4 py-2 rounded-lg font-semibold ${
              automationStatus
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            {automationStatus ? 'Stop Automation' : 'Start Automation'}
          </button>
        </div>
      </div>
    </div>
  )
}
