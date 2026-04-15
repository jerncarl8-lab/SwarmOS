import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Mail, Target, MessageSquare, BarChart3, ArrowRight } from "lucide-react";

const API = process.env.REACT_APP_BACKEND_URL;

const STEPS = [
  { icon: Mail, label: "Email", question: "What's your email?", placeholder: "you@company.com", field: "email" },
  { icon: Target, label: "Target", question: "Who do you want to target?", placeholder: "e.g SaaS founders, CTOs at startups", field: "target" },
  { icon: MessageSquare, label: "Offer", question: "What's your offer?", placeholder: "e.g We book meetings using AI", field: "offer" },
  { icon: BarChart3, label: "Volume", question: "Daily outreach volume?", placeholder: "e.g 200", field: "volume" },
];

export default function Onboarding() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  const handleNext = async () => {
    if (isLast) {
      setLoading(true);
      try {
        const res = await axios.post(`${API}/api/login`, { email: data.email });
        localStorage.setItem("user", JSON.stringify(res.data));

        await axios.post(`${API}/api/onboarding`, data);
        localStorage.setItem("onboarding", JSON.stringify(data));

        navigate("/dashboard");
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    } else {
      setStep(step + 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Progress */}
        <div className="flex items-center gap-2 mb-8">
          {STEPS.map((s, i) => (
            <div key={i} className="flex items-center gap-2 flex-1">
              <div className={`h-1.5 rounded-full flex-1 transition-colors ${i <= step ? "bg-black" : "bg-gray-200"}`} />
            </div>
          ))}
        </div>

        {/* Step labels */}
        <div className="flex justify-between mb-8">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={i} className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${i <= step ? "text-black" : "text-gray-400"}`}>
                <Icon size={14} />
                {s.label}
              </div>
            );
          })}
        </div>

        {/* Card */}
        <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400 mb-2">
            Step {step + 1} of {STEPS.length}
          </p>
          <h2 data-testid="onboarding-question" className="text-2xl font-medium tracking-tight mb-6">
            {current.question}
          </h2>

          <input
            data-testid="onboarding-input"
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-shadow mb-4"
            placeholder={current.placeholder}
            value={data[current.field] || ""}
            onChange={(e) => setData({ ...data, [current.field]: e.target.value })}
            onKeyDown={(e) => e.key === "Enter" && data[current.field] && handleNext()}
          />

          <button
            data-testid="onboarding-next-btn"
            onClick={handleNext}
            disabled={!data[current.field] || loading}
            className="w-full bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? "Launching..." : isLast ? "Launch AI System" : "Continue"}
            {!loading && <ArrowRight size={16} />}
          </button>
        </div>

        {step > 0 && (
          <button
            data-testid="onboarding-back-btn"
            onClick={() => setStep(step - 1)}
            className="mt-4 text-sm text-gray-500 hover:text-black transition-colors mx-auto block"
          >
            Back
          </button>
        )}
      </div>
    </div>
  );
}
