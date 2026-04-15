"""
Backend API Tests for SwarmOS Lead Automation System
Tests: Health, Login, Stats, Leads, Outreach endpoints
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

class TestHealth:
    """Health endpoint tests"""
    
    def test_health_endpoint(self):
        """GET /api/health - returns health status"""
        response = requests.get(f"{BASE_URL}/api/health")
        assert response.status_code == 200
        data = response.json()
        assert "status" in data
        assert data["status"] == "healthy"
        assert "timestamp" in data
        print(f"Health check passed: {data}")


class TestLogin:
    """Login endpoint tests"""
    
    def test_login_existing_user(self):
        """POST /api/login - login with existing demo user"""
        response = requests.post(f"{BASE_URL}/api/login", json={"email": "demo@example.com"})
        assert response.status_code == 200
        data = response.json()
        assert "email" in data
        assert data["email"] == "demo@example.com"
        assert "id" in data
        assert "name" in data
        print(f"Login existing user passed: {data}")
    
    def test_login_new_user(self):
        """POST /api/login - login with new user creates account"""
        test_email = "TEST_newuser@example.com"
        response = requests.post(f"{BASE_URL}/api/login", json={"email": test_email})
        assert response.status_code == 200
        data = response.json()
        assert "email" in data
        assert data["email"] == test_email
        assert "id" in data
        print(f"Login new user passed: {data}")


class TestStats:
    """Stats endpoint tests"""
    
    def test_get_stats(self):
        """GET /api/stats - returns leads, contacted, sent, replies, booked counts"""
        response = requests.get(f"{BASE_URL}/api/stats")
        assert response.status_code == 200
        data = response.json()
        
        # Verify all required fields exist
        assert "leads" in data
        assert "contacted" in data
        assert "sent" in data
        assert "replies" in data
        assert "booked" in data
        
        # Verify data types
        assert isinstance(data["leads"], int)
        assert isinstance(data["contacted"], int)
        assert isinstance(data["sent"], int)
        assert isinstance(data["replies"], int)
        assert isinstance(data["booked"], int)
        
        print(f"Stats endpoint passed: {data}")


class TestLeads:
    """Leads CRUD endpoint tests"""
    
    def test_get_leads(self):
        """GET /api/leads - returns list of leads"""
        response = requests.get(f"{BASE_URL}/api/leads")
        assert response.status_code == 200
        data = response.json()
        assert "success" in data
        assert data["success"] == True
        assert "data" in data
        assert isinstance(data["data"], list)
        
        # Verify seeded leads exist
        assert len(data["data"]) >= 5
        print(f"Get leads passed: {len(data['data'])} leads found")
    
    def test_create_lead(self):
        """POST /api/leads - creates new lead with email, company, firstName"""
        lead_data = {
            "email": "TEST_lead@testcompany.com",
            "company": "Test Company",
            "firstName": "TestUser"
        }
        response = requests.post(f"{BASE_URL}/api/leads", json=lead_data)
        assert response.status_code == 200
        data = response.json()
        assert "success" in data
        assert data["success"] == True
        assert "data" in data
        
        created_lead = data["data"]
        assert created_lead["email"] == lead_data["email"]
        assert created_lead["company"] == lead_data["company"]
        assert created_lead["firstName"] == lead_data["firstName"]
        assert "id" in created_lead
        assert created_lead["status"] == "new"
        assert created_lead["contacted"] == False
        
        print(f"Create lead passed: {created_lead}")
        return created_lead["id"]
    
    def test_create_and_verify_lead_persistence(self):
        """POST /api/leads then GET to verify persistence"""
        # Create lead
        lead_data = {
            "email": "TEST_persist@testcompany.com",
            "company": "Persist Company",
            "firstName": "PersistUser"
        }
        create_response = requests.post(f"{BASE_URL}/api/leads", json=lead_data)
        assert create_response.status_code == 200
        created_lead = create_response.json()["data"]
        
        # Verify via GET
        get_response = requests.get(f"{BASE_URL}/api/leads")
        assert get_response.status_code == 200
        leads = get_response.json()["data"]
        
        # Find our created lead
        found = any(l["email"] == lead_data["email"] for l in leads)
        assert found, "Created lead not found in leads list"
        print("Lead persistence verified")


class TestOutreach:
    """Outreach endpoint tests"""
    
    def test_get_outreach(self):
        """GET /api/outreach - returns outreach list"""
        response = requests.get(f"{BASE_URL}/api/outreach")
        assert response.status_code == 200
        data = response.json()
        assert "success" in data
        assert data["success"] == True
        assert "data" in data
        assert isinstance(data["data"], list)
        print(f"Get outreach passed: {len(data['data'])} outreach records")
    
    def test_send_outreach_to_lead(self):
        """POST /api/outreach/send - sends outreach to a lead by leadId"""
        # First get a lead to send outreach to
        leads_response = requests.get(f"{BASE_URL}/api/leads")
        leads = leads_response.json()["data"]
        
        # Find a lead that hasn't been contacted
        target_lead = None
        for lead in leads:
            if not lead.get("contacted", True):
                target_lead = lead
                break
        
        if not target_lead:
            # Create a new lead for testing
            lead_data = {
                "email": "TEST_outreach@testcompany.com",
                "company": "Outreach Test Company",
                "firstName": "OutreachTest"
            }
            create_response = requests.post(f"{BASE_URL}/api/leads", json=lead_data)
            target_lead = create_response.json()["data"]
        
        # Send outreach
        response = requests.post(f"{BASE_URL}/api/outreach/send", json={"leadId": target_lead["id"]})
        assert response.status_code == 200
        data = response.json()
        assert "success" in data
        assert data["success"] == True
        assert "data" in data
        
        outreach = data["data"]
        assert outreach["leadId"] == target_lead["id"]
        assert outreach["sent"] == True
        assert "content" in outreach
        print(f"Send outreach passed: {outreach}")
    
    def test_send_outreach_invalid_lead(self):
        """POST /api/outreach/send - returns error for invalid leadId"""
        response = requests.post(f"{BASE_URL}/api/outreach/send", json={"leadId": "invalid_id_12345"})
        assert response.status_code == 200  # API returns 200 with success=False
        data = response.json()
        assert data["success"] == False
        assert "error" in data
        print(f"Invalid lead outreach handled correctly: {data}")


class TestDashboard:
    """Dashboard endpoint tests"""
    
    def test_get_dashboard(self):
        """GET /api/dashboard - returns dashboard data"""
        response = requests.get(f"{BASE_URL}/api/dashboard")
        assert response.status_code == 200
        data = response.json()
        assert "success" in data
        assert data["success"] == True
        assert "data" in data
        
        dashboard = data["data"]
        assert "leads" in dashboard
        assert "outreach" in dashboard
        print(f"Dashboard endpoint passed: {dashboard}")


class TestMeetings:
    """Meetings endpoint tests"""
    
    def test_get_meetings(self):
        """GET /api/meetings - returns meetings list"""
        response = requests.get(f"{BASE_URL}/api/meetings")
        assert response.status_code == 200
        data = response.json()
        assert "success" in data
        assert data["success"] == True
        assert "data" in data
        assert isinstance(data["data"], list)
        print(f"Get meetings passed: {len(data['data'])} meetings")
    
    def test_create_meeting(self):
        """POST /api/meetings - creates a meeting"""
        # Get a lead first
        leads_response = requests.get(f"{BASE_URL}/api/leads")
        leads = leads_response.json()["data"]
        lead_id = leads[0]["id"]
        
        meeting_data = {"leadId": lead_id}
        response = requests.post(f"{BASE_URL}/api/meetings", json=meeting_data)
        assert response.status_code == 200
        data = response.json()
        assert "success" in data
        assert data["success"] == True
        assert "data" in data
        
        meeting = data["data"]
        assert meeting["leadId"] == lead_id
        assert "id" in meeting
        assert meeting["status"] == "scheduled"
        print(f"Create meeting passed: {meeting}")


class TestAutomation:
    """Automation endpoint tests"""
    
    def test_automation_status(self):
        """GET /api/automation/status - returns automation status"""
        response = requests.get(f"{BASE_URL}/api/automation/status")
        assert response.status_code == 200
        data = response.json()
        assert "success" in data
        assert data["success"] == True
        assert "data" in data
        assert "running" in data["data"]
        print(f"Automation status passed: {data}")
    
    def test_start_stop_automation(self):
        """POST /api/automation/start and /api/automation/stop"""
        # Start automation
        start_response = requests.post(f"{BASE_URL}/api/automation/start")
        assert start_response.status_code == 200
        start_data = start_response.json()
        assert start_data["success"] == True
        assert start_data["status"]["running"] == True
        print("Automation started")
        
        # Stop automation
        stop_response = requests.post(f"{BASE_URL}/api/automation/stop")
        assert stop_response.status_code == 200
        stop_data = stop_response.json()
        assert stop_data["success"] == True
        assert stop_data["status"]["running"] == False
        print("Automation stopped")


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
