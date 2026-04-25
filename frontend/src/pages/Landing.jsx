import { useState, useEffect } from "react";
import { ArrowRight, Check, Shield, Clock, Users, Zap, Star, Play, ChevronDown, ChevronUp } from "lucide-react";

export default function Landing() {
  const [openFaq, setOpenFaq] = useState(null);
  const [spots, setSpots] = useState(14);
  const params = new URLSearchParams(window.location.search);
  const ref = params.get("ref") || params.get("hop") || "";

  useEffect(() => {
    const t = setInterval(() => {
      setSpots((s) => (s > 3 ? s - 1 : 14));
    }, 45000);
    return () => clearInterval(t);
  }, []);

  const ctaLink = ref ? `/app?ref=${ref}` : "/app";

  return (
    <div className="min-h-screen bg-white">
      {/* Sticky nav */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-xl border-b border-gray-200 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <h1 className="text-xl font-semibold tracking-tight">SwarmOS</h1>
          <div className="flex items-center gap-4">
            <a href={ctaLink} className="text-sm text-gray-600 hover:text-black transition-colors">Login</a>
            <a href={ctaLink}>
              <button data-testid="nav-cta" className="bg-black text-white text-sm px-5 py-2 rounded-xl hover:bg-gray-800 transition-colors font-medium">
                Start Free Trial
              </button>
            </a>
          </div>
        </div>
      </nav>

      {/* Urgency bar */}
      <div className="fixed top-16 w-full bg-black text-white text-center py-2 z-40">
        <p className="text-sm font-medium">
          <Clock size={14} className="inline mr-1 -mt-0.5" />
          Limited beta: only <span className="text-yellow-400 font-bold">{spots} spots</span> left at this price
        </p>
      </div>

      {/* Hero */}
      <section className="pt-48 pb-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-gray-100 rounded-full px-4 py-1.5 mb-8">
            <div className="flex -space-x-2">
              <div className="w-6 h-6 rounded-full bg-gray-800 border-2 border-white" />
              <div className="w-6 h-6 rounded-full bg-gray-600 border-2 border-white" />
              <div className="w-6 h-6 rounded-full bg-gray-400 border-2 border-white" />
            </div>
            <p className="text-xs font-medium text-gray-600">Join 2,400+ sales teams already using SwarmOS</p>
          </div>

          <h1 data-testid="hero-heading" className="text-5xl sm:text-6xl font-semibold tracking-tight leading-[1.08] mb-6">
            Stop Hiring SDRs.<br />
            <span className="text-gray-400">Let AI Book Your Meetings.</span>
          </h1>

          <p className="text-lg text-gray-500 max-w-xl mx-auto mb-10 leading-relaxed">
            SwarmOS replaces your entire outbound team. AI finds leads, writes hyper-personalized emails, handles replies, and books qualified calls — on autopilot.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-6">
            <a href={ctaLink}>
              <button data-testid="hero-cta-primary" className="bg-black text-white px-8 py-4 rounded-xl hover:bg-gray-800 transition-colors font-medium flex items-center justify-center gap-2 w-full sm:w-auto text-lg">
                Start Free Trial <ArrowRight size={18} />
              </button>
            </a>
            <a href="#demo">
              <button data-testid="hero-cta-secondary" className="bg-white text-black border border-gray-200 px-8 py-4 rounded-xl hover:bg-gray-50 transition-colors font-medium flex items-center justify-center gap-2 w-full sm:w-auto">
                <Play size={16} /> Watch Demo
              </button>
            </a>
          </div>

          <p className="text-xs text-gray-400">No credit card required. Cancel anytime.</p>
        </div>
      </section>

      {/* Social proof bar */}
      <section className="py-16 px-6 border-y border-gray-100 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400 text-center mb-10">The numbers speak for themselves</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <Stat value="2,400+" label="Meetings booked" />
            <Stat value="$4.2M" label="Pipeline generated" />
            <Stat value="98%" label="Email deliverability" />
            <Stat value="3.2x" label="More replies than manual" />
          </div>
        </div>
      </section>

      {/* Video section */}
      <section id="demo" className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400 mb-4">See it in action</p>
          <h2 className="text-3xl sm:text-4xl font-medium tracking-tight mb-10">Watch how SwarmOS books meetings for you</h2>

          <div data-testid="video-section" className="relative aspect-video bg-black rounded-2xl overflow-hidden group cursor-pointer border border-gray-200 shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 bg-white/10 backdrop-blur rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-white/20 transition-colors">
                  <Play size={32} className="text-white ml-1" />
                </div>
                <p className="text-white/60 text-sm">2 min demo</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400 mb-4">Simple setup</p>
            <h2 className="text-3xl sm:text-4xl font-medium tracking-tight">Live in 5 minutes. Meetings by tomorrow.</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StepCard num="01" title="Tell us your ICP" desc="Define your ideal customer — industry, title, company size. Takes 60 seconds." />
            <StepCard num="02" title="AI does the work" desc="Our AI writes unique emails for each lead, sends them, and handles all replies automatically." />
            <StepCard num="03" title="Meetings on calendar" desc="Interested prospects get booking links. You just show up to qualified calls." />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400 mb-4">What people say</p>
            <h2 className="text-3xl sm:text-4xl font-medium tracking-tight">Trusted by sales leaders</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Testimonial
              quote="We replaced 3 SDRs with SwarmOS. Booking 40+ meetings per month now. ROI was instant."
              name="Marcus L."
              role="VP Sales, ScaleUp.io"
              stars={5}
            />
            <Testimonial
              quote="The AI emails are scary good. Reply rates went from 2% to 12% in the first week."
              name="Sarah K."
              role="Founder, LeadGen Pro"
              stars={5}
            />
            <Testimonial
              quote="Best investment we made this quarter. Paid for itself in 3 days."
              name="David R."
              role="Head of Growth, TechCorp"
              stars={5}
            />
          </div>
        </div>
      </section>

      {/* Pricing with anchoring */}
      <section id="pricing" className="py-24 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400 mb-4">Pricing</p>
            <h2 className="text-3xl sm:text-4xl font-medium tracking-tight mb-2">Invest in growth, not headcount</h2>
            <p className="text-gray-500 mb-2">One SDR costs $5,000+/mo. SwarmOS starts at $99.</p>
            <p className="text-sm text-red-500 font-medium">Beta pricing — increases soon</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-4xl mx-auto">
            {/* Starter */}
            <PricingCard
              name="Starter"
              price="99"
              period="/mo"
              desc="For solopreneurs getting started"
              features={["500 emails/month", "AI email generation", "Reply classification", "Basic analytics", "Email support"]}
              cta="Start Free Trial"
              ctaLink={ctaLink}
              testId="pricing-starter"
            />

            {/* Growth — POPULAR */}
            <PricingCard
              name="Growth"
              price="297"
              period="/mo"
              desc="For teams that want scale"
              features={["Unlimited emails", "AI sentiment analysis", "Auto meeting booking", "Advanced analytics", "Priority support", "Custom ICP targeting"]}
              cta="Start Free Trial"
              ctaLink={ctaLink}
              popular
              testId="pricing-growth"
            />

            {/* Lifetime */}
            <PricingCard
              name="Lifetime"
              price="497"
              period=" one-time"
              desc="Pay once, use forever"
              originalPrice="2,388"
              features={["Everything in Growth", "Lifetime access", "All future updates", "White-glove onboarding", "Dedicated Slack channel"]}
              cta="Get Lifetime Access"
              ctaLink={ctaLink}
              testId="pricing-lifetime"
            />
          </div>
        </div>
      </section>

      {/* Risk reversal */}
      <section className="py-16 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <Shield size={40} className="mx-auto mb-4 text-gray-400" />
          <h3 className="text-2xl font-medium tracking-tight mb-3">30-Day Money-Back Guarantee</h3>
          <p className="text-gray-500 leading-relaxed">
            Try SwarmOS risk-free. If you don't book at least 5 qualified meetings in 30 days, we'll refund every penny. No questions asked.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-medium tracking-tight text-center mb-12">Frequently asked questions</h2>
          {FAQS.map((faq, i) => (
            <FaqItem key={i} question={faq.q} answer={faq.a} open={openFaq === i} toggle={() => setOpenFaq(openFaq === i ? null : i)} />
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-6 bg-black text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-medium tracking-tight mb-4">
            Ready to automate your outbound?
          </h2>
          <p className="text-gray-400 mb-8 max-w-lg mx-auto">
            Join 2,400+ sales teams booking meetings on autopilot. Start free today — no credit card required.
          </p>
          <a href={ctaLink}>
            <button data-testid="final-cta" className="bg-white text-black px-10 py-4 rounded-xl hover:bg-gray-100 transition-colors font-medium text-lg flex items-center gap-2 mx-auto">
              Start Free Trial <ArrowRight size={18} />
            </button>
          </a>
          <p className="text-xs text-gray-500 mt-4">
            <Clock size={12} className="inline mr-1" />
            Only {spots} beta spots remaining
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm font-medium">SwarmOS</p>
          <div className="flex gap-6 text-sm text-gray-500">
            <a href="#pricing" className="hover:text-black transition-colors">Pricing</a>
            <a href="#demo" className="hover:text-black transition-colors">Demo</a>
            <span>Affiliate Program</span>
          </div>
          <p className="text-xs text-gray-400">&copy; 2026 SwarmOS. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

/* --- Sub-components --- */

function Stat({ value, label }) {
  return (
    <div>
      <p className="text-3xl md:text-4xl font-semibold tracking-tight">{value}</p>
      <p className="text-sm text-gray-500 mt-1">{label}</p>
    </div>
  );
}

function StepCard({ num, title, desc }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-8">
      <p className="text-xs font-semibold text-gray-400 mb-4">{num}</p>
      <h3 className="text-lg font-medium tracking-tight mb-2">{title}</h3>
      <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
    </div>
  );
}

function Testimonial({ quote, name, role, stars }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <div className="flex gap-0.5 mb-3">
        {[...Array(stars)].map((_, i) => <Star key={i} size={14} className="fill-yellow-400 text-yellow-400" />)}
      </div>
      <p className="text-sm text-gray-700 leading-relaxed mb-4">"{quote}"</p>
      <div>
        <p className="text-sm font-medium">{name}</p>
        <p className="text-xs text-gray-500">{role}</p>
      </div>
    </div>
  );
}

function PricingCard({ name, price, period, desc, features, cta, ctaLink, popular, originalPrice, testId }) {
  return (
    <div className={`rounded-xl p-8 text-left relative ${popular ? "bg-black text-white ring-2 ring-black" : "bg-white border border-gray-200"}`}>
      {popular && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-black text-xs font-semibold px-3 py-1 rounded-full">
          Most Popular
        </span>
      )}
      <p className={`text-sm font-semibold uppercase tracking-wider ${popular ? "text-gray-400" : "text-gray-500"}`}>{name}</p>
      <div className="mt-3 mb-1">
        {originalPrice && (
          <span className={`text-lg line-through mr-2 ${popular ? "text-gray-500" : "text-gray-400"}`}>${originalPrice}</span>
        )}
        <span className="text-4xl font-semibold">${price}</span>
        <span className={`text-sm ${popular ? "text-gray-400" : "text-gray-500"}`}>{period}</span>
      </div>
      <p className={`text-sm mb-6 ${popular ? "text-gray-400" : "text-gray-500"}`}>{desc}</p>
      <ul className="space-y-3 mb-8">
        {features.map((f, i) => (
          <li key={i} className="flex items-center gap-2">
            <Check size={16} className={popular ? "text-gray-400" : "text-gray-600"} />
            <span className={`text-sm ${popular ? "text-gray-300" : "text-gray-600"}`}>{f}</span>
          </li>
        ))}
      </ul>
      <a href={ctaLink}>
        <button
          data-testid={testId}
          className={`w-full px-6 py-3 rounded-xl font-medium transition-colors ${
            popular
              ? "bg-white text-black hover:bg-gray-100"
              : "bg-black text-white hover:bg-gray-800"
          }`}
        >
          {cta}
        </button>
      </a>
    </div>
  );
}

function FaqItem({ question, answer, open, toggle }) {
  return (
    <div className="border-b border-gray-200 py-5">
      <button onClick={toggle} className="flex justify-between items-center w-full text-left">
        <span className="text-sm font-medium">{question}</span>
        {open ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
      </button>
      {open && <p className="text-sm text-gray-500 mt-3 leading-relaxed">{answer}</p>}
    </div>
  );
}

const FAQS = [
  { q: "How quickly can I see results?", a: "Most users book their first meeting within 48 hours of setup. The AI starts prospecting immediately after you complete the 5-minute onboarding." },
  { q: "Will this end up in spam?", a: "No. We use advanced deliverability infrastructure with proper warm-up, authentication (SPF, DKIM, DMARC), and smart sending patterns. 98% inbox placement rate." },
  { q: "Can I customize the emails?", a: "Absolutely. You define your target audience and offer, and the AI generates unique, personalized emails for each prospect. You can preview and regenerate before launching." },
  { q: "What if I don't get results?", a: "We offer a 30-day money-back guarantee. If you don't book at least 5 qualified meetings, you get a full refund. No questions asked." },
  { q: "How does the affiliate program work?", a: "Earn 40% recurring commission on every referral. You get a unique link, and when someone signs up through it, you earn commission on every payment they make. Forever." },
  { q: "Can I cancel anytime?", a: "Yes. No contracts, no commitments. Cancel with one click from your dashboard. Your account stays active until the end of your billing period." },
];
