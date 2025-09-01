import { RiskManagement } from "@/components/risk/risk-management";
import { Navigation } from "@/components/ui/navigation";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useOnboardingSession } from "@/hooks/use-onboarding-session";

const Risk = () => {
  const navigate = useNavigate();
  const { currentStep, setCurrentStep } = useOnboardingSession();

  useEffect(() => {
    setCurrentStep(5);
  }, [setCurrentStep]);

  const handleStepChange = (step: number) => {
    setCurrentStep(step);
    if (step === 4) {
      navigate("/compare");
    } else if (step < 4) {
      navigate("/");
    }
  };

  return (
    <>
      <Navigation currentStep={currentStep} onStepChange={handleStepChange} />
      <RiskManagement />
    </>
  );
};

export default Risk;
