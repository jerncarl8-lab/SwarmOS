import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "@/components/Input";
import Button from "@/components/Button";
import axios from "axios";

const API = process.env.REACT_APP_BACKEND_URL;

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({});
  const navigate = useNavigate();

  const next = () => setStep(step + 1);

  const launch = async () => {
    const res = await axios.post(`${API}/api/login`, { email: data.email });
    localStorage.setItem("user", JSON.stringify(res.data));
    localStorage.setItem("onboarding", JSON.stringify(data));
    navigate("/dashboard");
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-96 bg-white p-6 rounded-2xl shadow">

        {step === 1 && (
          <>
            <h2 className="text-xl mb-4">What's your email?</h2>
            <Input
              placeholder="you@company.com"
              onChange={(e) => setData({ ...data, email: e.target.value })}
            />
            <div className="mt-3">
              <Button onClick={next}>Next</Button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="text-xl mb-4">Who do you want to target?</h2>
            <Input
              placeholder="e.g SaaS founders"
              onChange={(e) => setData({ ...data, target: e.target.value })}
            />
            <div className="mt-3">
              <Button onClick={next}>Next</Button>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <h2 className="text-xl mb-4">What's your offer?</h2>
            <Input
              placeholder="e.g We book meetings"
              onChange={(e) => setData({ ...data, offer: e.target.value })}
            />
            <div className="mt-3">
              <Button onClick={next}>Next</Button>
            </div>
          </>
        )}

        {step === 4 && (
          <>
            <h2 className="text-xl mb-4">Daily outreach volume?</h2>
            <Input
              placeholder="e.g 200"
              onChange={(e) => setData({ ...data, volume: e.target.value })}
            />
            <div className="mt-3">
              <Button onClick={launch}>Launch AI System</Button>
            </div>
          </>
        )}

      </div>
    </div>
  );
}
