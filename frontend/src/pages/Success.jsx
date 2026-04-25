import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { Check, ArrowRight } from "lucide-react";

const API = process.env.REACT_APP_BACKEND_URL;

export default function Success() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [status, setStatus] = useState("checking");

  useEffect(() => {
    if (!sessionId) { setStatus("error"); return; }

    let attempts = 0;
    const poll = async () => {
      try {
        const res = await axios.get(`${API}/api/checkout/status/${sessionId}`);
        if (res.data.payment_status === "paid") {
          setStatus("paid");
        } else if (res.data.status === "expired") {
          setStatus("expired");
        } else if (attempts < 5) {
          attempts++;
          setTimeout(poll, 2000);
        } else {
          setStatus("pending");
        }
      } catch {
        setStatus("error");
      }
    };
    poll();
  }, [sessionId]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white border border-gray-200 rounded-xl p-10 text-center shadow-sm">
        {status === "checking" && (
          <>
            <div className="w-12 h-12 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-6" />
            <h2 className="text-2xl font-medium tracking-tight mb-2">Processing payment...</h2>
            <p className="text-sm text-gray-500">Please wait while we confirm your payment.</p>
          </>
        )}

        {status === "paid" && (
          <>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check size={32} className="text-green-600" />
            </div>
            <h2 className="text-2xl font-medium tracking-tight mb-2">Welcome to Pro!</h2>
            <p className="text-sm text-gray-500 mb-8">Your account has been upgraded. Time to book some meetings.</p>
            <a href="/dashboard">
              <button data-testid="success-dashboard-btn" className="bg-black text-white px-8 py-3 rounded-xl hover:bg-gray-800 transition-colors font-medium flex items-center justify-center gap-2 mx-auto">
                Go to Dashboard <ArrowRight size={16} />
              </button>
            </a>
          </>
        )}

        {(status === "pending" || status === "expired" || status === "error") && (
          <>
            <h2 className="text-2xl font-medium tracking-tight mb-2">
              {status === "pending" ? "Payment processing" : "Something went wrong"}
            </h2>
            <p className="text-sm text-gray-500 mb-8">
              {status === "pending"
                ? "Your payment is still being processed. You'll receive a confirmation email shortly."
                : "Please try again or contact support."}
            </p>
            <a href="/dashboard">
              <button className="bg-black text-white px-8 py-3 rounded-xl hover:bg-gray-800 transition-colors font-medium">
                Back to Dashboard
              </button>
            </a>
          </>
        )}
      </div>
    </div>
  );
}
