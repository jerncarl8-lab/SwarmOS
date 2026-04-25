"""
Backend API Tests for SwarmOS Lead Automation System
Tests: Health, Login, Stats, Leads, Outreach, Onboarding, AI Email, Stripe endpoints
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
    """Login endpoint tests - returns email, orgId, plan"""
    
    def test_login_existing_user(self):
        """POST /api/login - login with existing demo user"""
        response = requests.post(f"{BASE_URL}/api/login", json={"email": "demo@test.com"})
        assert response.status_code == 200
        data = response.json()
        assert "email" in data
        assert data["email"] == "demo@test.com"
        assert "orgId" in data
        assert "plan" in data
        print(f"Login existing user passed: {data}")
    
    def test_login_new_user(self):
        """POST /api/login - login with new user creates account"""
        test_email = "TEST_newuser@example.com"
        response = requests.post(f"{BASE_URL}/api/login", json={"email": test_email})
        assert response.status_code == 200
        data = response.json()
        assert "email" in data
        assert data["email"] == test_email
        assert "orgId" in data
        assert "plan" in data
        assert data["plan"] == "free"  # New users get free plan
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
        assert "conversionRate" in data
        assert "replyRate" in data
        
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


class TestOnboarding:
    """Onboarding endpoint tests - NEW"""
    
    def test_save_onboarding(self):
        """POST /api/onboarding - saves onboarding data"""
        onboarding_data = {
            "email": "TEST_onboard@example.com",
            "target": "SaaS founders",
            "offer": "AI meeting booking",
            "volume": "200"
        }
        response = requests.post(f"{BASE_URL}/api/onboarding", json=onboarding_data)
        assert response.status_code == 200
        data = response.json()
        assert "success" in data
        assert data["success"] == True
        print(f"Save onboarding passed: {data}")
    
    def test_get_onboarding(self):
        """GET /api/onboarding/{email} - retrieves onboarding data"""
        # First save onboarding data
        test_email = "TEST_onboard_get@example.com"
        onboarding_data = {
            "email": test_email,
            "target": "CTOs at startups",
            "offer": "Automated outreach",
            "volume": "150"
        }
        requests.post(f"{BASE_URL}/api/onboarding", json=onboarding_data)
        
        # Then retrieve it
        response = requests.get(f"{BASE_URL}/api/onboarding/{test_email}")
        assert response.status_code == 200
        data = response.json()
        assert "success" in data
        assert data["success"] == True
        assert "data" in data
        
        retrieved = data["data"]
        assert retrieved["email"] == test_email
        assert retrieved["target"] == onboarding_data["target"]
        assert retrieved["offer"] == onboarding_data["offer"]
        assert retrieved["volume"] == onboarding_data["volume"]
        print(f"Get onboarding passed: {retrieved}")


class TestGenerateEmail:
    """AI Email Generation endpoint tests - OpenAI GPT-4o integration"""
    
    def test_generate_email_for_lead(self):
        """POST /api/generate-email - generates AI email for a lead by leadId"""
        # Get a lead first
        leads_response = requests.get(f"{BASE_URL}/api/leads")
        leads = leads_response.json()["data"]
        lead_id = leads[0]["id"]
        
        response = requests.post(f"{BASE_URL}/api/generate-email", json={"leadId": lead_id})
        assert response.status_code == 200
        data = response.json()
        assert "success" in data
        assert data["success"] == True
        assert "content" in data
        
        # Verify content is a non-empty string (AI generated)
        assert isinstance(data["content"], str)
        assert len(data["content"]) > 50  # Should be a reasonable email
        print(f"Generate email for lead passed: {data['content'][:100]}...")
    
    def test_generate_email_with_target_offer(self):
        """POST /api/generate-email - generates AI email with target/offer (for onboarding preview)"""
        response = requests.post(f"{BASE_URL}/api/generate-email", json={
            "target": "SaaS founders and CTOs",
            "offer": "AI-powered meeting booking that saves 10 hours per week"
        })
        assert response.status_code == 200
        data = response.json()
        assert "success" in data
        assert data["success"] == True
        assert "content" in data
        
        # Verify content is a non-empty string (AI generated)
        assert isinstance(data["content"], str)
        assert len(data["content"]) > 50  # Should be a reasonable email
        print(f"Generate email with target/offer passed: {data['content'][:100]}...")
    
    def test_generate_email_invalid_lead(self):
        """POST /api/generate-email - returns error for invalid leadId"""
        response = requests.post(f"{BASE_URL}/api/generate-email", json={"leadId": "invalid_lead_999"})
        assert response.status_code == 200
        data = response.json()
        assert data["success"] == False
        assert "error" in data
        print(f"Invalid lead email generation handled correctly: {data}")


class TestClassifyReply:
    """AI Reply Classification endpoint tests - OpenAI GPT-4o integration"""
    
    def test_classify_reply_interested(self):
        """POST /api/classify-reply - classifies interested reply"""
        response = requests.post(f"{BASE_URL}/api/classify-reply", json={
            "emailId": "test_email_1",
            "fromEmail": "test@example.com",
            "content": "Yes, I'd love to learn more! Can we schedule a call this week?"
        })
        assert response.status_code == 200
        data = response.json()
        assert "success" in data
        assert data["success"] == True
        assert "sentiment" in data
        assert data["sentiment"] in ["interested", "not_interested", "needs_followup"]
        print(f"Classify reply passed: sentiment={data['sentiment']}")


class TestStripeSubscribe:
    """Stripe Checkout endpoint tests"""
    
    def test_create_checkout_session(self):
        """POST /api/subscribe - creates Stripe checkout session"""
        subscribe_data = {
            "email": "TEST_stripe@example.com",
            "origin_url": "https://lead-automation-27.preview.emergentagent.com"
        }
        response = requests.post(f"{BASE_URL}/api/subscribe", json=subscribe_data)
        assert response.status_code == 200
        data = response.json()
        assert "url" in data
        
        # Verify it's a valid Stripe checkout URL
        assert "checkout.stripe.com" in data["url"]
        print(f"Stripe checkout session created: {data['url'][:80]}...")


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
