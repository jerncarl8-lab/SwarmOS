import { useState, useEffect } from "react";
import { ArrowRight, Check, Shield, Clock, Zap, Star, Play, ChevronDown, ChevronUp, TrendingUp, DollarSign, Timer, X } from "lucide-react";

export default function Landing() {
  const [openFaq, setOpenFaq] = useState(null);
  const [spots, setSpots] = useState(14);
  const [notification, setNotification] = useState(null);
  const [showExit, setShowExit] = useState(false);
  const [countdown, setCountdown] = useState({ h: 2, m: 47, s: 33 });

  const params = new URLSearchParams(window.location.search);
  const ref = params.get("ref") || params.get("hop") || "";
  const ctaLink = ref ? `/app?ref=${ref}` : "/app";

  // Countdown timer
  useEffect(() => {
    const t = setInterval(() => {
      setCountdown((c) => {
        let { h, m, s } = c;
        s--;
        if (s < 0) { s = 59; m--; }
        if (m < 0) { m = 59; h--; }
        if (h < 0) { h = 2; m = 47; s = 33; }
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(t);
  }, []);

  // Fake live notifications
  useEffect(() => {
    const names = ["Marcus from Stockholm", "Sarah from London", "David from NYC", "Emma from Berlin", "Alex from Toronto", "Lisa from Sydney", "Johan from Oslo", "Maria from Amsterdam"];
    const actions = ["just booked 3 meetings", "signed up 2 min ago", "upgraded to Growth", "booked their first demo", "just launched their AI"];
    let i = 0;
    const show = () => {
      setNotification(`${names[i % names.length]} ${actions[i % actions.length]}`);
      setTimeout(() => setNotification(null), 4000);
      i++;
    };
    const t = setInterval(show, 12000);
    setTimeout(show, 5000);
    return () => clearInterval(t);
  }, []);

  // Exit intent
  useEffect(() => {
    const handle = (e) => {
      if (e.clientY < 10 && !showExit) setShowExit(true);
    };
    document.addEventListener("mouseleave", handle);
    return () => document.removeEventListener("mouseleave", handle);
  }, [showExit]);

  const pad = (n) => String(n).padStart(2, "0");

  return (
    <div className="min-h-screen bg-white">
      {/* Live notification toast */}
      {notification && (
        <div className="fixed bottom-24 left-6 z-50 animate-slide-up">
          <div className="bg-white border border-gray-200 rounded-xl shadow-lg px-5 py-3 flex items-center gap-3 max-w-sm">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Check size={14} className="text-green-600" />
            </div>
            <p className="text-sm text-gray-700">{notification}</p>
          </div>
        </div>
      )}

      {/* Exit intent modal */}
      {showExit && (
        <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl p-10 max-w-md w-full text-center relative">
            <button onClick={() => setShowExit(false)} className="absolute top-4 right-4 text-gray-400 hover:text-black">
              <X size={20} />
            </button>
            <h3 className="text-2xl font-semibold tracking-tight mb-3">Wait — don't leave money on the table</h3>
            <p className="text-gray-500 text-sm mb-6">
              Companies using SwarmOS book 40+ meetings per month. That's $200K+ in pipeline you're walking away from.
            </p>
            <a href={ctaLink}>
              <button className="w-full bg-black text-white px-6 py-3.5 rounded-xl hover:bg-gray-800 transition-colors font-medium text-lg">
                Try It Free — No Risk
              </button>
            </a>
            <p className="text-xs text-gray-400 mt-3">30-day money-back guarantee</p>
          </div>
        </div>
      )}

      {/* Sticky nav */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-xl border-b border-gray-200 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <h1 className="text-xl font-semibold tracking-tight">SwarmOS</h1>
          <div className="flex items-center gap-4">
            <a href={ctaLink} className="text-sm text-gray-600 hover:text-black transition-colors">Login</a>
            <a href={ctaLink}>
              <button data-testid="nav-cta" className="bg-black text-white text-sm px-5 py-2 rounded-xl hover:bg-gray-800 transition-colors font-medium">
                Start Free
              </button>
            </a>
          </div>
        </div>
      </nav>

      {/* Urgency bar with countdown */}
      <div className="fixed top-16 w-full bg-black text-white text-center py-2.5 z-40">
        <p className="text-sm font-medium">
          Beta price ends in{" "}
          <span className="inline-flex gap-1 font-mono text-yellow-400 font-bold">
            {pad(countdown.h)}:{pad(countdown.m)}:{pad(countdown.s)}
          </span>
          {" "} — only <span className="text-yellow-400 font-bold">{spots} spots</span> left
        </p>
      </div>

      {/* Hero */}
      <section className="pt-48 pb-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-4 py-1.5 mb-8">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <p className="text-xs font-medium text-green-700">2,847 meetings booked this month</p>
          </div>

          <h1 data-testid="hero-heading" className="text-5xl sm:text-6xl font-semibold tracking-tight leading-[1.08] mb-6">
            We Give You Time.<br />
            <span className="text-gray-400">AI Gives You Money.</span>
          </h1>

          <p className="text-lg text-gray-500 max-w-xl mx-auto mb-10 leading-relaxed">
            Stop wasting 40 hours/week on cold outreach. SwarmOS does it in minutes — and books 3x more meetings than your best SDR.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-6">
            <a href={ctaLink}>
              <button data-testid="hero-cta-primary" className="bg-black text-white px-10 py-4 rounded-xl hover:bg-gray-800 transition-all font-medium flex items-center justify-center gap-2 w-full sm:w-auto text-lg hover:scale-[1.02] active:scale-[0.98]">
                Start Free — Book Meetings Today <ArrowRight size={18} />
              </button>
            </a>
          </div>

          <div className="flex justify-center gap-6 text-xs text-gray-400">
            <span className="flex items-center gap-1"><Check size={12} /> No credit card</span>
            <span className="flex items-center gap-1"><Check size={12} /> Setup in 5 min</span>
            <span className="flex items-center gap-1"><Check size={12} /> Cancel anytime</span>
          </div>
        </div>
      </section>

      {/* Before / After — selling TIME and MONEY */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400 mb-4">The difference</p>
            <h2 className="text-3xl sm:text-4xl font-medium tracking-tight">What changes when you switch</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Without */}
            <div className="bg-red-50 border border-red-100 rounded-xl p-8">
              <p className="text-sm font-semibold text-red-400 uppercase tracking-wider mb-4">Without SwarmOS</p>
              <ul className="space-y-4">
                <CompareItem bad text="40+ hours/week on manual outreach" />
                <CompareItem bad text="$5,000–$8,000/month per SDR" />
                <CompareItem bad text="2% reply rate on cold emails" />
                <CompareItem bad text="5–10 meetings/month (maybe)" />
                <CompareItem bad text="Burnout, turnover, training costs" />
              </ul>
            </div>
            {/* With */}
            <div className="bg-green-50 border border-green-100 rounded-xl p-8">
              <p className="text-sm font-semibold text-green-600 uppercase tracking-wider mb-4">With SwarmOS</p>
              <ul className="space-y-4">
                <CompareItem text="5 minutes to set up, runs 24/7" />
                <CompareItem text="$99/month — 50x cheaper than an SDR" />
                <CompareItem text="12% reply rate with AI personalization" />
                <CompareItem text="40+ qualified meetings/month" />
                <CompareItem text="Zero management. Pure results." />
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ROI section */}
      <section className="py-20 px-6 bg-black text-white">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500 mb-4">The math is simple</p>
          <h2 className="text-3xl sm:text-4xl font-medium tracking-tight mb-12">Your return on investment</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ROICard icon={<Timer size={24} />} value="160 hrs" label="Saved per month" sub="That's an entire employee" />
            <ROICard icon={<DollarSign size={24} />} value="$50K+" label="Pipeline per month" sub="From automated outreach" />
            <ROICard icon={<TrendingUp size={24} />} value="50x" label="ROI on your $99" sub="Average client result" />
          </div>
        </div>
      </section>

      {/* Video */}
      <section id="demo" className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400 mb-4">See it in action</p>
          <h2 className="text-3xl sm:text-4xl font-medium tracking-tight mb-4">Watch how SwarmOS books meetings for you</h2>
          <p className="text-gray-500 mb-10">See exactly how SwarmOS books meetings while you sleep</p>
          <div data-testid="video-section" className="relative aspect-video rounded-2xl overflow-hidden group cursor-pointer shadow-2xl border border-gray-200">
            <img
              src="https://static.prod-images.emergentagent.com/jobs/597bc99a-56de-4230-9f62-64151ef4223c/images/55e473cf5eda62a15acdb08b433a7adafba79b4083b3d64a40b940c965419498.png"
              alt="SwarmOS Dashboard Demo"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/40 transition-colors">
              <div className="text-center">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-white/30 transition-all group-hover:scale-110">
                  <Play size={32} className="text-white ml-1" />
                </div>
                <p className="text-white/80 text-sm font-medium">Watch 2 min demo</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400 mb-4">Dead simple</p>
            <h2 className="text-3xl sm:text-4xl font-medium tracking-tight">3 steps. 5 minutes. Meetings tomorrow.</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StepCard num="01" title="Tell us who to target" desc="SaaS founders? CTOs? VPs of Sales? Define it once. AI handles the rest." time="60 sec" />
            <StepCard num="02" title="AI writes & sends" desc="Unique, personalized emails for every single prospect. Not templates — real conversations." time="Automatic" />
            <StepCard num="03" title="Meetings appear" desc="Interested replies get booking links instantly. You just show up to qualified calls." time="24-48 hrs" />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400 mb-4">Real results</p>
            <h2 className="text-3xl sm:text-4xl font-medium tracking-tight">People who took action</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Testimonial
              quote="Replaced 3 SDRs. Now booking 47 meetings/month at $99 instead of $15,000. The ROI is insane."
              name="Marcus L."
              role="VP Sales, ScaleUp.io"
              result="47 meetings/month"
            />
            <Testimonial
              quote="Set it up during lunch. Had 3 replies by dinner. First meeting booked next morning. This is the future."
              name="Sarah K."
              role="Founder, LeadGen Pro"
              result="First meeting in 24hrs"
            />
            <Testimonial
              quote="We tried 6 outbound tools. This is the only one that actually books meetings. Paid for itself in 2 days."
              name="David R."
              role="Head of Growth, TechCorp"
              result="ROI in 48 hours"
            />
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400 mb-4">Choose your plan</p>
            <h2 className="text-3xl sm:text-4xl font-medium tracking-tight mb-2">One SDR = $5,000/mo. SwarmOS = $99.</h2>
            <p className="text-sm text-red-500 font-medium">Beta pricing closes in {pad(countdown.h)}:{pad(countdown.m)}:{pad(countdown.s)}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-4xl mx-auto">
            <PricingCard
              name="Starter" price="99" period="/mo"
              desc="Perfect to test the waters"
              features={["500 AI emails/month", "Reply classification", "Basic analytics", "Email support"]}
              cta="Start Free Trial" ctaLink={ctaLink} testId="pricing-starter"
            />
            <PricingCard
              name="Growth" price="297" period="/mo"
              desc="For serious revenue teams"
              features={["Unlimited AI emails", "Auto meeting booking", "Sentiment analysis", "Advanced analytics", "Priority support", "Custom ICP targeting"]}
              cta="Start Free Trial" ctaLink={ctaLink} popular testId="pricing-growth"
            />
            <PricingCard
              name="Lifetime" price="497" period=" once"
              desc="Pay once. Profit forever."
              originalPrice="2,388"
              features={["Everything in Growth", "Lifetime access forever", "All future updates free", "1-on-1 onboarding call", "Private Slack channel"]}
              cta="Lock In Lifetime" ctaLink={ctaLink} testId="pricing-lifetime"
            />
          </div>
        </div>
      </section>

      {/* Guarantee */}
      <section className="py-16 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <Shield size={40} className="mx-auto mb-4 text-gray-400" />
          <h3 className="text-2xl font-medium tracking-tight mb-3">30-Day Money-Back Guarantee</h3>
          <p className="text-gray-500 leading-relaxed">
            If SwarmOS doesn't book you at least 5 qualified meetings in 30 days, you get 100% of your money back. No questions. No hassle. You literally can't lose.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-medium tracking-tight text-center mb-12">Common questions</h2>
          {FAQS.map((faq, i) => (
            <FaqItem key={i} question={faq.q} answer={faq.a} open={openFaq === i} toggle={() => setOpenFaq(openFaq === i ? null : i)} />
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-6 bg-black text-white">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-yellow-400 text-sm font-semibold mb-4">You've scrolled this far. You know this works.</p>
          <h2 className="text-3xl sm:text-4xl font-medium tracking-tight mb-4">
            Every day without SwarmOS is money left on the table
          </h2>
          <p className="text-gray-400 mb-8 max-w-lg mx-auto">
            Your competitors are already automating their outbound. Start today — get your first meeting by tomorrow.
          </p>
          <a href={ctaLink}>
            <button data-testid="final-cta" className="bg-white text-black px-10 py-4 rounded-xl hover:bg-gray-100 transition-all font-medium text-lg flex items-center gap-2 mx-auto hover:scale-[1.02] active:scale-[0.98]">
              Start Free — Zero Risk <ArrowRight size={18} />
            </button>
          </a>
          <p className="text-xs text-gray-500 mt-4">
            Only {spots} beta spots left. 30-day guarantee. No credit card.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 bg-black text-white py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm font-medium">SwarmOS</p>
          <div className="flex gap-6 text-sm text-gray-500">
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="#demo" className="hover:text-white transition-colors">Demo</a>
            <span>Affiliates (40% commission)</span>
          </div>
          <p className="text-xs text-gray-600">&copy; 2026 SwarmOS. All rights reserved.</p>
        </div>
      </footer>

      <style>{`
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up { animation: slide-up 0.3s ease-out; }
      `}</style>
    </div>
  );
}

function CompareItem({ text, bad }) {
  return (
    <li className="flex items-start gap-3">
      {bad ? (
        <X size={16} className="text-red-400 mt-0.5 flex-shrink-0" />
      ) : (
        <Check size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
      )}
      <span className={`text-sm ${bad ? "text-red-700" : "text-green-800"}`}>{text}</span>
    </li>
  );
}

function ROICard({ icon, value, label, sub }) {
  return (
    <div className="text-center">
      <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mx-auto mb-4">{icon}</div>
      <p className="text-4xl font-semibold tracking-tight">{value}</p>
      <p className="text-sm text-gray-400 mt-1">{label}</p>
      <p className="text-xs text-gray-600 mt-1">{sub}</p>
    </div>
  );
}

function StepCard({ num, title, desc, time }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-8">
      <div className="flex justify-between items-start mb-4">
        <p className="text-xs font-semibold text-gray-400">{num}</p>
        <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full">{time}</span>
      </div>
      <h3 className="text-lg font-medium tracking-tight mb-2">{title}</h3>
      <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
    </div>
  );
}

function Testimonial({ quote, name, role, result }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <div className="flex gap-0.5 mb-3">
        {[...Array(5)].map((_, i) => <Star key={i} size={14} className="fill-yellow-400 text-yellow-400" />)}
      </div>
      <p className="text-sm text-gray-700 leading-relaxed mb-4">"{quote}"</p>
      <div className="flex justify-between items-end">
        <div>
          <p className="text-sm font-medium">{name}</p>
          <p className="text-xs text-gray-500">{role}</p>
        </div>
        <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full font-medium">{result}</span>
      </div>
    </div>
  );
}

function PricingCard({ name, price, period, desc, features, cta, ctaLink, popular, originalPrice, testId }) {
  return (
    <div className={`rounded-xl p-8 text-left relative ${popular ? "bg-black text-white ring-2 ring-black" : "bg-white border border-gray-200"}`}>
      {popular && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-black text-xs font-semibold px-3 py-1 rounded-full">
          Best Value
        </span>
      )}
      <p className={`text-sm font-semibold uppercase tracking-wider ${popular ? "text-gray-400" : "text-gray-500"}`}>{name}</p>
      <div className="mt-3 mb-1">
        {originalPrice && <span className={`text-lg line-through mr-2 ${popular ? "text-gray-500" : "text-gray-400"}`}>${originalPrice}</span>}
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
        <button data-testid={testId} className={`w-full px-6 py-3 rounded-xl font-medium transition-all hover:scale-[1.02] active:scale-[0.98] ${popular ? "bg-white text-black hover:bg-gray-100" : "bg-black text-white hover:bg-gray-800"}`}>
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
  { q: "How fast will I see results?", a: "Most users get their first reply within 24 hours and first meeting booked within 48 hours. The AI starts prospecting the moment you finish the 5-minute setup." },
  { q: "Will emails land in spam?", a: "No. We use enterprise-grade deliverability infrastructure — SPF, DKIM, DMARC authentication, smart warm-up, and optimal sending patterns. 98% inbox placement rate." },
  { q: "Is this better than hiring an SDR?", a: "A good SDR costs $5,000-$8,000/month, takes 3 months to ramp, and handles 50 emails/day. SwarmOS costs $99/month, starts in 5 minutes, and sends 500+ personalized emails per day. You do the math." },
  { q: "What if it doesn't work for me?", a: "You're covered by our 30-day money-back guarantee. If you don't book at least 5 qualified meetings, you get a full refund. Zero risk." },
  { q: "Can I earn money referring others?", a: "Yes! Our affiliate program pays 40% recurring commission. Share your unique link, and earn on every payment your referrals make. Some affiliates earn $5K+/month." },
  { q: "Can I cancel anytime?", a: "Yes. No contracts, no commitments. Cancel with one click. Your account stays active until the end of your billing period." },
];
