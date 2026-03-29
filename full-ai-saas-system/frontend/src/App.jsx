import { useState, useEffect } from 'react'
import axios from 'axios'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import KPIWidget from './components/KPIWidget'
import AnalyticsChart from './components/AnalyticsChart'

const API_URL = 'http://localhost:3001/api'

function App() {
  const [currentView, setCurrentView] = useState('dashboard')
  const [automationStatus, setAutomationStatus] = useState(false)
  const [dashboardData, setDashboardData] = useState(null)
  const [leads, setLeads] = useState([])
  const [outreach, setOutreach] = useState([])

  useEffect(() => {
    fetchDashboardData()
    fetchLeads()
    fetchOutreach()
    checkAutomationStatus()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const res = await axios.get(`${API_URL}/dashboard`)
      setDashboardData(res.data.data)
    } catch (error) {
      console.error('Error fetching dashboard:', error)
    }
  }

  const fetchLeads = async () => {
    try {
      const res = await axios.get(`${API_URL}/leads`)
      setLeads(res.data.data)
    } catch (error) {
      console.error('Error fetching leads:', error)
    }
  }

  const fetchOutreach = async () => {
    try {
      const res = await axios.get(`${API_URL}/outreach`)
      setOutreach(res.data.data)
    } catch (error) {
      console.error('Error fetching outreach:', error)
    }
  }

  const checkAutomationStatus = async () => {
    try {
      const res = await axios.get(`${API_URL}/automation/status`)
      setAutomationStatus(res.data.data.running)
    } catch (error) {
      console.error('Error checking automation:', error)
    }
  }

  const toggleAutomation = async () => {
    try {
      const endpoint = automationStatus ? 'stop' : 'start'
      await axios.post(`${API_URL}/automation/${endpoint}`)
      setAutomationStatus(!automationStatus)
    } catch (error) {
      console.error('Error toggling automation:', error)
    }
  }

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPIWidget
          title="Total Leads"
          value={dashboardData?.leads?.total || 0}
          change={12}
          icon="👥"
        />
        <KPIWidget
          title="Contacted"
          value={dashboardData?.leads?.contacted || 0}
          change={8}
          icon="📧"
        />
        <KPIWidget
          title="Replies"
          value={dashboardData?.leads?.replied || 0}
          change={15}
          icon="💬"
        />
        <KPIWidget
          title="Meetings"
          value={dashboardData?.leads?.meetings || 0}
          change={20}
          icon="📅"
        />
      </div>

      <AnalyticsChart />

      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
        </div>
        <div className="p-6">
          {dashboardData?.recentActivity?.length > 0 ? (
            <div className="space-y-3">
              {dashboardData.recentActivity.slice(0, 5).map((activity) => (
                <div key={activity.id} className="flex items-center justify-between py-2 border-b">
                  <div>
                    <p className="font-medium">{activity.company}</p>
                    <p className="text-sm text-gray-600">{activity.email}</p>
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(activity.sentAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No recent activity</p>
          )}
        </div>
      </div>
    </div>
  )

  const renderLeads = () => (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Leads</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Company</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contacted</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {leads.map((lead) => (
              <tr key={lead.id}>
                <td className="px-6 py-4 whitespace-nowrap">{lead.company}</td>
                <td className="px-6 py-4 whitespace-nowrap">{lead.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    lead.status === 'interested' ? 'bg-green-100 text-green-800' :
                    lead.status === 'contacted' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {lead.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {lead.contacted ? '✅' : '❌'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )

  const renderOutreach = () => (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Outreach History</h3>
      </div>
      <div className="p-6 space-y-4">
        {outreach.map((item) => (
          <div key={item.id} className="border rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="font-medium">{item.company}</p>
                <p className="text-sm text-gray-600">{item.email}</p>
              </div>
              <div className="text-sm text-gray-500">
                {new Date(item.sentAt).toLocaleString()}
              </div>
            </div>
            <p className="text-sm text-gray-700 mt-2">{item.content?.substring(0, 200)}...</p>
            {item.replied && (
              <div className="mt-2 text-sm text-green-600">
                ✅ Replied ({item.sentiment})
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
      
      <div className="flex-1">
        <Header 
          automationStatus={automationStatus}
          onToggleAutomation={toggleAutomation}
        />
        
        <main className="p-6">
          {currentView === 'dashboard' && renderDashboard()}
          {currentView === 'leads' && renderLeads()}
          {currentView === 'outreach' && renderOutreach()}
          {currentView === 'meetings' && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold">Meetings (Coming Soon)</h3>
            </div>
          )}
          {currentView === 'automation' && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Automation Settings</h3>
              <p className="text-gray-600">Configure your automation rules and schedules here.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default App
