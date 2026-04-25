import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { Mail, Target, MessageSquare, BarChart3, ArrowRight, Sparkles, RefreshCw } from "lucide-react";

const API = process.env.REACT_APP_BACKEND_URL;

const STEPS = [
  { icon: Mail, label: "Email", question: "What's your email?", placeholder: "you@company.com", field: "email" },
  { icon: Target, label: "Target", question: "Who do you want to target?", placeholder: "e.g SaaS founders, CTOs at startups", field: "target" },
  { icon: MessageSquare, label: "Offer", question: "What's your offer?", placeholder: "e.g We book meetings using AI", field: "offer" },
  { icon: BarChart3, label: "Volume", question: "Daily outreach volume?", placeholder: "e.g 200", field: "volume" },
  { icon: Sparkles, label: "Preview", question: "Here's what your AI will send", placeholder: "", field: "_preview" },
];

export default function Onboarding() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState("");
  const [generating, setGenerating] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const ref = searchParams.get("ref") || "";

  const current = STEPS[step];
  const isPreview = step === 4;
  const isLast = step === STEPS.length - 1;

  const generatePreview = async () => {
    setGenerating(true);
    try {
      const res = await axios.post(`${API}/api/generate-email`, {
        target: data.target,
        offer: data.offer,
      });
      setPreview(res.data.content);
    } catch (err) {
      setPreview("Hey [First Name],\n\nI noticed [Company] is scaling fast. We help teams like yours book qualified meetings on autopilot using AI.\n\nWould it make sense to chat for 15 min this week?\n\nBest");
    }
    setGenerating(false);
  };

  const handleNext = async () => {
    if (step === 3) {
      // Moving to preview step — generate AI email
      setStep(4);
      generatePreview();
      return;
    }

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
            <div key={i} className="flex-1">
              <div className={`h-1.5 rounded-full transition-colors ${i <= step ? "bg-black" : "bg-gray-200"}`} />
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

          {isPreview ? (
            /* AI Preview */
            <div>
              {generating ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mb-4" />
                  <p className="text-sm text-gray-500">AI is writing your first email...</p>
                </div>
              ) : (
                <>
                  <div data-testid="ai-preview-email" className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-4 min-h-[120px]">
                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{preview}</p>
                  </div>
                  <button
                    data-testid="regenerate-btn"
                    onClick={generatePreview}
                    className="flex items-center gap-2 text-sm text-gray-500 hover:text-black transition-colors mb-4"
                  >
                    <RefreshCw size={14} />
                    Regenerate
                  </button>
                </>
              )}

              <button
                data-testid="onboarding-launch-btn"
                onClick={handleNext}
                disabled={loading || generating}
                className="w-full bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {loading ? "Launching..." : "Launch AI System"}
                {!loading && <Sparkles size={16} />}
              </button>
            </div>
          ) : (
            /* Regular input step */
            <>
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
                disabled={!data[current.field]}
                className="w-full bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Continue
                <ArrowRight size={16} />
              </button>
            </>
          )}
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
