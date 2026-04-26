from fastapi import FastAPI, APIRouter, Request
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel
from typing import Optional
from datetime import datetime, timezone
from emergentintegrations.payments.stripe.checkout import StripeCheckout, CheckoutSessionRequest
from emergentintegrations.llm.chat import LlmChat, UserMessage
import resend
import asyncio

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")

# ---------- Models ----------
class LoginRequest(BaseModel):
    email: str

class UserOut(BaseModel):
    email: str
    orgId: str
    plan: str

class LeadCreate(BaseModel):
    email: str
    company: str
    firstName: str

class LeadUpdate(BaseModel):
    status: Optional[str] = None
    contacted: Optional[bool] = None

class OutreachSendRequest(BaseModel):
    leadId: str

class InboxProcessRequest(BaseModel):
    emailId: str
    fromEmail: str
    content: str

class MeetingCreate(BaseModel):
    leadId: str
    scheduledAt: Optional[str] = None

# Plan pricing (server-side only)
PLANS = {
    "starter": {"name": "Starter", "amount": 99.00, "currency": "usd"},
    "growth": {"name": "Growth", "amount": 297.00, "currency": "usd"},
    "lifetime": {"name": "Lifetime", "amount": 497.00, "currency": "usd"},
}

class SubscribeRequest(BaseModel):
    email: str
    plan: str = "starter"
    origin_url: str
    ref: Optional[str] = None

class OnboardingData(BaseModel):
    email: str
    target: Optional[str] = None
    offer: Optional[str] = None
    volume: Optional[str] = None

class GenerateEmailRequest(BaseModel):
    leadId: Optional[str] = None
    target: Optional[str] = None
    offer: Optional[str] = None

# ---------- Seed data ----------
async def seed_database():
    users_count = await db.users.count_documents({})
    if users_count == 0:
        await db.users.insert_one({
            "email": "demo@test.com",
            "orgId": "org_1",
            "plan": "free"
        })
        logging.info("Seeded demo user")

    leads_count = await db.leads.count_documents({})
    if leads_count == 0:
        leads = [
            {"id": "1", "email": "john@acme.com", "company": "Acme Corp", "firstName": "John", "status": "new", "contacted": False, "createdAt": datetime.now(timezone.utc).isoformat()},
            {"id": "2", "email": "jane@techco.com", "company": "TechCo", "firstName": "Jane", "status": "contacted", "contacted": True, "contactedAt": datetime.now(timezone.utc).isoformat(), "createdAt": datetime.now(timezone.utc).isoformat()},
            {"id": "3", "email": "bob@startup.io", "company": "Startup Inc", "firstName": "Bob", "status": "interested", "contacted": True, "contactedAt": datetime.now(timezone.utc).isoformat(), "createdAt": datetime.now(timezone.utc).isoformat()},
            {"id": "4", "email": "lisa@bigcorp.com", "company": "BigCorp", "firstName": "Lisa", "status": "new", "contacted": False, "createdAt": datetime.now(timezone.utc).isoformat()},
            {"id": "5", "email": "mark@saas.io", "company": "SaaS Pro", "firstName": "Mark", "status": "new", "contacted": False, "createdAt": datetime.now(timezone.utc).isoformat()},
        ]
        await db.leads.insert_many(leads)
        logging.info("Seeded leads")

    campaigns_count = await db.campaigns.count_documents({})
    if campaigns_count == 0:
        await db.campaigns.insert_one({
            "id": "1", "name": "Q1 Outreach", "status": "active",
            "sent": 45, "replies": 12, "meetings": 3,
            "createdAt": datetime.now(timezone.utc).isoformat()
        })
        logging.info("Seeded campaigns")

# ---------- Auth ----------
@api_router.post("/login")
async def login(req: LoginRequest):
    user = await db.users.find_one({"email": req.email}, {"_id": 0})
    if not user:
        user = {
            "email": req.email,
            "orgId": "org_" + str(int(datetime.now(timezone.utc).timestamp())),
            "plan": "free"
        }
        await db.users.insert_one(user)
        user.pop("_id", None)
    return {"email": user["email"], "orgId": user["orgId"], "plan": user["plan"]}

# ---------- Stats ----------
@api_router.get("/stats")
async def get_stats():
    total_leads = await db.leads.count_documents({})
    contacted = await db.leads.count_documents({"contacted": True})
    total_outreach = await db.outreach.count_documents({})
    replied = await db.outreach.count_documents({"replied": True})
    meetings = await db.meetings.count_documents({})

    return {
        "leads": total_leads,
        "contacted": contacted,
        "sent": total_outreach,
        "replies": replied,
        "booked": meetings,
        "conversionRate": round((meetings / contacted * 100), 1) if contacted > 0 else 0,
        "replyRate": round((replied / total_outreach * 100), 1) if total_outreach > 0 else 0
    }

# ---------- Dashboard ----------
@api_router.get("/dashboard")
async def get_dashboard():
    total_leads = await db.leads.count_documents({})
    contacted = await db.leads.count_documents({"contacted": True})
    replied_count = await db.outreach.count_documents({"replied": True})
    meetings_count = await db.meetings.count_documents({})
    recent = await db.outreach.find({}, {"_id": 0}).sort("sentAt", -1).limit(10).to_list(10)

    return {
        "success": True,
        "data": {
            "leads": {
                "total": total_leads,
                "contacted": contacted,
                "replied": replied_count,
                "meetings": meetings_count
            },
            "outreach": {
                "total": await db.outreach.count_documents({}),
                "replied": replied_count,
                "replyRate": 0
            },
            "insights": None,
            "recentActivity": recent
        }
    }

# ---------- Leads ----------
@api_router.get("/leads")
async def get_leads():
    leads = await db.leads.find({}, {"_id": 0}).to_list(1000)
    return {"success": True, "data": leads}

@api_router.post("/leads")
async def add_lead(req: LeadCreate):
    lead = {
        "id": str(int(datetime.now(timezone.utc).timestamp())),
        "email": req.email,
        "company": req.company,
        "firstName": req.firstName,
        "status": "new",
        "contacted": False,
        "createdAt": datetime.now(timezone.utc).isoformat()
    }
    await db.leads.insert_one(lead)
    lead.pop("_id", None)
    return {"success": True, "data": lead}

@api_router.patch("/leads/{lead_id}")
async def update_lead(lead_id: str, req: LeadUpdate):
    update_data = {k: v for k, v in req.model_dump().items() if v is not None}
    if update_data:
        await db.leads.update_one({"id": lead_id}, {"$set": update_data})
    lead = await db.leads.find_one({"id": lead_id}, {"_id": 0})
    return {"success": True, "data": lead}

# ---------- Outreach ----------
@api_router.get("/outreach")
async def get_outreach():
    outreach = await db.outreach.find({}, {"_id": 0}).to_list(1000)
    return {"success": True, "data": outreach}

@api_router.post("/outreach/send")
async def send_outreach(req: OutreachSendRequest):
    lead = await db.leads.find_one({"id": req.leadId}, {"_id": 0})
    if not lead:
        return {"success": False, "error": "Lead not found"}

    # Generate AI email
    try:
        llm_key = os.environ.get("EMERGENT_LLM_KEY")
        chat = LlmChat(
            api_key=llm_key,
            session_id=f"outreach-{req.leadId}-{datetime.now(timezone.utc).timestamp()}",
            system_message="You are an expert cold email copywriter. Write short, personalized cold emails. Max 4 sentences. Just the email body, no subject line."
        )
        chat.with_model("openai", "gpt-4o")
        msg = UserMessage(text=f"Write a cold email to {lead.get('firstName', 'there')} at {lead.get('company', 'their company')}. We help companies book more meetings automatically using AI.")
        email_content = await chat.send_message(msg)
    except Exception:
        email_content = f"Hi {lead.get('firstName', '')},\n\nI noticed {lead.get('company', 'your company')} is doing great work. I'd love to connect and share how we can help you book more meetings using AI.\n\nBest regards"

    outreach_doc = {
        "id": str(int(datetime.now(timezone.utc).timestamp())),
        "leadId": lead["id"],
        "email": lead["email"],
        "company": lead["company"],
        "content": email_content,
        "sent": True,
        "replied": False,
        "sentAt": datetime.now(timezone.utc).isoformat()
    }
    await db.outreach.insert_one(outreach_doc)
    outreach_doc.pop("_id", None)

    await db.leads.update_one(
        {"id": lead["id"]},
        {"$set": {"contacted": True, "status": "contacted", "contactedAt": datetime.now(timezone.utc).isoformat()}}
    )

    # Send real email via Resend if key is configured
    email_sent = False
    resend_key = os.environ.get("RESEND_API_KEY")
    if resend_key and resend_key != "re_your_api_key_here":
        try:
            resend.api_key = resend_key
            sender = os.environ.get("SENDER_EMAIL", "onboarding@resend.dev")
            params = {
                "from": sender,
                "to": [lead["email"]],
                "subject": "Quick question",
                "html": f"<p>{email_content.replace(chr(10), '<br>')}</p>"
            }
            await asyncio.to_thread(resend.Emails.send, params)
            email_sent = True
            logging.info(f"Email sent to {lead['email']} via Resend")
        except Exception as e:
            logging.error(f"Resend error: {e}")

    return {"success": True, "data": outreach_doc, "email_sent": email_sent}

# ---------- Inbox ----------
@api_router.get("/inbox/replies")
async def get_replies():
    replies = await db.outreach.find({"replied": True}, {"_id": 0}).to_list(1000)
    return {"success": True, "data": replies}

@api_router.post("/inbox/process")
async def process_inbox(req: InboxProcessRequest):
    outreach = await db.outreach.find_one({"email": req.fromEmail}, {"_id": 0})
    if not outreach:
        return {"success": False, "error": "No matching outreach found"}

    sentiment = "interested"

    await db.outreach.update_one(
        {"email": req.fromEmail},
        {"$set": {
            "replied": True,
            "repliedAt": datetime.now(timezone.utc).isoformat(),
            "replyContent": req.content,
            "sentiment": sentiment
        }}
    )

    if outreach.get("leadId"):
        await db.leads.update_one(
            {"id": outreach["leadId"]},
            {"$set": {"status": sentiment}}
        )

    return {"success": True, "data": {"sentiment": sentiment}}

# ---------- Meetings ----------
@api_router.get("/meetings")
async def get_meetings():
    meetings = await db.meetings.find({}, {"_id": 0}).to_list(1000)
    return {"success": True, "data": meetings}

@api_router.post("/meetings")
async def create_meeting(req: MeetingCreate):
    meeting = {
        "id": str(int(datetime.now(timezone.utc).timestamp())),
        "leadId": req.leadId,
        "scheduledAt": req.scheduledAt or datetime.now(timezone.utc).isoformat(),
        "status": "scheduled",
        "createdAt": datetime.now(timezone.utc).isoformat()
    }
    await db.meetings.insert_one(meeting)
    meeting.pop("_id", None)
    return {"success": True, "data": meeting}

# ---------- Automation ----------
automation_running = False

@api_router.post("/automation/start")
async def start_automation():
    global automation_running
    automation_running = True
    return {"success": True, "message": "Automation started", "status": {"running": True}}

@api_router.post("/automation/stop")
async def stop_automation():
    global automation_running
    automation_running = False
    return {"success": True, "message": "Automation stopped", "status": {"running": False}}

@api_router.get("/automation/status")
async def automation_status():
    return {"success": True, "data": {"running": automation_running}}

# ---------- Optimizer ----------
@api_router.post("/optimize")
async def optimize():
    total_leads = await db.leads.count_documents({})
    contacted = await db.leads.count_documents({"contacted": True})
    total_outreach = await db.outreach.count_documents({})
    replied = await db.outreach.count_documents({"replied": True})
    meetings = await db.meetings.count_documents({})

    metrics = {
        "total": total_leads,
        "contacted": contacted,
        "replied": replied,
        "meetings": meetings,
        "replyRate": round((replied / total_outreach * 100), 1) if total_outreach > 0 else 0
    }

    suggestions = "1. Personalize subject lines more\n2. Follow up within 48 hours\n3. Include social proof"

    insight = {
        "id": str(int(datetime.now(timezone.utc).timestamp())),
        "metrics": metrics,
        "suggestions": suggestions,
        "createdAt": datetime.now(timezone.utc).isoformat()
    }
    await db.insights.insert_one(insight)
    insight.pop("_id", None)

    return {"success": True, "data": insight}

@api_router.get("/insights")
async def get_insights():
    insight = await db.insights.find_one({}, {"_id": 0}, sort=[("createdAt", -1)])
    return {"success": True, "data": insight}

# ---------- Onboarding ----------
@api_router.post("/onboarding")
async def save_onboarding(req: OnboardingData):
    data = req.model_dump()
    data["createdAt"] = datetime.now(timezone.utc).isoformat()
    await db.onboarding.update_one(
        {"email": req.email},
        {"$set": data},
        upsert=True
    )
    return {"success": True}

@api_router.get("/onboarding/{email}")
async def get_onboarding(email: str):
    data = await db.onboarding.find_one({"email": email}, {"_id": 0})
    return {"success": True, "data": data}

# ---------- AI Email Generation ----------
@api_router.post("/generate-email")
async def generate_email(req: GenerateEmailRequest):
    llm_key = os.environ.get("EMERGENT_LLM_KEY")
    chat = LlmChat(
        api_key=llm_key,
        session_id=f"email-gen-{datetime.now(timezone.utc).timestamp()}",
        system_message="You are an expert cold email copywriter for B2B SaaS sales. Write short, personalized, high-converting cold emails. No fluff. Max 4 sentences. No subject line. Just the email body."
    )
    chat.with_model("openai", "gpt-4o")

    if req.leadId:
        lead = await db.leads.find_one({"id": req.leadId}, {"_id": 0})
        if not lead:
            return {"success": False, "error": "Lead not found"}
        prompt = f"Write a cold email to {lead.get('firstName', 'there')} at {lead.get('company', 'their company')}. We help companies book more meetings automatically using AI. Keep it casual and direct."
    else:
        target = req.target or "decision makers"
        offer = req.offer or "AI-powered meeting booking"
        prompt = f"Write a cold email targeting {target}. Our offer: {offer}. Make it feel personal like you researched them. Use a placeholder name like [First Name] and company like [Company]. Keep it casual and direct."

    msg = UserMessage(text=prompt)
    response = await chat.send_message(msg)

    return {"success": True, "content": response}

# ---------- AI Sentiment Classification ----------
@api_router.post("/classify-reply")
async def classify_reply(req: InboxProcessRequest):
    llm_key = os.environ.get("EMERGENT_LLM_KEY")
    chat = LlmChat(
        api_key=llm_key,
        session_id=f"classify-{req.emailId}",
        system_message="You classify email replies into exactly one category. Reply with ONLY one word: interested, not_interested, or needs_followup"
    )
    chat.with_model("openai", "gpt-4o")

    msg = UserMessage(text=f"Classify this reply:\n\n{req.content}")
    sentiment = await chat.send_message(msg)
    sentiment = sentiment.strip().lower().replace(" ", "_")

    if sentiment not in ["interested", "not_interested", "needs_followup"]:
        sentiment = "needs_followup"

    outreach = await db.outreach.find_one({"email": req.fromEmail}, {"_id": 0})
    if outreach:
        await db.outreach.update_one(
            {"email": req.fromEmail},
            {"$set": {"replied": True, "repliedAt": datetime.now(timezone.utc).isoformat(), "replyContent": req.content, "sentiment": sentiment}}
        )
        if outreach.get("leadId"):
            await db.leads.update_one({"id": outreach["leadId"]}, {"$set": {"status": sentiment}})

    return {"success": True, "sentiment": sentiment}

# ---------- Stripe Checkout ----------
@api_router.post("/subscribe")
async def subscribe(req: SubscribeRequest, http_request: Request):
    plan = PLANS.get(req.plan, PLANS["starter"])
    stripe_api_key = os.environ.get("STRIPE_API_KEY")
    host_url = str(http_request.base_url).rstrip("/")
    webhook_url = f"{host_url}/api/webhook/stripe"
    stripe_checkout = StripeCheckout(api_key=stripe_api_key, webhook_url=webhook_url)

    success_url = f"{req.origin_url}/success?session_id={{CHECKOUT_SESSION_ID}}"
    cancel_url = req.origin_url

    checkout_req = CheckoutSessionRequest(
        amount=plan["amount"],
        currency=plan["currency"],
        success_url=success_url,
        cancel_url=cancel_url,
        metadata={"email": req.email, "plan": req.plan, "plan_name": plan["name"], "ref": req.ref or "direct"}
    )
    session = await stripe_checkout.create_checkout_session(checkout_req)

    txn = {
        "session_id": session.session_id,
        "email": req.email,
        "plan": req.plan,
        "amount": plan["amount"],
        "currency": "usd",
        "ref": req.ref or "direct",
        "payment_status": "pending",
        "createdAt": datetime.now(timezone.utc).isoformat()
    }
    await db.payment_transactions.insert_one(txn)

    return {"url": session.url}

@api_router.get("/checkout/status/{session_id}")
async def checkout_status(session_id: str, http_request: Request):
    stripe_api_key = os.environ.get("STRIPE_API_KEY")
    host_url = str(http_request.base_url).rstrip("/")
    webhook_url = f"{host_url}/api/webhook/stripe"
    stripe_checkout = StripeCheckout(api_key=stripe_api_key, webhook_url=webhook_url)

    status = await stripe_checkout.get_checkout_status(session_id)

    txn = await db.payment_transactions.find_one({"session_id": session_id})
    if txn and txn.get("payment_status") != "paid":
        await db.payment_transactions.update_one(
            {"session_id": session_id},
            {"$set": {"payment_status": status.payment_status, "status": status.status}}
        )

    return {
        "status": status.status,
        "payment_status": status.payment_status,
        "amount_total": status.amount_total,
        "currency": status.currency
    }

@api_router.post("/webhook/stripe")
async def stripe_webhook(request: Request):
    body = await request.body()
    sig = request.headers.get("Stripe-Signature", "")
    stripe_api_key = os.environ.get("STRIPE_API_KEY")
    host_url = str(request.base_url).rstrip("/")
    webhook_url = f"{host_url}/api/webhook/stripe"
    stripe_checkout = StripeCheckout(api_key=stripe_api_key, webhook_url=webhook_url)

    try:
        event = await stripe_checkout.handle_webhook(body, sig)
        if event.payment_status == "paid":
            await db.payment_transactions.update_one(
                {"session_id": event.session_id},
                {"$set": {"payment_status": "paid", "status": "complete"}}
            )
        return {"received": True}
    except Exception as e:
        logging.error(f"Webhook error: {e}")
        return {"received": True}

# ---------- Health ----------
@api_router.get("/health")
async def health():
    return {"status": "healthy", "timestamp": datetime.now(timezone.utc).isoformat(), "automation": automation_running}

# ---------- App setup ----------
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("startup")
async def startup():
    await seed_database()
    logger.info("SwarmOS API started")

@app.on_event("shutdown")
async def shutdown():
    client.close()
