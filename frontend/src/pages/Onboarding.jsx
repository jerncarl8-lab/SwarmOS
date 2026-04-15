import { useState } from "react";
import Input from "../components/Input";
import Button from "../components/Button";

export default function Onboarding({ setUserData }) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({});

  const next = () => setStep(step + 1);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-96 bg-white p-6 rounded-2xl shadow">

        {step === 1 && (
          <>
            <h2 className="text-xl mb-4">Who do you want to target?</h2>
            <Input
              placeholder="e.g SaaS founders"
              onChange={(e) =>
                setData({ ...data, target: e.target.value })
              }
            />
            <Button onClick={next}>Next</Button>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="text-xl mb-4">What's your offer?</h2>
            <Input
              placeholder="e.g We book meetings"
              onChange={(e) =>
                setData({ ...data, offer: e.target.value })
              }
            />
            <Button onClick={next}>Next</Button>
          </>
        )}

        {step === 3 && (
          <>
            <h2 className="text-xl mb-4">Daily outreach volume?</h2>
            <Input
              placeholder="e.g 200"
              onChange={(e) =>
                setData({ ...data, volume: e.target.value })
              }
            />
            <Button onClick={() => setUserData(data)}>
              Launch AI System
            </Button>
          </>
        )}

      </div>
    </div>
  );
}
