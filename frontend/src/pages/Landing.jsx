import { Mail, Target, Calendar, Zap, ArrowRight, Check } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav data-testid="landing-navbar" className="fixed top-0 w-full bg-white/80 backdrop-blur-xl border-b border-gray-200 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <h1 className="text-xl font-semibold tracking-tight">SwarmOS</h1>
          <div className="flex items-center gap-4">
            <a href="/app" className="text-sm text-gray-600 hover:text-black transition-colors">Login</a>
            <a href="/app">
              <button data-testid="nav-cta" className="bg-black text-white text-sm px-5 py-2 rounded-xl hover:bg-gray-800 transition-colors font-medium">
                Start Free Trial
              </button>
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-40 pb-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500 mb-6">AI-Powered Sales Automation</p>
          <h1 data-testid="hero-heading" className="text-5xl sm:text-6xl font-semibold tracking-tight leading-[1.1] mb-6">
            Get Meetings Booked<br />Automatically
          </h1>
          <p className="text-lg text-gray-500 max-w-xl mx-auto mb-10 leading-relaxed">
            Replace your outbound team with AI that finds leads, writes emails, and books qualified calls. No manual work.
          </p>
          <div className="flex justify-center gap-4">
            <a href="/app">
              <button data-testid="hero-cta-primary" className="bg-black text-white px-8 py-3.5 rounded-xl hover:bg-gray-800 transition-colors font-medium flex items-center gap-2">
                Start Free Trial <ArrowRight size={16} />
              </button>
            </a>
            <a href="/app">
              <button data-testid="hero-cta-secondary" className="bg-white text-black border border-gray-200 px-8 py-3.5 rounded-xl hover:bg-gray-50 transition-colors font-medium">
                Book Demo
              </button>
            </a>
          </div>
        </div>
      </section>

      {/* Social proof */}
      <section className="pb-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400 mb-8">Trusted by sales teams everywhere</p>
          <div className="grid grid-cols-3 gap-12">
            <div>
              <p className="text-4xl font-semibold tracking-tight">2,400+</p>
              <p className="text-sm text-gray-500 mt-1">Meetings booked</p>
            </div>
            <div>
              <p className="text-4xl font-semibold tracking-tight">98%</p>
              <p className="text-sm text-gray-500 mt-1">Deliverability rate</p>
            </div>
            <div>
              <p className="text-4xl font-semibold tracking-tight">3.2x</p>
              <p className="text-sm text-gray-500 mt-1">More replies vs manual</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features bento grid */}
      <section className="pb-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-medium tracking-tight">How it works</h2>
            <p className="text-gray-500 mt-3">Four steps to fully automated outbound</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FeatureCard
              icon={<Target size={20} />}
              title="1. Define your ICP"
              description="Tell us who you want to reach — industry, title, company size. Our AI finds the right leads."
            />
            <FeatureCard
              icon={<Mail size={20} />}
              title="2. AI writes your emails"
              description="Personalized cold emails generated for each lead. No templates. Every email is unique."
            />
            <FeatureCard
              icon={<Zap size={20} />}
              title="3. Automated outreach"
              description="Emails sent at optimal times. Replies classified by AI. Follow-ups handled automatically."
            />
            <FeatureCard
              icon={<Calendar size={20} />}
              title="4. Meetings booked"
              description="Interested replies get a booking link. Meetings appear on your calendar. You just show up."
            />
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="pb-24 px-6 bg-gray-50">
        <div className="max-w-3xl mx-auto pt-24 text-center">
          <h2 className="text-3xl sm:text-4xl font-medium tracking-tight mb-4">Simple pricing</h2>
          <p className="text-gray-500 mb-12">Start free. Upgrade when you're ready.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <div className="bg-white border border-gray-200 rounded-xl p-8 text-left">
              <p className="text-sm font-semibold uppercase tracking-wider text-gray-500">Free</p>
              <p className="text-4xl font-semibold mt-2">$0</p>
              <p className="text-sm text-gray-500 mt-1">per month</p>
              <ul className="mt-6 space-y-3">
                <PricingItem text="50 emails/month" />
                <PricingItem text="AI email generation" />
                <PricingItem text="Basic analytics" />
              </ul>
              <a href="/app">
                <button data-testid="pricing-free-cta" className="w-full mt-8 bg-white text-black border border-gray-200 px-6 py-3 rounded-xl hover:bg-gray-50 transition-colors font-medium">
                  Get Started
                </button>
              </a>
            </div>

            <div className="bg-black text-white rounded-xl p-8 text-left">
              <p className="text-sm font-semibold uppercase tracking-wider text-gray-400">Pro</p>
              <p className="text-4xl font-semibold mt-2">$99</p>
              <p className="text-sm text-gray-400 mt-1">per month</p>
              <ul className="mt-6 space-y-3">
                <PricingItem text="Unlimited emails" light />
                <PricingItem text="AI sentiment analysis" light />
                <PricingItem text="Auto meeting booking" light />
                <PricingItem text="Priority support" light />
              </ul>
              <a href="/app">
                <button data-testid="pricing-pro-cta" className="w-full mt-8 bg-white text-black px-6 py-3 rounded-xl hover:bg-gray-100 transition-colors font-medium">
                  Start Free Trial
                </button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-12 px-6">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <p className="text-sm text-gray-500">SwarmOS</p>
          <p className="text-sm text-gray-400">AI-powered sales automation</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 hover:-translate-y-1 hover:shadow-md transition-all">
      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-medium tracking-tight mb-2">{title}</h3>
      <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
    </div>
  );
}

function PricingItem({ text, light }) {
  return (
    <li className="flex items-center gap-2">
      <Check size={16} className={light ? "text-gray-400" : "text-gray-600"} />
      <span className={`text-sm ${light ? "text-gray-300" : "text-gray-600"}`}>{text}</span>
    </li>
  );
}
